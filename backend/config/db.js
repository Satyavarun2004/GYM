const mongoose = require('mongoose');
const dns = require('dns');

const FALLBACK_URI = 'mongodb+srv://221fa07139_db_user:jO6ya30IRasd3VeU@cluster0.fjchchg.mongodb.net/fitpulse?appName=Cluster0';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/fitpulse';

const connectDB = async () => {
    // Attempt 1: Connect with standard env MONGO_URI
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
    } catch (error) {
        console.warn(`Primary MongoDB Connection failed (${error.message}). Retrying with Google/Cloudflare DNS...`);
    }

    // Attempt 2: Try setting explicit DNS servers (Google 8.8.8.8 / Cloudflare 1.1.1.1)
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected (via Fallback DNS): ${conn.connection.host}`);
        return;
    } catch (error) {
        console.warn(`Primary MongoDB Connection with custom DNS failed. Retrying with Fallback Cluster...`);
    }

    // Attempt 3: Try fallback MongoDB cluster URI
    try {
        const conn = await mongoose.connect(FALLBACK_URI);
        console.log(`MongoDB Connected (via Fallback Cluster): ${conn.connection.host}`);
        return;
    } catch (error) {
        console.warn(`Fallback MongoDB cluster connection failed: ${error.message}. Retrying with local MongoDB...`);
    }

    // Attempt 4: Try local MongoDB (127.0.0.1)
    try {
        const conn = await mongoose.connect(LOCAL_URI);
        console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
        return;
    } catch (error) {
        console.error(`\n⚠️  WARNING: Could not connect to any MongoDB instance.`);
        console.error(`Reason: DNS SRV resolution failed or no internet connection.`);
        console.error(`The server is running on port 5000, but database features will be unavailable until internet/MongoDB is connected.\n`);
    }
};

module.exports = connectDB;
