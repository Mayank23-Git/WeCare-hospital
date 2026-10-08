import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Building,
  Stethoscope,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import BookingConfirmationModal from '../components/BookingConfirmationModal';

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor') || '';
  const preselectedDeptId = searchParams.get('department') || '';

  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    departmentId: preselectedDeptId,
    doctorId: preselectedDoctorId,
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientAge: '',
    patientGender: 'Prefer not to say',
    appointmentDate: '',
    appointmentTime: '09:00 AM',
    reason: '',
  });

  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Available Time Slots
  const defaultTimeSlots = [
    '09:00 AM',
    '09:45 AM',
    '10:30 AM',
    '11:15 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  // Fetch initial departments and doctors
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const [deptsRes, docsRes] = await Promise.all([
          api.getDepartments(),
          api.getDoctors(),
        ]);

        if (deptsRes.success) setDepartments(deptsRes.data);
        if (docsRes.success) {
          setDoctors(docsRes.data);

          // If doctor was preselected via URL, ensure department aligns
          if (preselectedDoctorId) {
            const foundDoc = docsRes.data.find((d) => d.doctorId === preselectedDoctorId);
            if (foundDoc) {
              setFormData((prev) => ({
                ...prev,
                doctorId: foundDoc.doctorId,
                departmentId: foundDoc.departmentId,
              }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load booking catalog:', err);
        setError('Failed to load doctors and departments. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    loadCatalog();
  }, [preselectedDoctorId, preselectedDeptId]);

  // Set default appointment date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      appointmentDate: prev.appointmentDate || dateStr,
    }));
  }, []);

  // Filter doctors based on selected department
  const filteredDoctors = formData.departmentId
    ? doctors.filter((doc) => doc.departmentId === formData.departmentId)
    : doctors;

  // Handle department change
  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setFormData((prev) => {
      // Find first doctor in new department
      const docInDept = doctors.find((d) => d.departmentId === deptId);
      return {
        ...prev,
        departmentId: deptId,
        doctorId: docInDept ? docInDept.doctorId : '',
      };
    });
  };

  // Handle doctor change
  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const doc = doctors.find((d) => d.doctorId === docId);
    setFormData((prev) => ({
      ...prev,
      doctorId: docId,
      departmentId: doc ? doc.departmentId : prev.departmentId,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone) {
      setError('Please provide patient name, email, and phone number.');
      return;
    }

    if (!formData.doctorId) {
      setError('Please select a doctor for your consultation.');
      return;
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      setError('Please choose an appointment date and time slot.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createAppointment(formData);
      if (res.success) {
        setConfirmedBooking(res.data);
      } else {
        setError(res.message || 'Failed to submit appointment.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.message || 'Network error occurred while reserving your slot.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctorObj = doctors.find((d) => d.doctorId === formData.doctorId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Seamless Healthcare Scheduling</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Book an Appointment
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Reserve your clinical consultation with our specialist doctors. Fill in your details below to receive your confirmed Booking Reference ID.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        {/* Left Form */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs sm:text-sm flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Department & Doctor Selection */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center mr-2">1</span>
                Select Department & Doctor
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Medical Department *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.departmentId}
                      onChange={handleDepartmentChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    >
                      <option value="">-- Choose Department --</option>
                      {departments.map((dept) => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Doctor Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Specialist Doctor *
                  </label>
                  <select
                    value={formData.doctorId}
                    onChange={handleDoctorChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  >
                    <option value="">-- Choose Doctor --</option>
                    {filteredDoctors.map((doc) => (
                      <option key={doc.doctorId} value={doc.doctorId}>
                        {doc.name} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center mr-2">2</span>
                Preferred Date & Time
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Time Slot *
                  </label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  >
                    {defaultTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Patient Information */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center mr-2">3</span>
                Patient Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="patientName"
                      placeholder="e.g. Eleanor Vance"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="patientEmail"
                      placeholder="e.g. eleanor@example.com"
                      value={formData.patientEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="patientPhone"
                      placeholder="e.g. +1 (555) 234-5678"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Age
                    </label>
                    <input
                      type="number"
                      name="patientAge"
                      placeholder="Years"
                      min="1"
                      max="120"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reason / Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reason for Visit / Primary Symptoms
                </label>
                <textarea
                  name="reason"
                  rows="3"
                  placeholder="Briefly describe your health concern or symptoms..."
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                ></textarea>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 shadow-md shadow-sky-600/25 transition-all flex items-center justify-center"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Logging Appointment...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Confirm & Submit Appointment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Upon submitting, a unique Booking ID will be generated with status "Pending".
              </p>
            </div>
          </form>
        </div>

        {/* Right Doctor & Visit Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Consultation Summary
            </h4>

            {selectedDoctorObj ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedDoctorObj.image}
                    alt={selectedDoctorObj.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{selectedDoctorObj.name}</h5>
                    <p className="text-xs text-teal-600 font-semibold">{selectedDoctorObj.specialization}</p>
                    <p className="text-xs text-slate-500">{selectedDoctorObj.department}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-3 border-t border-slate-200 text-slate-600">
                  <div className="flex justify-between">
                    <span>Consultation Fee:</span>
                    <strong className="text-slate-900">${selectedDoctorObj.consultationFee || 50}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Location:</span>
                    <strong className="text-slate-900">{selectedDoctorObj.roomNumber || 'Room 201'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Doctor Experience:</span>
                    <strong className="text-slate-900">{selectedDoctorObj.experience}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Select a doctor from the form to view their clinical credentials and room assignment.
              </p>
            )}
          </div>

          {/* AI Helper Banner */}
          <div className="bg-gradient-to-tr from-sky-900 to-teal-900 text-white p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Need help picking a doctor?</span>
            </div>
            <p className="text-xs text-sky-100 leading-relaxed">
              Use our AI Doctor Recommendation Assistant to analyze your health symptoms and pick the best physician.
            </p>
            <button
              onClick={() => navigate('/ai-assistant')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-sky-950 hover:bg-sky-50 transition-colors"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
}
