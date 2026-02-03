const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['steps', 'calories', 'duration', 'exercise', 'other'],
        required: true
    },
    exerciseDetails: {
        name: String,
        reps: Number,
        sets: Number,
        weight: Number, // in kg
        restTime: Number, // in seconds
        notes: String
    },
    value: {
        type: Number, // duration in mins, steps count, or calories burned
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
