const mongoose = require('mongoose');

const weightLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
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

const WeightLog = mongoose.model('WeightLog', weightLogSchema);

module.exports = WeightLog;
