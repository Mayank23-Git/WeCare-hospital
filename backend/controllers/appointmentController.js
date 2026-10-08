const {
  createAppointment,
  getAppointmentByBookingId,
  getDoctorById,
  getDepartmentById,
} = require('../services/dataService');

/**
 * Generates an official WeCare Hospital booking ID
 * e.g., WCH-2026-583921
 */
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `WCH-${year}-${randomNum}`;
};

/**
 * @route   POST /api/appointments
 * @desc    Create a new patient appointment
 */
const bookAppointment = async (req, res, next) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      doctorId,
      departmentId,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    // Validate essential fields
    if (!patientName || !patientEmail || !patientPhone || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patientName, patientEmail, patientPhone, doctorId, appointmentDate, and appointmentTime.',
      });
    }

    // Lookup Doctor & Department names to guarantee integrity
    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Selected doctor with ID '${doctorId}' does not exist.`,
      });
    }

    let finalDepartmentId = departmentId || doctor.departmentId;
    let finalDepartmentName = doctor.department;
    if (finalDepartmentId) {
      const dept = await getDepartmentById(finalDepartmentId);
      if (dept) {
        finalDepartmentName = dept.name;
      }
    }

    const bookingId = generateBookingId();

    const newAppointment = await createAppointment({
      bookingId,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      patientPhone: patientPhone.trim(),
      patientAge: patientAge ? Number(patientAge) : null,
      patientGender: patientGender || 'Prefer not to say',
      doctorId: doctor.doctorId,
      doctorName: doctor.name,
      departmentId: finalDepartmentId,
      departmentName: finalDepartmentName,
      appointmentDate,
      appointmentTime,
      reason: reason ? reason.trim() : 'General Consultation',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booking successfully created!',
      data: {
        bookingId: newAppointment.bookingId,
        patientName: newAppointment.patientName,
        doctor: newAppointment.doctorName,
        doctorId: newAppointment.doctorId,
        department: newAppointment.departmentName,
        departmentId: newAppointment.departmentId,
        date: newAppointment.appointmentDate,
        time: newAppointment.appointmentTime,
        status: newAppointment.status,
        createdAt: newAppointment.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/appointments/:bookingId
 * @desc    Track patient booking by Booking ID
 */
const trackAppointment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Booking ID.',
      });
    }

    const appointment = await getAppointmentByBookingId(bookingId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found matching Booking ID '${bookingId}'. Please verify your reference number.`,
      });
    }

    res.json({
      success: true,
      data: {
        bookingId: appointment.bookingId,
        patientName: appointment.patientName,
        doctor: appointment.doctorName,
        doctorId: appointment.doctorId,
        department: appointment.departmentName,
        departmentId: appointment.departmentId,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime,
        status: appointment.status,
        reason: appointment.reason,
        adminNotes: appointment.adminNotes || '',
        createdAt: appointment.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  trackAppointment,
};
