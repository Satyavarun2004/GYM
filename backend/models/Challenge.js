const mongoose = require('mongoose');

const challengeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: ['steps', 'calories', 'duration', 'other'],
        default: 'steps'
    },
    goal: {
        type: Number,
        required: true // e.g., 10000 steps
    },
    durationDays: {
        type: Number,
        default: 7
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    isAdaptive: {
        type: Boolean,
        default: false
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        progress: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'failed'],
            default: 'active'
        },
        personalizedGoal: {
            type: Number,
            default: null // Will be calculated for adaptive challenges
        }
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
