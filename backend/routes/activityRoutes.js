const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// @desc    Log a new activity
// @route   POST /api/activities
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { type, value, exerciseDetails } = req.body;
        console.log('Incoming Activity Request:', { type, value, exerciseDetails });

        let finalValue = Number(value || 0);
        
        // Note: For 'exercise' type, the value sent from frontend now represents Duration (mins).
        // We no longer override it with a mock calorie calculation to respect user's data integrity.
        console.log(`Logging ${type} with value: ${finalValue}`);

        console.log('Attempting to create Activity with finalValue:', finalValue);

        const activity = await Activity.create({
            user: req.user._id,
            type,
            value: isNaN(finalValue) ? 0 : finalValue,
            exerciseDetails: type === 'exercise' && exerciseDetails ? {
                name: exerciseDetails.name || 'Unknown Exercise',
                reps: Number(exerciseDetails.reps || 0),
                sets: Number(exerciseDetails.sets || 0),
                weight: Number(exerciseDetails.weight || 0),
                restTime: Number(exerciseDetails.restTime || 0),
                notes: exerciseDetails.notes || ''
            } : undefined
        });

        console.log('Activity created successfully:', activity._id);

        const user = await User.findById(req.user._id);
        if (!user) throw new Error('User context lost during session');

        // 1. Update general stats
        if (type === 'steps') {
            user.stats.totalSteps += Number(value || 0);
        }

        // 2. Update Streak & Last Active
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.stats.lastActiveDate) {
            const lastActive = new Date(user.stats.lastActiveDate);
            lastActive.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today - lastActive);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                user.stats.currentStreak += 1;
            } else if (diffDays > 1) {
                // Streak broken
                user.stats.currentStreak = 1;
            }
            // If diffDays === 0, it's the same day, don't increment streak
        } else {
            // First activity ever
            user.stats.currentStreak = 1;
        }

        user.stats.lastActiveDate = new Date();
        user.stats.motivationStatus = 'Consistent';

        // 3. Update Challenge Progress
        const activeChallenges = await Challenge.find({
            'participants.user': req.user._id,
            type: type 
        });

        for (const challenge of activeChallenges) {
            const startDate = new Date(challenge.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + challenge.durationDays);
            if (new Date() > endDate) continue;

            const participant = challenge.participants.find(p => p.user.toString() === req.user._id.toString());
            if (participant && participant.status !== 'completed') {
                participant.progress += finalValue;
                
                // Use personalized goal if it exists (for adaptive challenges)
                const targetGoal = (challenge.isAdaptive && participant.personalizedGoal) ? participant.personalizedGoal : challenge.goal;

                if (participant.progress >= targetGoal) {
                    participant.status = 'completed';
                    user.stats.challengesCompleted += 1;
                }
                await challenge.save();
            }
        }

        // Single save for all stat changes
        await user.save(); 

        res.status(201).json(activity);
    } catch (error) {
        console.error('ACTIVITY_SYNC_CRITICAL_FAILURE:', error);
        res.status(400).json({ 
            message: error.message || 'Failed to sync activity data',
            details: error.name
        });
    }
});

// @desc    Get analytics data for charts
// @route   GET /api/activities/analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activities = await Activity.find({
            user: req.user._id,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        // Group by day
        const analytics = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            analytics[dateStr] = { calories: 0, steps: 0, volume: 0, duration: 0 };
        }

        activities.forEach(act => {
            const dateStr = act.date.toISOString().split('T')[0];
            if (!analytics[dateStr]) {
                analytics[dateStr] = { date: dateStr, steps: 0, calories: 0, volume: 0, duration: 0 };
            }

            if (act.type === 'steps') analytics[dateStr].steps += act.value;
            if (act.type === 'exercise') {
                // act.value now represents Duration (mins).
                analytics[dateStr].duration += act.value;
                // Estimate calories: ~5 kcal per minute of lifting as a baseline
                analytics[dateStr].calories += (act.value * 5); 
                if (act.exerciseDetails) {
                    analytics[dateStr].volume += (act.exerciseDetails.reps || 0) * (act.exerciseDetails.sets || 0) * (act.exerciseDetails.weight || 0);
                }
            }
            if (act.type === 'calories') {
                analytics[dateStr].calories += act.value;
            }
            if (act.type === 'duration') {
                // For pure cardio duration logs
                analytics[dateStr].duration += act.value;
                // Estimate calories: ~8 kcal/min
                analytics[dateStr].calories += (act.value * 8);
            }
        });

        res.json(Object.entries(analytics).map(([date, data]) => ({ date, ...data })).reverse());
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch analytics', error: error.message });
    }
});

// @desc    Get user activities
// @route   GET /api/activities
// @access  Private
router.get('/', protect, async (req, res) => {
    const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(activities);
});

// @desc    Get public aggregate stats for landing page
// @route   GET /api/activities/public-stats
// @access  Public
router.get('/public-stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalActivities = await Activity.countDocuments();
        
        // Sum all activity values (mocking calories burned)
        const activityStats = await Activity.aggregate([
            { $group: { _id: null, totalValue: { $sum: "$value" } } }
        ]);

        const totalCalories = activityStats.length > 0 ? Math.round(activityStats[0].totalValue) : 0;

        res.json({
            users: totalUsers + 12000, // base + dynamic
            calories: (totalCalories + 8400000).toLocaleString(), // base + dynamic
            sessions: (totalActivities + 24800).toLocaleString() // base + dynamic
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
        if (activity.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await activity.deleteOne();
        res.json({ message: 'Activity removed' });
    } else {
        res.status(404).json({ message: 'Activity not found' });
    }
});

module.exports = router;
