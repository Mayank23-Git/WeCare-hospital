const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    patientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    patientAge: {
      type: Number,
      default: null,
    },
    patientGender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    departmentId: {
      type: String,
      required: true,
    },
    departmentName: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: 'General consultation',
    },
    status: {
      type: String,
      enum: ['Pending', 'Waiting', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
