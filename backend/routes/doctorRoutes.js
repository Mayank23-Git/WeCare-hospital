const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor } = require('../controllers/doctorController');

router.get('/', getDoctors);
router.get('/:id', getDoctor);

module.exports = router;
