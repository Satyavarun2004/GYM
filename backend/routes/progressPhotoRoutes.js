const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ProgressPhoto = require('../models/ProgressPhoto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists at load time
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('[Photos] Created uploads directory:', uploadDir);
}

// Configure Multer Storage (multer v1.4 LTS)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `photo-${req.user._id}-${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: function (req, file, cb) {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'));
        }
    }
});

// @desc    Upload a new progress photo
// @route   POST /api/photos
// @access  Private
router.post('/', protect, function (req, res) {
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error('[Photos] Multer error:', err.message);
            return res.status(400).json({ message: err.message });
        }

        try {
            const { weight, note } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'No image file was uploaded' });
            }

            const photo = await ProgressPhoto.create({
                user: req.user._id,
                imageUrl: `/uploads/${req.file.filename}`,
                weight: Number(weight),
                note: note || ''
            });

            res.status(201).json(photo);
        } catch (error) {
            console.error('[Photos] DB error:', error.message);
            res.status(500).json({ message: 'Failed to save photo', error: error.message });
        }
    });
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

        // Delete file from disk
        const filePath = path.join(uploadDir, path.basename(photo.imageUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await photo.deleteOne();
        res.json({ message: 'Photo removed' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete photo', error: error.message });
    }
});

module.exports = router;
