const mongoose = require('mongoose');
require('dotenv').config();

async function verifyMatching() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.model('User', require('./models/User').schema);

        // 1. Create a "Base User" (The one seeking peers)
        const baseUserEmail = `base_user_${Date.now()}@test.com`;
        const baseUser = await User.create({
            name: 'Base User',
            email: baseUserEmail,
            password: 'Password123!',
            age: 30,
            experience: 5,
            role: 'customer',
            phoneNumber: `1${Date.now()}`
        });

        console.log(`Base User created: Age 30, Exp 5`);

        // 2. Create "Matchable Peer" (Age 28, Exp 4) -> Should match
        const peer1 = await User.create({
            name: 'Matchable Peer',
            email: `peer1_${Date.now()}@test.com`,
            password: 'Password123!',
            age: 28,
            experience: 4,
            role: 'customer',
            phoneNumber: `2${Date.now()}`
        });

        // 3. Create "Out of Age Range Peer" (Age 40, Exp 10) -> Should NOT match
        const peer2 = await User.create({
            name: 'Old Peer',
            email: `peer2_${Date.now()}@test.com`,
            password: 'Password123!',
            age: 40,
            experience: 10,
            role: 'customer',
            phoneNumber: `3${Date.now()}`
        });

        // 4. Create "Low Exp Peer" (Age 31, Exp 2) -> Should NOT match
        const peer3 = await User.create({
            name: 'Novice Peer',
            email: `peer3_${Date.now()}@test.com`,
            password: 'Password123!',
            age: 31,
            experience: 2,
            role: 'customer',
            phoneNumber: `4${Date.now()}`
        });

        // Simulating the backend find logic
        const matchedPeers = await User.find({
            _id: { $ne: baseUser._id },
            role: 'customer',
            experience: { $gte: 4 },
            age: { $gte: 25, $lte: 35 }
        });

        console.log(`\nVerification Results:`);
        console.log(`Found ${matchedPeers.length} peers.`);
        
        const names = matchedPeers.map(p => p.name);
        if (names.includes('Matchable Peer') && !names.includes('Old Peer') && !names.includes('Novice Peer')) {
            console.log('✅ Logic Passed: Found "Matchable Peer" and excluded others.');
        } else {
            console.log('❌ Logic Failed: Results did not match expectations.');
            console.log('Found:', names);
        }

        // Cleanup
        await User.deleteMany({ email: { $in: [baseUserEmail, peer1.email, peer2.email, peer3.email] } });
        console.log('\nTest data cleaned up.');
        process.exit(0);
    } catch (error) {
        console.error('Verification error:', error);
        process.exit(1);
    }
}

verifyMatching();
