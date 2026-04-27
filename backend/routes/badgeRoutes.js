const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Badge = require('../models/Badge');
const User = require('../models/User');

// @desc    Get all available badges
// @route   GET /api/badges
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const badges = await Badge.find({});
        res.json(badges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's earned badges
// @route   GET /api/badges/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('badges.badge');
        res.json(user.badges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
