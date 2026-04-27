const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Badge = require('./models/Badge');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const badges = [
    {
        name: 'First Blood',
        description: 'Complete your first workout session.',
        icon: 'Zap',
        category: 'Consistency',
        requirement: '1 session',
        rarity: 'Common',
        points: 50
    },
    {
        name: 'Iron Warrior',
        description: 'Complete 10 strength training sessions.',
        icon: 'Dumbbell',
        category: 'Strength',
        requirement: '10 sessions',
        rarity: 'Rare',
        points: 200
    },
    {
        name: 'Eagle Eye',
        description: 'Achieve 100% form accuracy in 5 sessions.',
        icon: 'Scan',
        category: 'Vision',
        requirement: '5 perfect sessions',
        rarity: 'Epic',
        points: 500
    },
    {
        name: 'Centurion',
        description: 'Complete a 100-day workout streak.',
        icon: 'Trophy',
        category: 'Consistency',
        requirement: '100 day streak',
        rarity: 'Legendary',
        points: 1000
    }
];

const seedBadges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Badge.deleteMany();
        await Badge.insertMany(badges);
        console.log('Badges Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding badges:', error);
        process.exit(1);
    }
};

seedBadges();
