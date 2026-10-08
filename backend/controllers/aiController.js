const { recommendDoctor } = require('../services/geminiService');

/**
 * @route   POST /api/ai/doctor-recommendation
 * @desc    Accepts patient symptoms and returns structured AI doctor and department recommendations
 */
const getDoctorRecommendation = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description of your symptoms or healthcare question.',
      });
    }

    const recommendation = await recommendDoctor(message.trim(), conversationHistory || []);

    res.json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error('[AI Controller Error]:', error.message);

    // Friendly error response per specification
    res.status(200).json({
      success: false,
      isUnavailable: true,
      message: 'Sorry, the AI assistant is temporarily unavailable. Please browse our departments or doctors directly.',
      options: [
        { label: 'Browse Departments', path: '/departments' },
        { label: 'View Doctors', path: '/doctors' },
        { label: 'Book Appointment', path: '/book-appointment' },
      ],
    });
  }
};

module.exports = {
  getDoctorRecommendation,
};
