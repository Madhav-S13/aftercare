const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin only routes
router.get('/users', protect, authorize('admin'), adminController.getAllUsers);
router.get('/users/:id', protect, authorize('admin'), adminController.getUserById);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);
router.post('/assign-doctor', protect, authorize('admin'), adminController.assignDoctor);
router.get('/stats', protect, authorize('admin'), adminController.getSystemStats);

// Admin and Doctor routes
router.get('/doctors', protect, authorize('admin', 'doctor'), adminController.getDoctorsList);
router.get('/patients', protect, authorize('admin', 'doctor'), adminController.getPatientsList);

module.exports = router;
