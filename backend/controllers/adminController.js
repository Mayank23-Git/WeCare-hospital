const jwt = require('jsonwebtoken');
const {
  findAdminByCredentials,
  getAllAppointments,
  updateAppointmentStatus,
  getAllDoctors,
  getAllDepartments,
} = require('../services/dataService');

/**
 * Generates a signed JWT token for admin session
 */
const generateToken = (admin) => {
  const secret = process.env.JWT_SECRET || 'wecare-hospital-super-secret-jwt-key-2026';
  return jwt.sign(
    {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin and retrieve JWT
 */
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username/email and password.',
      });
    }

    const admin = await findAdminByCredentials(username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    // Check password
    let isMatch = false;
    if (admin.matchPassword) {
      isMatch = await admin.matchPassword(password);
    } else {
      const bcrypt = require('bcryptjs');
      isMatch = await bcrypt.compare(password, admin.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    const token = generateToken(admin);

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/appointments
 * @desc    Retrieve all appointments for the Admin Dashboard
 */
const getAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const appointments = await getAllAppointments(status);

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/appointments/:id/status
 * @desc    Update appointment status (Confirm, Waiting, Pending, Cancelled)
 */
const changeAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowed = ['Pending', 'Waiting', 'Confirmed', 'Cancelled'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted values are: ${allowed.join(', ')}`,
      });
    }

    const updated = await updateAppointmentStatus(id, status, adminNotes);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Appointment with reference '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      message: `Appointment status successfully updated to '${status}'.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Retrieve hospital KPI statistics for dashboard
 */
const getAdminStats = async (req, res, next) => {
  try {
    const allAppointments = await getAllAppointments();
    const doctors = await getAllDoctors();
    const departments = await getAllDepartments();

    const pendingCount = allAppointments.filter((a) => a.status === 'Pending').length;
    const waitingCount = allAppointments.filter((a) => a.status === 'Waiting').length;
    const confirmedCount = allAppointments.filter((a) => a.status === 'Confirmed').length;
    const cancelledCount = allAppointments.filter((a) => a.status === 'Cancelled').length;

    res.json({
      success: true,
      data: {
        totalAppointments: allAppointments.length,
        pending: pendingCount,
        waiting: waitingCount,
        confirmed: confirmedCount,
        cancelled: cancelledCount,
        totalDoctors: doctors.length,
        totalDepartments: departments.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  getAppointments,
  changeAppointmentStatus,
  getAdminStats,
};
