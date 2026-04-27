const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    fitnessLevel: {
        type: String,
        required: true
    },
    daysPerWeek: {
        type: Number,
        default: 3
    },
    planData: {
        type: mongoose.Schema.Types.Mixed, // Stores the JSON output from AI
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
