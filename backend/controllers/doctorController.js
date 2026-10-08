const { getAllDoctors, getDoctorById } = require('../services/dataService');

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors (supports ?department=... and ?search=...)
 */
const getDoctors = async (req, res, next) => {
  try {
    const { department, search } = req.query;
    const doctors = await getAllDoctors({ department, search });

    res.json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/doctors/:id
 * @desc    Get single doctor by ID
 */
const getDoctor = async (req, res, next) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID '${req.params.id}' was not found.`,
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctor,
};
