const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    departmentId: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
      required: true,
    },
    availability: {
      type: [String],
      default: ['Mon - Fri: 9:00 AM - 1:00 PM', 'Mon - Thu: 3:00 PM - 6:00 PM'],
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    timeSlots: {
      type: [String],
      default: [
        '09:00 AM',
        '09:45 AM',
        '10:30 AM',
        '11:15 AM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
      ],
    },
    qualification: {
      type: String,
      default: 'MBBS, MD',
    },
    consultationFee: {
      type: Number,
      default: 50,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    roomNumber: {
      type: String,
      default: 'Room 204, Wing B',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
