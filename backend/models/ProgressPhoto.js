const mongoose = require('mongoose');

const progressPhotoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const ProgressPhoto = mongoose.model('ProgressPhoto', progressPhotoSchema);

module.exports = ProgressPhoto;
