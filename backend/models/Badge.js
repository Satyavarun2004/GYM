const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String, // String representation of the icon name (e.g., 'Zap', 'Trophy')
        required: true
    },
    category: {
        type: String,
        enum: ['Consistency', 'Strength', 'Vision', 'Social', 'Special'],
        default: 'Special'
    },
    requirement: {
        type: String, // Description of how to earn it
        required: true
    },
    rarity: {
        type: String,
        enum: ['Common', 'Rare', 'Epic', 'Legendary'],
        default: 'Common'
    },
    points: {
        type: Number,
        default: 10
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);
