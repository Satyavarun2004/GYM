const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ProgressPhoto = require('../models/ProgressPhoto');

// @desc    Upload a new progress photo
// @route   POST /api/photos
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { imageUrl, weight, note } = req.body;
        
        const photo = await ProgressPhoto.create({
            user: req.user._id,
            imageUrl,
            weight: Number(weight),
            note
        });

        res.status(201).json(photo);
    } catch (error) {
        res.status(400).json({ message: 'Failed to upload photo', error: error.message });
    }
});

// @desc    Get all progress photos for a user
// @route   GET /api/photos
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const photos = await ProgressPhoto.find({ user: req.user._id }).sort({ date: -1 });
        res.json(photos);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch photos', error: error.message });
    }
});

// @desc    Delete a progress photo
// @route   DELETE /api/photos/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const photo = await ProgressPhoto.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        if (photo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await photo.deleteOne();
        res.json({ message: 'Photo removed' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete photo', error: error.message });
    }
});

module.exports = router;
