const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Patient routes
router.post('/', protect, authorize('patient'), emergencyController.triggerSOS);

// Shared routes
router.get('/', protect, emergencyController.getEmergencies);

// Doctor/Admin routes
router.put('/:id/respond', protect, authorize('doctor', 'admin'), emergencyController.respondToEmergency);
router.put('/:id/resolve', protect, authorize('doctor', 'admin'), emergencyController.resolveEmergency);

module.exports = router;
