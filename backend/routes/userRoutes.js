const express = require('express');
const router = express.Router();
const User = require('../models/User');
const WeightLog = require('../models/WeightLog');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, password, role, age, experience, gender, height, weight, phoneNumber } = req.body;

    const sanitizeNumber = (val) => (val === '' || val === undefined || val === null ? null : Number(val));
    const processedAge = sanitizeNumber(age);
    const processedExperience = sanitizeNumber(experience) || 0; // Default to 0
    const processedHeight = sanitizeNumber(height);
    const processedWeight = sanitizeNumber(weight);

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    let bmi = null;
    if (processedHeight && processedWeight) {
        // Height in cm, Weight in kg
        const heightInMeters = processedHeight / 100;
        bmi = (processedWeight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'customer',
        age: processedAge,
        experience: processedExperience,
        gender,
        height: processedHeight,
        weight: processedWeight,
        bmi,
        phoneNumber
    });

    if (user && processedWeight) {
        await WeightLog.create({
            user: user._id,
            weight: processedWeight
        });
    }

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            stats: user.stats,
            age: user.age,
            experience: user.experience,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            bmi: user.bmi,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            stats: user.stats,
            age: user.age,
            experience: user.experience,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            bmi: user.bmi,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id).populate('selectedTrainer', 'name email').populate('currentDietPlan');

    if (user) {
        // Calculate Motivation Status base on inactivity
        if (user.stats.lastActiveDate) {
            const today = new Date();
            const lastActive = new Date(user.stats.lastActiveDate);
            const diffTime = Math.abs(today - lastActive);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 7) {
                user.stats.motivationStatus = 'Inactive';
            } else if (diffDays >= 4) {
                user.stats.motivationStatus = 'Dropping';
            } else if (diffDays >= 2) {
                user.stats.motivationStatus = 'At Risk';
            } else {
                user.stats.motivationStatus = 'Consistent';
            }
            
            // Re-calculate fitness level based on experience
            user.stats.fitnessLevel = Math.floor((user.experience || 0) / 1000) + 1;
            
            await user.save();
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            stats: user.stats,
            badges: user.badges,
            selectedTrainer: user.selectedTrainer,
            currentDietPlan: user.currentDietPlan,
            age: user.age,
            experience: user.experience,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            bmi: user.bmi,
            phoneNumber: user.phoneNumber
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.age = req.body.age || user.age;
        user.gender = req.body.gender || user.gender;
        user.height = req.body.height || user.height;
        user.weight = req.body.weight || user.weight;
        user.bmi = req.body.bmi || user.bmi;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            stats: updatedUser.stats,
            age: updatedUser.age,
            experience: updatedUser.experience,
            gender: updatedUser.gender,
            height: updatedUser.height,
            weight: updatedUser.weight,
            bmi: updatedUser.bmi,
            phoneNumber: updatedUser.phoneNumber
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
    const users = await User.find({}).sort({ 'stats.totalSteps': -1 }).limit(10).select('name stats badges');
    res.json(users);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
    // Check if user is admin (simple check, ideally middleware)
    const user = await User.findById(req.user._id);
    if (user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
    const admin = await User.findById(req.user._id);
    if (admin.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Get all trainers
// @route   GET /api/users/trainers
// @access  Private
router.get('/trainers', protect, async (req, res) => {
    const trainers = await User.find({ role: 'trainer' }).select('name email badges');
    res.json(trainers);
});

// @desc    Select a trainer
// @route   PUT /api/users/select-trainer
// @access  Private
router.put('/select-trainer', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.selectedTrainer = req.body.trainerId;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            stats: updatedUser.stats,
            selectedTrainer: updatedUser.selectedTrainer,
            currentDietPlan: updatedUser.currentDietPlan,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Select a diet plan
// @route   PUT /api/users/select-diet
// @access  Private
router.put('/select-diet', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.currentDietPlan = req.body.dietPlanId;
        const updatedUser = await user.save();
        
        // Return full user with populated fields if needed, or just the user object
        // Front-end might expect just the user object updated
        res.json({
             _id: updatedUser._id,
             name: updatedUser.name,
             email: updatedUser.email,
             role: updatedUser.role,
             stats: updatedUser.stats,
             selectedTrainer: updatedUser.selectedTrainer,
             currentDietPlan: updatedUser.currentDietPlan,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get my trainees (for trainer)
// @route   GET /api/users/my-trainees
router.get('/my-trainees', protect, async (req, res) => {
    const trainees = await User.find({ selectedTrainer: req.user._id }).select('-password');
    res.json(trainees);
});

// @desc    Check and award achievements
// @route   PUT /api/users/profile/achievements
// @access  Private
router.put('/profile/achievements', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const activities = await require('../models/Activity').find({ user: user._id });
        
        const newBadges = [];
        const hasBadge = (name) => user.badges.some(b => b.name === name);

        // 1. Step Milestones
        if (user.stats.totalSteps >= 10000 && !hasBadge('10k Club')) {
            newBadges.push({ name: '10k Club', icon: 'Footprints' });
        }

        // 2. Challenge Milestones
        if (user.stats.challengesCompleted >= 5 && !hasBadge('Challenge Conqueror')) {
            newBadges.push({ name: 'Challenge Conqueror', icon: 'Trophy' });
        }

        // 3. Lifting Milestones (Volume check)
        const totalVolume = activities.reduce((acc, curr) => {
            if (curr.type === 'exercise' && curr.exerciseDetails) {
                return acc + (curr.exerciseDetails.reps * curr.exerciseDetails.sets * curr.exerciseDetails.weight);
            }
            return acc;
        }, 0);

        if (totalVolume >= 1000 && !hasBadge('Lifting Legend')) {
            newBadges.push({ name: 'Lifting Legend', icon: 'Dumbbell' });
        }

        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
            await user.save();
            return res.json({ message: 'New achievements unlocked!', badges: newBadges, allBadges: user.badges });
        }

        res.json({ message: 'No new achievements', allBadges: user.badges });
    } catch (error) {
        res.status(400).json({ message: 'Failed to sync achievements', error: error.message });
    }
});

// @desc    Get peers with >= experience
// @route   GET /api/users/peers
// @access  Private
router.get('/peers', protect, async (req, res) => {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const peers = await User.find({
        _id: { $ne: currentUser._id }, // Exclude current user
        experience: { $gte: currentUser.experience || 0 }, // Greater than or equal to current user's experience
        role: 'customer' // Only customers? Assuming peers are customers. Or allow trainers too? Let's stick to customers for now or all users. Let's do all users.
    }).select('name email phoneNumber experience gender stats');
    
    res.json(peers);
});

module.exports = router;
