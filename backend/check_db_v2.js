const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Activity = require('./models/Activity');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const results = {
            dbName: mongoose.connection.name,
            collections: (await mongoose.connection.db.listCollections().toArray()).map(c => c.name),
            activityCount: await Activity.countDocuments(),
            lastActivity: await Activity.findOne().sort({ createdAt: -1 }),
            activitySchemaCollection: Activity.collection.name
        };
        
        fs.writeFileSync('db_results.json', JSON.stringify(results, null, 2));
        console.log('Results written to db_results.json');
        process.exit(0);
    } catch (error) {
        fs.writeFileSync('db_results.json', JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
    }
};

checkDB();
