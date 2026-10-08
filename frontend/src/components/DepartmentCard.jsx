import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  Brain,
  Activity,
  Baby,
  Ear,
  Stethoscope,
  Users,
  Smile,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

const iconMap = {
  Heart: Heart,
  Sparkles: Sparkles,
  Brain: Brain,
  Activity: Activity,
  Baby: Baby,
  Ear: Ear,
  Stethoscope: Stethoscope,
  Users: Users,
  Smile: Smile,
};

export default function DepartmentCard({ department }) {
  if (!department) return null;

  const IconComponent = iconMap[department.icon] || Stethoscope;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        {/* Icon & Count Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center">
            <UserCheck className="w-3 h-3 mr-1 text-teal-600" />
            {department.doctorCount || (department.doctors ? department.doctors.length : 2)} Specialists
          </span>
        </div>

        {/* Department Name & Specialization */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-1">
          {department.name}
        </h3>
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">
          {department.specialization}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {department.description}
        </p>

        {/* Doctors in department preview */}
        {department.doctors && department.doctors.length > 0 && (
          <div className="mb-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-2">
              Featured Doctors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {department.doctors.slice(0, 2).map((doc) => (
                <span
                  key={doc.doctorId}
                  className="text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 truncate max-w-[200px]"
                >
                  {doc.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <Link
          to={`/doctors?department=${department.departmentId}`}
          className="flex-1 inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          View Doctors
        </Link>
        <Link
          to={`/book-appointment?department=${department.departmentId}`}
          className="flex-1 inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors"
        >
          Book Now
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
