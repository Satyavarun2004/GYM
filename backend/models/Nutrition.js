const mongoose = require('mongoose');

const nutritionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

module.exports = Nutrition;
