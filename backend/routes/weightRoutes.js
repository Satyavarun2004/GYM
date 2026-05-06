const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const WeightLog = require('../models/WeightLog');
const User = require('../models/User');

// @desc    Log weight
// @route   POST /api/weight
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { weight } = req.body;
        
        if (!weight) {
            return res.status(400).json({ message: 'Weight is required' });
        }

        const log = await WeightLog.create({
            user: req.user._id,
            weight: Number(weight)
        });

        // Also update the main weight in User model for general profile
        await User.findByIdAndUpdate(req.user._id, { weight: Number(weight) });

        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: 'Failed to log weight', error: error.message });
    }
});

// @desc    Get weight history
// @route   GET /api/weight
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let targetId = req.user._id;
        if (req.user.role === 'admin' && req.query.userId) {
            targetId = req.query.userId;
        }
        const logs = await WeightLog.find({ user: targetId }).sort({ date: 1 });
        res.json(logs);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch weight logs', error: error.message });
    }
});

// @desc    Delete weight log
// @route   DELETE /api/weight/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const log = await WeightLog.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }

        if (log.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await log.deleteOne();
        res.json({ message: 'Weight log removed' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete log', error: error.message });
    }
});

module.exports = router;
