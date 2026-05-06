const express = require('express');
const router = express.Router();
const Nutrition = require('../models/Nutrition');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Log nutrition intake
// @route   POST /api/nutrition
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { mealType, foodName, calories } = req.body;
        const entry = await Nutrition.create({
            user: req.user._id,
            mealType,
            foodName,
            calories
        });
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Error logging nutrition', error: error.message });
    }
});

// @desc    Get daily summary
// @route   GET /api/nutrition/daily-summary
// @access  Private
router.get('/daily-summary', protect, async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        let targetId = req.user._id;
        if (req.user.role === 'admin' && req.query.userId) {
            targetId = req.query.userId;
        }

        const intake = await Nutrition.find({
            user: targetId,
            createdAt: { $gte: startOfDay }
        });

        const totalCalories = intake.reduce((acc, curr) => acc + curr.calories, 0);
        res.json({ totalCalories, logs: intake });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary', error: error.message });
    }
});

module.exports = router;
