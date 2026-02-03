const express = require('express');
const router = express.Router();
const DietPlan = require('../models/DietPlan');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new diet plan
// @route   POST /api/diets
// @access  Private (Trainer)
router.post('/', protect, async (req, res) => {
    // Ideally check if req.user.role === 'trainer'
    const { title, description, type, calories, meals } = req.body;

    const dietPlan = await DietPlan.create({
        title,
        description,
        type,
        calories,
        meals,
        creator: req.user._id
    });

    res.status(201).json(dietPlan);
});

// @desc    Get all diet plans
// @route   GET /api/diets
// @access  Private
router.get('/', protect, async (req, res) => {
    const plans = await DietPlan.find({}).populate('creator', 'name');
    res.json(plans);
});

module.exports = router;
