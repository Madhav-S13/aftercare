const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/errorHandler');

// Patient routes
router.post(
    '/',
    protect,
    authorize('patient'),
    healthController.submitHealthDataValidation,
    validate,
    healthController.submitHealthData
);

router.get(
    '/history',
    protect,
    authorize('patient'),
    healthController.getHealthHistory
);

// Doctor routes
router.get(
    '/patient/:patientId',
    protect,
    authorize('doctor', 'admin'),
    healthController.getPatientHealthData
);

router.put(
    '/:id/notes',
    protect,
    authorize('doctor', 'admin'),
    healthController.addDoctorNotes
);

// Shared routes
router.get(
    '/stats/:patientId',
    protect,
    healthController.getHealthStats
);

router.get(
    '/:id',
    protect,
    healthController.getHealthDataById
);

module.exports = router;
