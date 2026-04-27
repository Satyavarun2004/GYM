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

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    if (phoneNumber) {
        const phoneExists = await User.findOne({ phoneNumber });
        if (phoneExists) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }
    }

    // Validation Logic
    if (!name || name.length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password validation: 8+ chars, 1 upper, 1 lower, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
        });
    }

    const sanitizeNumber = (val) => (val === '' || val === undefined || val === null ? null : Number(val));
    const processedAge = sanitizeNumber(age);
    const processedExperience = sanitizeNumber(experience) || 0;
    const processedHeight = sanitizeNumber(height);
    const processedWeight = sanitizeNumber(weight);

    if (processedAge !== null && (processedAge < 13 || processedAge > 120)) {
        return res.status(400).json({ message: 'Age must be between 13 and 120' });
    }

    if (processedHeight !== null && (processedHeight < 50 || processedHeight > 300)) {
        return res.status(400).json({ message: 'Height must be between 50 and 300 cm' });
    }

    if (processedWeight !== null && (processedWeight < 30 || processedWeight > 500)) {
        return res.status(400).json({ message: 'Weight must be between 30 and 500 kg' });
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

// @desc    Check and award achievements (Sync)
// @route   PUT /api/users/profile/achievements
// @access  Private
router.put('/profile/achievements', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const Badge = require('../models/Badge');
        const Activity = require('../models/Activity');
        
        const totalActivities = await Activity.countDocuments({ user: req.user._id });
        const strengthSessions = await Activity.countDocuments({ user: req.user._id, type: 'exercise' });

        const badgesToAward = [];
        
        // Use exact names from seed file
        if (totalActivities >= 1) {
            const b = await Badge.findOne({ name: 'First Blood' });
            if (b) badgesToAward.push(b._id);
        }

        if (strengthSessions >= 10) {
            const b = await Badge.findOne({ name: 'Iron Warrior' });
            if (b) badgesToAward.push(b._id);
        }

        if (user.stats.currentStreak >= 100) {
            const b = await Badge.findOne({ name: 'Centurion' });
            if (b) badgesToAward.push(b._id);
        }

        let addedCount = 0;
        let totalXpGained = 0;
        for (const badgeId of badgesToAward) {
            const alreadyHas = user.badges.some(b => b.badge.toString() === badgeId.toString());
            if (!alreadyHas) {
                const bDetail = await Badge.findById(badgeId);
                user.badges.push({ badge: badgeId });
                totalXpGained += (bDetail?.points || 10);
                addedCount++;
            }
        }

        if (addedCount > 0) {
            user.experience = (user.experience || 0) + totalXpGained;
            await user.save();
            const updatedUser = await User.findById(req.user._id).populate('badges.badge');
            return res.json({ 
                message: `Unlocked ${addedCount} new achievements! +${totalXpGained} XP earned.`, 
                badges: updatedUser.badges,
                experience: updatedUser.experience
            });
        }

        res.json({ message: 'No new achievements found.', badges: user.badges });
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

    const ageRange = 5;
    const minAge = (currentUser.age || 0) - ageRange;
    const maxAge = (currentUser.age || 0) + ageRange;

    // Matching peers based on:
    // 1. Not the current user
    // 2. Same role (customer)
    // 3. Similar or higher experience (>= current - 1)
    // 4. Similar age (±5 years)
    const peers = await User.find({
        _id: { $ne: currentUser._id },
        role: 'customer',
        experience: { $gte: Math.max(0, (currentUser.experience || 0) - 1) },
        age: { $gte: minAge, $lte: maxAge }
    }).select('name email phoneNumber experience gender stats age');
    
    res.json(peers);
});

module.exports = router;
