const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  trackAppointment,
} = require('../controllers/appointmentController');

router.post('/', bookAppointment);
router.get('/:bookingId', trackAppointment);

module.exports = router;
