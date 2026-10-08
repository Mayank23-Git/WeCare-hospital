import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Award,
  Calendar,
  Building,
  CheckCircle,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function DoctorCard({ doctor, onSelect, compact = false }) {
  if (!doctor) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Header with Image and Badges */}
        <div className="relative p-5 pb-0 flex items-start space-x-4">
          <div className="relative shrink-0">
            <img
              src={doctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full" title="Available"></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                {doctor.department}
              </span>
              <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-current mr-1 text-amber-400" />
                {doctor.rating || 4.9}
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
              {doctor.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 truncate">
              {doctor.qualification || 'MBBS, MD'}
            </p>
            <p className="text-xs text-teal-600 font-semibold mt-0.5 truncate">
              {doctor.specialization}
            </p>
          </div>
        </div>

        {/* Details & Specs */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>
                <strong>{doctor.experience}</strong> Exp
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="truncate">{doctor.roomNumber || 'Outpatient Clinic'}</span>
            </div>
          </div>

          {!compact && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {doctor.biography}
            </p>
          )}

          {/* Availability Box */}
          <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 space-y-1 border border-slate-100">
            <div className="flex items-center font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-sky-600 shrink-0" />
              <span>Available Schedule:</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-5 truncate">
              {Array.isArray(doctor.availability) && doctor.availability.length > 0
                ? doctor.availability[0]
                : 'Mon - Fri: 09:00 AM - 01:00 PM'}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer: Fee & Action CTA */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Consultation</span>
          <span className="text-base font-bold text-slate-900">${doctor.consultationFee || 50}</span>
        </div>

        {onSelect ? (
          <button
            onClick={() => onSelect(doctor)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Select Doctor
          </button>
        ) : (
          <Link
            to={`/book-appointment?doctor=${doctor.doctorId}&department=${doctor.departmentId}`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all group-hover:bg-sky-500"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Book Appointment
          </Link>
        )}
      </div>
    </div>
  );
}
