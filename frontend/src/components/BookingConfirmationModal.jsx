import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Copy,
  Calendar,
  Clock,
  User,
  Building,
  Stethoscope,
  ArrowRight,
  Printer,
  X,
} from 'lucide-react';

export default function BookingConfirmationModal({ booking, onClose }) {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!booking) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scaleUp">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 to-teal-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <CheckCircle className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Appointment Requested!</h2>
          <p className="text-sky-100 text-xs mt-1">
            Your booking request has been logged and is awaiting clinical confirmation.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Booking ID Box */}
          <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-4 text-center">
            <span className="text-xs uppercase font-bold text-sky-800 tracking-wider">
              Your Official Booking Reference ID
            </span>
            <div className="flex items-center justify-center gap-3 mt-1.5">
              <span className="text-2xl font-extrabold text-sky-950 tracking-wide font-mono">
                {booking.bookingId}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white border border-sky-200 text-sky-600 hover:bg-sky-100 transition-colors"
                title="Copy Reference ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <span className="text-[11px] font-semibold text-teal-600 mt-1 block">
                ✓ Copied to clipboard!
              </span>
            )}
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-sm divide-y divide-slate-100">
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" /> Patient Name
              </span>
              <span className="font-semibold text-slate-900">{booking.patientName}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500 flex items-center">
                <Stethoscope className="w-4 h-4 mr-2 text-slate-400" /> Doctor
              </span>
              <span className="font-semibold text-slate-900">{booking.doctor}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500 flex items-center">
                <Building className="w-4 h-4 mr-2 text-slate-400" /> Department
              </span>
              <span className="font-semibold text-slate-900">{booking.department}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Date
              </span>
              <span className="font-semibold text-slate-900">{booking.date}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-400" /> Time Slot
              </span>
              <span className="font-semibold text-slate-900">{booking.time}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Initial Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {booking.status || 'Pending'}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/track-booking?bookingId=${booking.bookingId}`);
              }}
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all"
            >
              Track This Booking Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print Confirmation
              </button>
              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
