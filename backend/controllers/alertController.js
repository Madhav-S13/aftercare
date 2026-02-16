const Alert = require('../models/Alert');
const User = require('../models/User');

// @desc    Get alerts for patient
// @route   GET /api/alerts
// @access  Private (Patient)
exports.getMyAlerts = async (req, res) => {
    try {
        const { status, severity } = req.query;

        let query = { patient: req.user.id };

        if (status) {
            query.status = status;
        }

        if (severity) {
            query.severity = severity;
        }

        const alerts = await Alert.find(query)
            .populate('healthData')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        console.error('Get alerts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching alerts'
        });
    }
};

// @desc    Get alerts for doctor's patients
// @route   GET /api/alerts/doctor
// @access  Private (Doctor)
exports.getDoctorAlerts = async (req, res) => {
    try {
        const doctor = await User.findById(req.user.id);

        const alerts = await Alert.find({
            patient: { $in: doctor.assignedPatients },
            status: { $in: ['active', 'acknowledged'] }
        })
            .populate('patient', 'name email phone')
            .populate('healthData')
            .sort({ severity: -1, createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        console.error('Get doctor alerts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching alerts'
        });
    }
};

// @desc    Acknowledge alert
// @route   PUT /api/alerts/:id/acknowledge
// @access  Private
exports.acknowledgeAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        alert.status = 'acknowledged';
        alert.acknowledgedBy = req.user.id;
        alert.acknowledgedAt = new Date();
        await alert.save();

        res.status(200).json({
            success: true,
            message: 'Alert acknowledged',
            data: alert
        });
    } catch (error) {
        console.error('Acknowledge alert error:', error);
        res.status(500).json({
            success: false,
            message: 'Error acknowledging alert'
        });
    }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private (Doctor, Admin)
exports.resolveAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        alert.status = 'resolved';
        alert.resolvedAt = new Date();
        await alert.save();

        res.status(200).json({
            success: true,
            message: 'Alert resolved',
            data: alert
        });
    } catch (error) {
        console.error('Resolve alert error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resolving alert'
        });
    }
};

// @desc    Get alert statistics
// @route   GET /api/alerts/stats
// @access  Private (Doctor, Admin)
exports.getAlertStats = async (req, res) => {
    try {
        let patientFilter = {};

        if (req.user.role === 'doctor') {
            const doctor = await User.findById(req.user.id);
            patientFilter = { patient: { $in: doctor.assignedPatients } };
        }

        const stats = await Alert.aggregate([
            { $match: patientFilter },
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusStats = await Alert.aggregate([
            { $match: patientFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            bySeverity: stats,
            byStatus: statusStats
        });
    } catch (error) {
        console.error('Get alert stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching alert statistics'
        });
    }
};

// @desc    Send alert to patient from doctor
// @route   POST /api/alerts/doctor-alert
// @access  Private (Doctor)
exports.sendDoctorAlert = async (req, res) => {
    try {
        const { patientId, message } = req.body;

        if (!message || !patientId) {
            return res.status(400).json({
                success: false,
                message: 'Patient ID and message are required'
            });
        }

        const doctor = await User.findById(req.user.id);
        const patient = await User.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Verify doctor is assigned to this patient
        const isAssigned = doctor.assignedPatients.some(
            id => id.toString() === patientId.toString()
        );

        if (!isAssigned) {
            return res.status(403).json({
                success: false,
                message: 'You are not assigned to this patient'
            });
        }

        const alert = await Alert.create({
            patient: patientId,
            type: 'manual',
            severity: 'high',
            title: `📩 Message from Dr. ${doctor.name}`,
            message: message,
            notifiedPatient: true
        });

        res.status(201).json({
            success: true,
            message: 'Alert sent to patient',
            data: alert
        });
    } catch (error) {
        console.error('Send doctor alert error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending alert to patient'
        });
    }
};

// @desc    Mark all alerts as read for patient
// @route   PUT /api/alerts/mark-read
// @access  Private (Patient)
exports.markAllAsRead = async (req, res) => {
    try {
        await Alert.updateMany(
            { 
                patient: req.user._id,
                isRead: false
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date()
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Alerts marked as read'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
