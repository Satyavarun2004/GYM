const mongoose = require('mongoose');

async function testConnection() {
    const uri1 = 'mongodb+srv://221fa07139_db_user:jO6ya30IRasd3VeU@cluster0.fjchchg.mongodb.net/?appName=Cluster0';
    const uri2 = 'mongodb+srv://perumallavarun171_db_user:Varun8247@fitnesscluster.gezwsn6.mongodb.net/fitpulse?appName=FitnessCluster';

    console.log('Testing URI 1...');
    try {
        await mongoose.connect(uri1, { serverSelectionTimeoutMS: 5000 });
        console.log('URI 1 SUCCESS! Connected to:', mongoose.connection.host);
        await mongoose.disconnect();
    } catch (err) {
        console.log('URI 1 Error:', err.message);
    }

    console.log('Testing URI 2...');
    try {
        await mongoose.connect(uri2, { serverSelectionTimeoutMS: 5000 });
        console.log('URI 2 SUCCESS! Connected to:', mongoose.connection.host);
        await mongoose.disconnect();
    } catch (err) {
        console.log('URI 2 Error:', err.message);
    }

    process.exit(0);
}

testConnection();
