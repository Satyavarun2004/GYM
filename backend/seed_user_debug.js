const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        
        const userExists = await User.findOne({ email: 'testcustomer@example.com' });
        if (userExists) {
            console.log('Test user already exists');
            process.exit();
        }

        const user = await User.create({
            name: 'Test Customer',
            email: 'testcustomer@example.com',
            password: 'password123',
            role: 'customer',
            stats: { totalSteps: 5000 },
        });

        console.log(`Created user: ${user.name}`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedUser();
