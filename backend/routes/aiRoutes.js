const express = require('express');
const router = express.Router();
const { getDoctorRecommendation } = require('../controllers/aiController');

// POST /api/ai/doctor-recommendation
router.post('/doctor-recommendation', getDoctorRecommendation);

module.exports = router;
