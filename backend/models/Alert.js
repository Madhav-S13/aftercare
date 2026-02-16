const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    healthData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthData'
    },

    type: {
        type: String,
        enum: ['threshold', 'trend', 'emergency', 'manual'],
        required: true
    },

    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    // Escalation tracking
    notifiedPatient: {
        type: Boolean,
        default: false
    },

    notifiedDoctor: {
        type: Boolean,
        default: false
    },

    notifiedEmergency: {
        type: Boolean,
        default: false
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved'],
        default: 'active'
    },

    acknowledgedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    acknowledgedAt: {
        type: Date
    },

    resolvedAt: {
        type: Date
    },

    // Additional data
    triggerValues: {
        type: mongoose.Schema.Types.Mixed
    },

    isRead: {
    type: Boolean,
    default: false
    },
    
    readAt: {
        type: Date
    }

}, {
    timestamps: true
});

// Index for querying
alertSchema.index({ patient: 1, status: 1, createdAt: -1 });
alertSchema.index({ severity: 1, status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
