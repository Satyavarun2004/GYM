const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Challenge = require('./models/Challenge');
const Activity = require('./models/Activity');

dotenv.config();

const checkData = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const userCount = await User.countDocuments();
        const challengeCount = await Challenge.countDocuments();
        const activityCount = await Activity.countDocuments();

        console.log('\n--- Database Stats ---');
        console.log(`Users: ${userCount}`);
        console.log(`Challenges: ${challengeCount}`);
        console.log(`Activities: ${activityCount}`);
        
        if (userCount > 0) {
            const lastUser = await User.findOne().sort({ _id: -1 });
            console.log(`\nLast User Created: ${lastUser.name} (${lastUser.email})`);
        }

        console.log('----------------------\n');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkData();
