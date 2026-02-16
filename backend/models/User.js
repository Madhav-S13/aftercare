const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        required: [true, 'Role is required'],
        default: 'patient'
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    age: {
        type: Number,
        require: false
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },

    // Patient-specific fields
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    emergencyContacts: [{
        name: String,
        relationship: String,
        phone: String
    }],
    medicalHistory: {
        conditions: [String],
        allergies: [String],
        medications: [String]
    },

    // Doctor-specific fields
    specialization: {
        type: String
    },
    licenseNumber: {
        type: String
    },
    assignedPatients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Gamification fields
    healthStreak: {
        type: Number,
        default: 0
    },
    lastSubmissionDate: {
        type: Date
    },
    badges: [{
        name: String,
        earnedDate: Date,
        icon: String
    }],
    consistencyScore: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    },
    profileImage: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
