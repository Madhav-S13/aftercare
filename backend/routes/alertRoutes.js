const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Patient routes
router.get('/', protect, authorize('patient'), alertController.getMyAlerts);

// Doctor routes
router.get('/doctor', protect, authorize('doctor', 'admin'), alertController.getDoctorAlerts);

router.post('/doctor-alert', protect, authorize('doctor'), alertController.sendDoctorAlert);

router.get('/stats', protect, authorize('doctor', 'admin'), alertController.getAlertStats);

// Shared routes
router.put('/:id/acknowledge', protect, alertController.acknowledgeAlert);

router.put('/:id/resolve', protect, authorize('doctor', 'admin'), alertController.resolveAlert);

router.put('/mark-read', protect, authorize('doctor', 'patient'), alertController.markAllAsRead);

module.exports = router;
