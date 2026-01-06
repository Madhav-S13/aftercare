const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Latest health snapshot
    latestVitals: {
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        heartRate: Number,
        spO2: Number,
        temperature: Number
    },

    // Location data
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },

    // Emergency contacts notified
    contactsNotified: [{
        name: String,
        phone: String,
        notifiedAt: Date
    }],

    // Status
    status: {
        type: String,
        enum: ['active', 'responded', 'resolved', 'false-alarm'],
        default: 'active'
    },

    notes: {
        type: String
    },

    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    respondedAt: {
        type: Date
    },

    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

emergencySchema.index({ patient: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Emergency', emergencySchema);
