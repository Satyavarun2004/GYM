const mongoose = require('mongoose');

const dietPlanSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: ['veg', 'non-veg', 'vegan', 'keto', 'other'],
        default: 'veg'
    },
    calories: {
        type: Number,
        required: true
    },
    meals: [{
        name: { type: String, required: true }, // e.g. Breakfast
        items: [String] // e.g. ["2 Eggs", "Oats"]
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

module.exports = DietPlan;
