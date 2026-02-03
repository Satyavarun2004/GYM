const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Activity = require('./models/Activity');

dotenv.config();

const verifySave = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const uniqueNote = 'Verification Log ' + new Date().toISOString();
        
        console.log('Logging a test activity with note:', uniqueNote);
        
        const activity = await Activity.create({
            user: new mongoose.Types.ObjectId(), // dummy user
            type: 'exercise',
            value: 0,
            exerciseDetails: {
                name: 'Debug Squat',
                reps: 1,
                sets: 1,
                notes: uniqueNote
            }
        });
        
        console.log('Activity logged with ID:', activity._id);
        
        const found = await Activity.findOne({ 'exerciseDetails.notes': uniqueNote });
        if (found) {
            console.log('VERIFICATION_SUCCESS: Record confirmed in [test.activities]');
        } else {
            console.log('VERIFICATION_FAILURE: Record not found after save!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifySave();
