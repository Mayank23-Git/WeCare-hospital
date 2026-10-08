import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Check,
  Hourglass,
  Phone,
  Mail,
  Building,
  Stethoscope,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pending: 0,
    waiting: 0,
    confirmed: 0,
    cancelled: 0,
    totalDoctors: 18,
    totalDepartments: 9,
  });

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const token = localStorage.getItem('wecare_admin_token');
  const adminUser = JSON.parse(localStorage.getItem('wecare_admin_user') || '{}');

  // Route protection
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apptRes, statsRes] = await Promise.all([
        api.getAdminAppointments(statusFilter),
        api.getAdminStats(),
      ]);

      if (apptRes.success) {
        setAppointments(apptRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      if (err.message.includes('401') || err.message.includes('Access denied')) {
        localStorage.removeItem('wecare_admin_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, statusFilter]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const res = await api.updateAppointmentStatus(bookingId, newStatus, `Status updated by ${adminUser.username || 'admin'}`);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Booking #${bookingId} successfully updated to "${newStatus}"!`,
        });

        // Update local state immediately
        setAppointments((prev) =>
          prev.map((a) => (a.bookingId === bookingId ? { ...a, status: newStatus } : a))
        );

        // Refresh stats
        const freshStats = await api.getAdminStats();
        if (freshStats.success) setStats(freshStats.data);

        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update appointment status.',
      });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wecare_admin_token');
    localStorage.removeItem('wecare_admin_user');
    navigate('/admin/login');
  };

  // Filter appointments locally by search term
  const filteredAppointments = appointments.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.bookingId.toLowerCase().includes(term) ||
      a.patientName.toLowerCase().includes(term) ||
      (a.patientEmail && a.patientEmail.toLowerCase().includes(term)) ||
      (a.patientPhone && a.patientPhone.toLowerCase().includes(term)) ||
      (a.doctorName && a.doctorName.toLowerCase().includes(term)) ||
      (a.doctor && a.doctor.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight">Admin Hospital Console</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <strong className="text-white">{adminUser.username || 'admin'}</strong> ({adminUser.email || 'admin@wecare.com'})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors flex items-center"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Logout
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Bookings</span>
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats.totalAppointments}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">All recorded requests</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm bg-gradient-to-br from-white to-sky-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-sky-700">Pending Review</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-sky-600 mt-2">
            {stats.pending}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting reception triage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm bg-gradient-to-br from-white to-amber-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-700">Waiting Queue</span>
            <Hourglass className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">
            {stats.waiting}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">In clinical review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-700">Confirmed Slots</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">
            {stats.confirmed}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Reserved & verified</span>
        </div>
      </div>

      {/* Real-Time Notification Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bookings Management Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Controls (Filter & Search) */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Pending', 'Waiting', 'Confirmed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All Bookings' : status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, patient, doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
          </div>
        </div>

        {/* Table Component */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Booking ID</th>
                <th className="py-3.5 px-4 font-bold">Patient Details</th>
                <th className="py-3.5 px-4 font-bold">Doctor & Dept</th>
                <th className="py-3.5 px-4 font-bold">Schedule</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                      <span>Loading patient appointments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No appointments found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => {
                  const isUpdating = updatingId === appt.bookingId;

                  return (
                    <tr key={appt.bookingId} className="hover:bg-slate-50/70 transition-colors">
                      {/* Booking ID */}
                      <td className="py-4 px-4 font-mono font-bold text-sky-700 whitespace-nowrap">
                        <Link
                          to={`/track-booking?bookingId=${appt.bookingId}`}
                          target="_blank"
                          className="hover:underline flex items-center"
                          title="View patient track page"
                        >
                          {appt.bookingId}
                          <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                        </Link>
                      </td>

                      {/* Patient Name & Contact */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{appt.patientName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-slate-400" />
                            {appt.patientPhone}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1 text-slate-400" />
                            {appt.patientEmail}
                          </span>
                        </div>
                      </td>

                      {/* Doctor & Department */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 flex items-center">
                          <Stethoscope className="w-3 h-3 mr-1 text-sky-500 shrink-0" />
                          <span>{appt.doctorName || appt.doctor}</span>
                        </div>
                        <div className="text-[11px] text-teal-600 font-medium">
                          {appt.departmentName || appt.department}
                        </div>
                      </td>

                      {/* Appointment Date & Time */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                          {appt.appointmentDate || appt.date}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center mt-0.5">
                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                          {appt.appointmentTime || appt.time}
                        </div>
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            appt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : appt.status === 'Waiting'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                          {appt.status}
                        </span>
                      </td>

                      {/* Admin Action Buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* Confirm Button */}
                          <button
                            onClick={() => handleUpdateStatus(appt.bookingId, 'Confirmed')}
                            disabled={isUpdating || appt.status === 'Confirmed'}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center ${
                              appt.status === 'Confirmed'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            }`}
                            title="Set status to Confirmed"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Confirm
                          </button>

                          {/* Waiting Button */}
                          <button
                            onClick={() => handleUpdateStatus(appt.bookingId, 'Waiting')}
                            disabled={isUpdating || appt.status === 'Waiting'}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center ${
                              appt.status === 'Waiting'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                            }`}
                            title="Set status to Waiting"
                          >
                            <Hourglass className="w-3 h-3 mr-1" />
                            Waiting
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
