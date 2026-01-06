const User = require('../models/User');
const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');
const Emergency = require('../models/Emergency');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const { role, isActive } = req.query;

        let query = {};

        if (role) {
            query.role = role;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const users = await User.find(query)
            .populate('assignedDoctor', 'name specialization')
            .populate('assignedPatients', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('assignedDoctor', 'name specialization email')
            .populate('assignedPatients', 'name email phone');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    try {
        const allowedFields = ['name', 'phone', 'isActive', 'role', 'specialization', 'licenseNumber'];

        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
};

// @desc    Assign doctor to patient
// @route   POST /api/admin/assign-doctor
// @access  Private (Admin)
exports.assignDoctor = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;

        // Validate patient
        const patient = await User.findById(patientId);
        if (!patient || patient.role !== 'patient') {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }

        // Validate doctor
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }

        // Remove from previous doctor if exists
        if (patient.assignedDoctor) {
            await User.findByIdAndUpdate(
                patient.assignedDoctor,
                { $pull: { assignedPatients: patientId } }
            );
        }

        // Assign new doctor
        patient.assignedDoctor = doctorId;
        await patient.save();

        // Add to doctor's patient list
        if (!doctor.assignedPatients.includes(patientId)) {
            doctor.assignedPatients.push(patientId);
            await doctor.save();
        }

        res.status(200).json({
            success: true,
            message: 'Doctor assigned successfully',
            data: {
                patient: patient.name,
                doctor: doctor.name
            }
        });
    } catch (error) {
        console.error('Assign doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning doctor'
        });
    }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        const totalHealthRecords = await HealthData.countDocuments();
        const totalAlerts = await Alert.countDocuments();
        const activeAlerts = await Alert.countDocuments({ status: 'active' });
        const criticalAlerts = await Alert.countDocuments({ severity: 'critical', status: 'active' });

        const totalEmergencies = await Emergency.countDocuments();
        const activeEmergencies = await Emergency.countDocuments({ status: 'active' });

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentHealthRecords = await HealthData.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        const recentAlerts = await Alert.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    patients: totalPatients,
                    doctors: totalDoctors,
                    admins: totalAdmins
                },
                healthRecords: {
                    total: totalHealthRecords,
                    lastWeek: recentHealthRecords
                },
                alerts: {
                    total: totalAlerts,
                    active: activeAlerts,
                    critical: criticalAlerts,
                    lastWeek: recentAlerts
                },
                emergencies: {
                    total: totalEmergencies,
                    active: activeEmergencies
                }
            }
        });
    } catch (error) {
        console.error('Get system stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching system statistics'
        });
    }
};

// @desc    Get doctors list (for assignment)
// @route   GET /api/admin/doctors
// @access  Private (Admin, Doctor)
exports.getDoctorsList = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', isActive: true })
            .select('name email specialization assignedPatients')
            .populate('assignedPatients', 'name');

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error('Get doctors list error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors'
        });
    }
};

// @desc    Get patients list
// @route   GET /api/admin/patients
// @access  Private (Admin, Doctor)
exports.getPatientsList = async (req, res) => {
    try {
        let query = { role: 'patient' };

        // If doctor, only show assigned patients
        if (req.user.role === 'doctor') {
            const doctor = await User.findById(req.user.id);
            query._id = { $in: doctor.assignedPatients };
        }

        const patients = await User.find(query)
            .select('name email phone assignedDoctor healthStreak consistencyScore')
            .populate('assignedDoctor', 'name specialization');

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('Get patients list error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patients'
        });
    }
};
