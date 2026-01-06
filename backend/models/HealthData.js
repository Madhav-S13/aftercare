const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Vital signs
    bloodPressure: {
        systolic: {
            type: Number,
            required: [true, 'Systolic BP is required'],
            min: [60, 'Systolic BP seems too low'],
            max: [250, 'Systolic BP seems too high']
        },
        diastolic: {
            type: Number,
            required: [true, 'Diastolic BP is required'],
            min: [40, 'Diastolic BP seems too low'],
            max: [150, 'Diastolic BP seems too high']
        }
    },

    heartRate: {
        type: Number,
        required: [true, 'Heart rate is required'],
        min: [40, 'Heart rate seems too low'],
        max: [200, 'Heart rate seems too high']
    },

    spO2: {
        type: Number,
        required: [true, 'SpO₂ is required'],
        min: [70, 'SpO₂ seems too low'],
        max: [100, 'SpO₂ cannot exceed 100%']
    },

    temperature: {
        type: Number,
        required: [true, 'Temperature is required'],
        min: [90, 'Temperature seems too low'],
        max: [110, 'Temperature seems too high']
    },

    // Additional info
    symptoms: {
        type: String,
        maxlength: 500
    },

    notes: {
        type: String,
        maxlength: 1000
    },

    // Calculated risk assessment
    riskLevel: {
        type: String,
        enum: ['normal', 'warning', 'critical'],
        default: 'normal'
    },

    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    // Doctor feedback
    doctorNotes: {
        type: String
    },

    doctorReviewed: {
        type: Boolean,
        default: false
    },

    reviewedAt: {
        type: Date
    },

    // Metadata
    submittedVia: {
        type: String,
        enum: ['manual', 'voice', 'offline-sync'],
        default: 'manual'
    },

    recordedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
healthDataSchema.index({ patient: 1, createdAt: -1 });
healthDataSchema.index({ riskLevel: 1 });

module.exports = mongoose.model('HealthData', healthDataSchema);
