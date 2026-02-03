const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Activity = require('./models/Activity');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DATABASE INSPECTION ---');
        console.log('Connected to:', mongoose.connection.name);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections present:', collections.map(c => c.name));
        
        const activityCount = await Activity.countDocuments();
        console.log('Total documents in items that Mongoose thinks is Activity:', activityCount);
        
        const lastActivity = await Activity.findOne().sort({ createdAt: -1 });
        if (lastActivity) {
            console.log('Last activity record:', JSON.stringify(lastActivity, null, 2));
        } else {
            console.log('No activities found in the collection Mongoose is targeting.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Inspection failed:', error);
        process.exit(1);
    }
};

checkDB();
