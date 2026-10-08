import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Building,
  Stethoscope,
  Phone,
  Mail,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import api from '../services/api';

export default function TrackBooking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBookingId = searchParams.get('bookingId') || '';

  const [bookingIdInput, setBookingIdInput] = useState(initialBookingId);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooking = async (id) => {
    if (!id || id.trim() === '') return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.trackAppointment(id.trim());
      if (res.success) {
        setAppointment(res.data);
      } else {
        setError(res.message || 'Appointment not found.');
        setAppointment(null);
      }
    } catch (err) {
      console.error('Error tracking booking:', err);
      setError(err.message || 'Could not locate booking reference. Please check your Booking ID.');
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialBookingId) {
      fetchBooking(initialBookingId);
    }
  }, [initialBookingId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (bookingIdInput.trim()) {
      setSearchParams({ bookingId: bookingIdInput.trim().toUpperCase() });
      fetchBooking(bookingIdInput.trim().toUpperCase());
    }
  };

  // Helper for Stepper
  const getStatusStep = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return 3;
      case 'waiting':
        return 2;
      case 'pending':
      default:
        return 1;
    }
  };

  const currentStep = appointment ? getStatusStep(appointment.status) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-Time Appointment Tracker</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Track Your Booking
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Enter your official Booking ID (e.g. <span className="font-mono font-semibold text-slate-800">WCH-2026-104921</span>) to check your real-time clinical confirmation status.
        </p>
      </div>

      {/* Booking ID Search Form */}
      <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Booking ID (e.g. WCH-2026-104921)"
              value={bookingIdInput}
              onChange={(e) => setBookingIdInput(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm tracking-wide uppercase text-slate-900 placeholder:normal-case placeholder:font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold text-sm shadow-sm transition-all shrink-0 flex items-center justify-center"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : (
              <Search className="w-4 h-4 mr-1.5" />
            )}
            Track Status
          </button>
        </form>

        {/* Quick Sample IDs for testing */}
        <div className="mt-3 text-[11px] text-slate-400 flex items-center flex-wrap gap-2">
          <span>Try Demo IDs:</span>
          {['WCH-2026-104921', 'WCH-2026-402811', 'WCH-2026-891024'].map((demoId) => (
            <button
              key={demoId}
              type="button"
              onClick={() => {
                setBookingIdInput(demoId);
                setSearchParams({ bookingId: demoId });
                fetchBooking(demoId);
              }}
              className="font-mono text-sky-600 hover:underline bg-sky-50 px-2 py-0.5 rounded"
            >
              {demoId}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
          <div className="h-16 bg-slate-100 rounded-2xl"></div>
          <div className="h-32 bg-slate-100 rounded-2xl"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-xl mx-auto bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-3xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
          <h4 className="font-bold text-base">Booking Not Found</h4>
          <p className="text-xs leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link
              to="/book-appointment"
              className="inline-flex items-center text-xs font-semibold text-rose-800 underline"
            >
              Book a New Appointment Instead
            </Link>
          </div>
        </div>
      )}

      {/* Appointment Result Card */}
      {appointment && !loading && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
                Official Booking Reference
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wide mt-1">
                {appointment.bookingId}
              </h2>
            </div>

            {/* Current Status Badge */}
            <div className="shrink-0">
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  appointment.status === 'Confirmed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : appointment.status === 'Waiting'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full mr-2 bg-current animate-ping"></span>
                Status: {appointment.status}
              </span>
            </div>
          </div>

          {/* Real-Time Status Timeline Stepper */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
              Appointment Progress Timeline
            </h4>

            <div className="grid grid-cols-3 gap-2 relative">
              {/* Step 1: Pending */}
              <div className="text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                    currentStep >= 1
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Pending</div>
                  <p className="text-[10px] text-slate-500 hidden sm:block">
                    Request Logged
                  </p>
                </div>
              </div>

              {/* Step 2: Waiting */}
              <div className="text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                    currentStep >= 2
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Waiting</div>
                  <p className="text-[10px] text-slate-500 hidden sm:block">
                    Clinical Review
                  </p>
                </div>
              </div>

              {/* Step 3: Confirmed */}
              <div className="text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                    currentStep >= 3
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Confirmed</div>
                  <p className="text-[10px] text-slate-500 hidden sm:block">
                    Slot Reserved
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Information Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Patient Name</span>
                    <strong className="text-slate-900 text-base">{appointment.patientName}</strong>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Stethoscope className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Consulting Physician</span>
                    <strong className="text-slate-900 text-base">{appointment.doctor}</strong>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Medical Department</span>
                    <strong className="text-slate-900 text-base">{appointment.department}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Scheduled Date</span>
                    <strong className="text-slate-900 text-base">{appointment.date}</strong>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Reserved Time Slot</span>
                    <strong className="text-slate-900 text-base">{appointment.time}</strong>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="flex items-start space-x-3">
                    <FileCheck className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block">Reason for Visit</span>
                      <span className="text-slate-700 text-xs">{appointment.reason}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes Notice if any */}
            {appointment.adminNotes && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Hospital Staff Notes:</strong> {appointment.adminNotes}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
              <button
                onClick={() => fetchBooking(appointment.bookingId)}
                className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Refresh Status
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Print Summary
                </button>
                <Link
                  to="/book-appointment"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white"
                >
                  Book Another Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
