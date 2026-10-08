const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAppointments,
  changeAppointmentStatus,
  getAdminStats,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

// Public route
router.post('/login', adminLogin);

// Protected routes
router.get('/appointments', protectAdmin, getAppointments);
router.patch('/appointments/:id/status', protectAdmin, changeAppointmentStatus);
router.get('/stats', protectAdmin, getAdminStats);

module.exports = router;
