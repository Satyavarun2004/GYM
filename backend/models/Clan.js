const mongoose = require('mongoose');

const clanSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    totalXP: {
        type: Number,
        default: 0
    },
    currentZone: {
        type: String,
        default: 'Neutral Territory'
    },
    achievements: [{
        name: String,
        dateEarned: {
            type: Date,
            default: Date.now
        }
    }],
    banner: {
        type: String,
        default: '/assets/clans/default-banner.png'
    },
    rank: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master'],
        default: 'Bronze'
    }
}, {
    timestamps: true
});

const Clan = mongoose.model('Clan', clanSchema);

module.exports = Clan;
