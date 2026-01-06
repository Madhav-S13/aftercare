const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');
const User = require('../models/User');
const { analyzeHealthData, analyzeTrend, getRecommendations } = require('../utils/riskAnalysis');
const { body } = require('express-validator');

// @desc    Submit health data
// @route   POST /api/health
// @access  Private (Patient)
exports.submitHealthData = async (req, res) => {
    try {
        const {
            bloodPressure,
            heartRate,
            spO2,
            temperature,
            symptoms,
            notes,
            submittedVia
        } = req.body;

        // Create health data entry
        const healthData = await HealthData.create({
            patient: req.user.id,
            bloodPressure,
            heartRate,
            spO2,
            temperature,
            symptoms,
            notes,
            submittedVia: submittedVia || 'manual'
        });

        // Perform risk analysis
        const riskAnalysis = analyzeHealthData(healthData);

        // Update health data with risk assessment
        healthData.riskScore = riskAnalysis.riskScore;
        healthData.riskLevel = riskAnalysis.riskLevel;
        await healthData.save();

        // Create alerts if necessary
        if (riskAnalysis.alerts && riskAnalysis.alerts.length > 0) {
            for (const alert of riskAnalysis.alerts) {
                await Alert.create({
                    patient: req.user.id,
                    healthData: healthData._id,
                    type: 'threshold',
                    severity: alert.severity,
                    title: `${alert.vital} Alert`,
                    message: alert.message,
                    triggerValues: {
                        [alert.vital]: healthData[alert.vital]
                    },
                    notifiedPatient: true,
                    notifiedDoctor: alert.severity === 'critical' || alert.severity === 'high'
                });
            }
        }

        // Update gamification streak
        await updateHealthStreak(req.user.id);

        // Get recommendations
        const recommendations = getRecommendations(riskAnalysis, healthData);

        res.status(201).json({
            success: true,
            message: 'Health data submitted successfully',
            data: healthData,
            riskAnalysis: {
                riskScore: riskAnalysis.riskScore,
                riskLevel: riskAnalysis.riskLevel,
                individualRisks: riskAnalysis.individualRisks
            },
            recommendations,
            alerts: riskAnalysis.alerts
        });
    } catch (error) {
        console.error('Submit health data error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error submitting health data'
        });
    }
};

// @desc    Get patient's health history
// @route   GET /api/health/history
// @access  Private (Patient)
exports.getHealthHistory = async (req, res) => {
    try {
        const { days, limit } = req.query;

        let query = { patient: req.user.id };

        // Filter by days if provided
        if (days) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(days));
            query.recordedAt = { $gte: startDate };
        }

        const healthData = await HealthData.find(query)
            .sort({ recordedAt: -1 })
            .limit(limit ? parseInt(limit) : 100);

        // Perform trend analysis
        const trendAnalysis = analyzeTrend(healthData);

        res.status(200).json({
            success: true,
            count: healthData.length,
            data: healthData,
            trendAnalysis
        });
    } catch (error) {
        console.error('Get health history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching health history'
        });
    }
};

// @desc    Get single health data entry
// @route   GET /api/health/:id
// @access  Private
exports.getHealthDataById = async (req, res) => {
    try {
        const healthData = await HealthData.findById(req.params.id)
            .populate('patient', 'name email');

        if (!healthData) {
            return res.status(404).json({
                success: false,
                message: 'Health data not found'
            });
        }

        // Authorization check
        if (req.user.role === 'patient' && healthData.patient._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this data'
            });
        }

        res.status(200).json({
            success: true,
            data: healthData
        });
    } catch (error) {
        console.error('Get health data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching health data'
        });
    }
};

// @desc    Get patient's health data (for doctors)
// @route   GET /api/health/patient/:patientId
// @access  Private (Doctor)
exports.getPatientHealthData = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { days, limit } = req.query;

        // Check if doctor has access to this patient
        const doctor = await User.findById(req.user.id);
        const isAssigned = doctor.assignedPatients.some(
            p => p.toString() === patientId
        );

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not assigned to this patient'
            });
        }

        let query = { patient: patientId };

        if (days) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(days));
            query.recordedAt = { $gte: startDate };
        }

        const healthData = await HealthData.find(query)
            .sort({ recordedAt: -1 })
            .limit(limit ? parseInt(limit) : 100)
            .populate('patient', 'name email phone');

        const trendAnalysis = analyzeTrend(healthData);

        res.status(200).json({
            success: true,
            count: healthData.length,
            data: healthData,
            trendAnalysis
        });
    } catch (error) {
        console.error('Get patient health data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient health data'
        });
    }
};

// @desc    Add doctor notes to health data
// @route   PUT /api/health/:id/notes
// @access  Private (Doctor)
exports.addDoctorNotes = async (req, res) => {
    try {
        const { notes } = req.body;

        const healthData = await HealthData.findById(req.params.id);

        if (!healthData) {
            return res.status(404).json({
                success: false,
                message: 'Health data not found'
            });
        }

        healthData.doctorNotes = notes;
        healthData.doctorReviewed = true;
        healthData.reviewedAt = new Date();
        await healthData.save();

        res.status(200).json({
            success: true,
            message: 'Doctor notes added successfully',
            data: healthData
        });
    } catch (error) {
        console.error('Add doctor notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding doctor notes'
        });
    }
};

// @desc    Get health statistics
// @route   GET /api/health/stats/:patientId
// @access  Private
exports.getHealthStats = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Authorization check
        if (req.user.role === 'patient' && patientId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const stats = await HealthData.aggregate([
            {
                $match: {
                    patient: require('mongoose').Types.ObjectId(patientId),
                    recordedAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    avgSystolic: { $avg: '$bloodPressure.systolic' },
                    avgDiastolic: { $avg: '$bloodPressure.diastolic' },
                    avgHeartRate: { $avg: '$heartRate' },
                    avgSpO2: { $avg: '$spO2' },
                    avgTemperature: { $avg: '$temperature' },
                    avgRiskScore: { $avg: '$riskScore' },
                    totalReadings: { $sum: 1 },
                    criticalCount: {
                        $sum: { $cond: [{ $eq: ['$riskLevel', 'critical'] }, 1, 0] }
                    },
                    warningCount: {
                        $sum: { $cond: [{ $eq: ['$riskLevel', 'warning'] }, 1, 0] }
                    },
                    normalCount: {
                        $sum: { $cond: [{ $eq: ['$riskLevel', 'normal'] }, 1, 0] }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0] || {}
        });
    } catch (error) {
        console.error('Get health stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching health statistics'
        });
    }
};

// Helper function to update health streak
const updateHealthStreak = async (userId) => {
    try {
        const user = await User.findById(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastSubmission = user.lastSubmissionDate ? new Date(user.lastSubmissionDate) : null;

        if (lastSubmission) {
            lastSubmission.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today - lastSubmission) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                // Consecutive day
                user.healthStreak += 1;
            } else if (daysDiff > 1) {
                // Streak broken
                user.healthStreak = 1;
            }
            // If same day, don't change streak
        } else {
            // First submission
            user.healthStreak = 1;
        }

        user.lastSubmissionDate = new Date();

        // Update consistency score (percentage of days with data in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCount = await HealthData.countDocuments({
            patient: userId,
            recordedAt: { $gte: thirtyDaysAgo }
        });
        user.consistencyScore = Math.min(Math.round((recentCount / 30) * 100), 100);

        // Award badges
        if (user.healthStreak === 7 && !user.badges.some(b => b.name === '7-Day Streak')) {
            user.badges.push({
                name: '7-Day Streak',
                earnedDate: new Date(),
                icon: '🔥'
            });
        }
        if (user.healthStreak === 30 && !user.badges.some(b => b.name === '30-Day Streak')) {
            user.badges.push({
                name: '30-Day Streak',
                earnedDate: new Date(),
                icon: '🏆'
            });
        }

        await user.save();
    } catch (error) {
        console.error('Update health streak error:', error);
    }
};

// Validation rules
exports.submitHealthDataValidation = [
    body('bloodPressure.systolic').isInt({ min: 60, max: 250 }).withMessage('Invalid systolic BP'),
    body('bloodPressure.diastolic').isInt({ min: 40, max: 150 }).withMessage('Invalid diastolic BP'),
    body('heartRate').isInt({ min: 40, max: 200 }).withMessage('Invalid heart rate'),
    body('spO2').isInt({ min: 70, max: 100 }).withMessage('Invalid SpO₂'),
    body('temperature').isFloat({ min: 90, max: 110 }).withMessage('Invalid temperature')
];
