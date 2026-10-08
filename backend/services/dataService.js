const bcrypt = require('bcryptjs');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Admin = require('../models/Admin');
const { getDbStatus } = require('../config/db');
const { departmentsData, doctorsData, sampleAppointments } = require('../data/seedData');

// In-memory collections used when MongoDB instance is offline
let memoryDepartments = JSON.parse(JSON.stringify(departmentsData));
let memoryDoctors = JSON.parse(JSON.stringify(doctorsData));
let memoryAppointments = JSON.parse(JSON.stringify(sampleAppointments));
let memoryAdmins = [];

/**
 * Initializes database or memory store with default admin and seed catalog
 */
const initStore = async () => {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@wecare.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Initialize in-memory admin
  memoryAdmins = [
    {
      _id: 'admin-mem-01',
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    },
  ];

  if (getDbStatus()) {
    try {
      // Seed Departments if empty
      const deptCount = await Department.countDocuments();
      if (deptCount === 0) {
        await Department.insertMany(departmentsData);
        console.log('[Seed] Populated initial departments into MongoDB.');
      }

      // Seed Doctors if empty
      const docCount = await Doctor.countDocuments();
      if (docCount === 0) {
        await Doctor.insertMany(doctorsData);
        console.log('[Seed] Populated initial doctors into MongoDB.');
      }

      // Seed Sample Appointments if empty
      const apptCount = await Appointment.countDocuments();
      if (apptCount === 0) {
        await Appointment.insertMany(sampleAppointments);
        console.log('[Seed] Populated sample appointments into MongoDB.');
      }

      // Seed Default Admin if not exists
      const existingAdmin = await Admin.findOne({
        $or: [{ username: adminUsername }, { email: adminEmail }],
      });
      if (!existingAdmin) {
        await Admin.create({
          username: adminUsername,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        });
        console.log('[Seed] Default Admin created in MongoDB.');
      }
    } catch (err) {
      console.error('[Seed Error] Failed to seed MongoDB:', err.message);
    }
  }
};

// =================== DEPARTMENTS ===================
const getAllDepartments = async () => {
  if (getDbStatus()) {
    return await Department.find({}).sort({ name: 1 });
  }
  return memoryDepartments;
};

const getDepartmentById = async (id) => {
  if (getDbStatus()) {
    return await Department.findOne({
      $or: [{ departmentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });
  }
  return memoryDepartments.find((d) => d.departmentId === id || d._id === id);
};

// =================== DOCTORS ===================
const getAllDoctors = async (query = {}) => {
  const { department, search } = query;

  if (getDbStatus()) {
    let filter = {};
    if (department && department !== 'all') {
      filter.$or = [
        { departmentId: department },
        { department: new RegExp(`^${department}$`, 'i') },
      ];
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { name: searchRegex },
          { specialization: searchRegex },
          { department: searchRegex },
        ],
      });
    }
    return await Doctor.find(filter).sort({ rating: -1, name: 1 });
  }

  let list = [...memoryDoctors];
  if (department && department !== 'all') {
    const depLower = department.toLowerCase();
    list = list.filter(
      (doc) =>
        doc.departmentId.toLowerCase() === depLower ||
        doc.department.toLowerCase() === depLower
    );
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (doc) =>
        doc.name.toLowerCase().includes(s) ||
        doc.specialization.toLowerCase().includes(s) ||
        doc.department.toLowerCase().includes(s)
    );
  }
  return list;
};

const getDoctorById = async (id) => {
  if (getDbStatus()) {
    return await Doctor.findOne({
      $or: [{ doctorId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });
  }
  return memoryDoctors.find((d) => d.doctorId === id || d._id === id);
};

// =================== APPOINTMENTS ===================
const createAppointment = async (data) => {
  if (getDbStatus()) {
    const appt = new Appointment(data);
    return await appt.save();
  }
  const newAppt = {
    _id: `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryAppointments.unshift(newAppt);
  return newAppt;
};

const getAppointmentByBookingId = async (bookingId) => {
  const trimmed = bookingId ? bookingId.trim().toUpperCase() : '';
  if (getDbStatus()) {
    return await Appointment.findOne({
      bookingId: { $regex: new RegExp(`^${trimmed}$`, 'i') },
    });
  }
  return memoryAppointments.find(
    (a) => a.bookingId.toUpperCase() === trimmed
  );
};

const getAllAppointments = async (statusFilter = null) => {
  if (getDbStatus()) {
    const filter = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};
    return await Appointment.find(filter).sort({ createdAt: -1 });
  }
  if (statusFilter && statusFilter !== 'all') {
    return memoryAppointments.filter((a) => a.status.toLowerCase() === statusFilter.toLowerCase());
  }
  return memoryAppointments;
};

const updateAppointmentStatus = async (idOrBookingId, newStatus, adminNotes = '') => {
  if (getDbStatus()) {
    const filter = {
      $or: [
        { bookingId: idOrBookingId },
        { _id: idOrBookingId.match(/^[0-9a-fA-F]{24}$/) ? idOrBookingId : null },
      ],
    };
    const update = { status: newStatus };
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    return await Appointment.findOneAndUpdate(filter, update, { new: true });
  }

  const itemIndex = memoryAppointments.findIndex(
    (a) => a.bookingId === idOrBookingId || a._id === idOrBookingId
  );
  if (itemIndex === -1) return null;

  memoryAppointments[itemIndex].status = newStatus;
  if (adminNotes !== undefined) {
    memoryAppointments[itemIndex].adminNotes = adminNotes;
  }
  memoryAppointments[itemIndex].updatedAt = new Date();
  return memoryAppointments[itemIndex];
};

// =================== ADMIN ===================
const findAdminByCredentials = async (usernameOrEmail) => {
  const identifier = usernameOrEmail.trim().toLowerCase();
  if (getDbStatus()) {
    return await Admin.findOne({
      $or: [
        { username: new RegExp(`^${identifier}$`, 'i') },
        { email: identifier },
      ],
    });
  }
  return memoryAdmins.find(
    (a) =>
      a.username.toLowerCase() === identifier ||
      a.email.toLowerCase() === identifier
  );
};

module.exports = {
  initStore,
  getAllDepartments,
  getDepartmentById,
  getAllDoctors,
  getDoctorById,
  createAppointment,
  getAppointmentByBookingId,
  getAllAppointments,
  updateAppointmentStatus,
  findAdminByCredentials,
};
