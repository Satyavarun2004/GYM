const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['customer', 'trainer', 'admin'],
        default: 'customer'
    },
    password: {
        type: String,
        required: true
    },
    badges: [{
        name: String,
        icon: String, // lucide icon name or image url
        dateEarned: {
            type: Date,
            default: Date.now
        }
    }],
    stats: {
        totalSteps: { type: Number, default: 0 },
        challengesCompleted: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        lastActiveDate: { type: Date, default: null },
        motivationStatus: {
            type: String,
            enum: ['Consistent', 'At Risk', 'Dropping', 'Inactive'],
            default: 'Consistent'
        },
        fitnessLevel: { type: Number, default: 1 }
    },
    selectedTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    currentDietPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DietPlan',
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    experience: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male'
    },
    height: {
        type: Number,
        default: null
    },
    weight: {
        type: Number,
        default: null
    },
    bmi: {
        type: Number,
        default: null
    },
    phoneNumber: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
