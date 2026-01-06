const Emergency = require('../models/Emergency');
const User = require('../models/User');
const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');

// @desc    Trigger emergency SOS
// @route   POST /api/emergency
// @access  Private (Patient)
exports.triggerSOS = async (req, res) => {
    try {
        const { location, notes } = req.body;

        const patient = await User.findById(req.user.id);

        // Get latest vitals
        const latestHealth = await HealthData.findOne({ patient: req.user.id })
            .sort({ createdAt: -1 });

        const latestVitals = latestHealth ? {
            bloodPressure: latestHealth.bloodPressure,
            heartRate: latestHealth.heartRate,
            spO2: latestHealth.spO2,
            temperature: latestHealth.temperature
        } : null;

        // Create emergency record
        const emergency = await Emergency.create({
            patient: req.user.id,
            latestVitals,
            location,
            notes,
            contactsNotified: patient.emergencyContacts.map(contact => ({
                name: contact.name,
                phone: contact.phone,
                notifiedAt: new Date()
            }))
        });

        // Create critical alert
        await Alert.create({
            patient: req.user.id,
            type: 'emergency',
            severity: 'critical',
            title: '🚨 EMERGENCY SOS ACTIVATED',
            message: `Patient ${patient.name} has triggered emergency SOS. Immediate attention required.`,
            triggerValues: { location, latestVitals },
            notifiedPatient: true,
            notifiedDoctor: true,
            notifiedEmergency: true
        });

        res.status(201).json({
            success: true,
            message: 'Emergency SOS triggered. Help is on the way.',
            data: emergency
        });
    } catch (error) {
        console.error('Trigger SOS error:', error);
        res.status(500).json({
            success: false,
            message: 'Error triggering emergency SOS'
        });
    }
};

// @desc    Get emergency records
// @route   GET /api/emergency
// @access  Private
exports.getEmergencies = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'patient') {
            query.patient = req.user.id;
        } else if (req.user.role === 'doctor') {
            const doctor = await User.findById(req.user.id);
            query.patient = { $in: doctor.assignedPatients };
        }

        const emergencies = await Emergency.find(query)
            .populate('patient', 'name email phone emergencyContacts')
            .populate('respondedBy', 'name role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: emergencies.length,
            data: emergencies
        });
    } catch (error) {
        console.error('Get emergencies error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching emergency records'
        });
    }
};

// @desc    Respond to emergency
// @route   PUT /api/emergency/:id/respond
// @access  Private (Doctor, Admin)
exports.respondToEmergency = async (req, res) => {
    try {
        const { notes } = req.body;

        const emergency = await Emergency.findById(req.params.id);

        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: 'Emergency record not found'
            });
        }

        emergency.status = 'responded';
        emergency.respondedBy = req.user.id;
        emergency.respondedAt = new Date();
        if (notes) {
            emergency.notes = notes;
        }
        await emergency.save();

        res.status(200).json({
            success: true,
            message: 'Emergency response recorded',
            data: emergency
        });
    } catch (error) {
        console.error('Respond to emergency error:', error);
        res.status(500).json({
            success: false,
            message: 'Error responding to emergency'
        });
    }
};

// @desc    Resolve emergency
// @route   PUT /api/emergency/:id/resolve
// @access  Private (Doctor, Admin)
exports.resolveEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);

        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: 'Emergency record not found'
            });
        }

        emergency.status = 'resolved';
        emergency.resolvedAt = new Date();
        await emergency.save();

        res.status(200).json({
            success: true,
            message: 'Emergency resolved',
            data: emergency
        });
    } catch (error) {
        console.error('Resolve emergency error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resolving emergency'
        });
    }
};
