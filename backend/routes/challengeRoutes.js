const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new challenge
// @route   POST /api/challenges
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, type, goal, durationDays } = req.body;

    const challenge = await Challenge.create({
        title,
        description,
        type,
        goal,
        durationDays,
        creator: req.user._id
    });

    res.status(201).json(challenge);
});

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Private
router.get('/', protect, async (req, res) => {
    const challenges = await Challenge.find({}).populate('creator', 'name');
    res.json(challenges);
});

// @desc    Join a challenge
// @route   PUT /api/challenges/:id/join
// @access  Private
router.put('/:id/join', protect, async (req, res) => {
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
        // Check if already joined
        const alreadyJoined = challenge.participants.find(p => p.user.toString() === req.user._id.toString());
        if (alreadyJoined) {
            return res.status(400).json({ message: 'Already joined this challenge' });
        }

        let personalizedGoal = challenge.goal;
        if (challenge.isAdaptive) {
            const user = await User.findById(req.user._id);
            const fitnessLevel = user.stats.fitnessLevel || 1;
            // adaptive formula: base goal * (0.8 + (fitnessLevel * 0.2))
            // e.g. Level 1: goal * 1.0, Level 5: goal * 1.8
            personalizedGoal = Math.round(challenge.goal * (0.8 + (fitnessLevel * 0.2)));
        }

        challenge.participants.push({ 
            user: req.user._id,
            personalizedGoal: personalizedGoal
        });
        await challenge.save();
        res.json(challenge);
    } else {
        res.status(404).json({ message: 'Challenge not found' });
    }
});

// @desc    Log activity for a challenge (or general)
// @route   POST /api/challenges/activity
// @access  Private
router.post('/activity', protect, async (req, res) => {
    const { type, value, challengeId } = req.body;

    // Create activity log
    const activity = await Activity.create({
        user: req.user._id,
        type,
        value
    });

    // Update User Stats (General)
    const user = await User.findById(req.user._id);
    if (type === 'steps') {
        user.stats.totalSteps += Number(value);
        await user.save();
    }

    // Update Challenge Progress for ALL matching active challenges
    const activeChallenges = await Challenge.find({
        'participants.user': req.user._id,
        type: type // Match activity type (e.g., 'steps')
    });

    for (const challenge of activeChallenges) {
        // Check if challenge is expired
        const startDate = new Date(challenge.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + challenge.durationDays);
        
        if (new Date() > endDate) continue;

        const participant = challenge.participants.find(p => p.user.toString() === req.user._id.toString());
        
        if (participant && participant.status !== 'completed') {
            participant.progress += Number(value);
            
            // Check for completion
            if (participant.progress >= challenge.goal) {
                participant.status = 'completed';
                // Increment user stats only once per challenge completion
                user.stats.challengesCompleted += 1;
            }
            
            await challenge.save();
        }
    }
    
    // Save user changes if any challenges were completed
    await user.save();

    res.status(201).json(activity);
});

module.exports = router;
