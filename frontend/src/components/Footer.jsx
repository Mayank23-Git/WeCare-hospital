import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  PhoneCall,
  MapPin,
  Mail,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                WeCare <span className="text-sky-400">Hospital</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              WeCare Hospital is a multidisciplinary quaternary care center dedicated to delivering world-class medical innovation, exceptional physician clinical expertise, and compassionate patient healing.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                Accredited by JCI & National Healthcare Board
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">
                  About WeCare
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-sky-400 transition-colors">
                  Departments
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-sky-400 transition-colors">
                  Specialist Doctors
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="hover:text-sky-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/track-booking" className="hover:text-sky-400 transition-colors">
                  Track Booking Status
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-sky-400 transition-colors flex items-center text-sky-400 font-medium">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Ask AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Medical Specialties */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Specialties
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/doctors?department=dept-cardiology" className="hover:text-sky-400 transition-colors">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link to="/doctors?department=dept-neurology" className="hover:text-sky-400 transition-colors">
                  Neurology
                </Link>
              </li>
              <li>
                <Link to="/doctors?department=dept-orthopedics" className="hover:text-sky-400 transition-colors">
                  Orthopedics & Spine
                </Link>
              </li>
              <li>
                <Link to="/doctors?department=dept-dermatology" className="hover:text-sky-400 transition-colors">
                  Dermatology
                </Link>
              </li>
              <li>
                <Link to="/doctors?department=dept-ent" className="hover:text-sky-400 transition-colors">
                  ENT & Head-Neck
                </Link>
              </li>
              <li>
                <Link to="/doctors?department=dept-pediatrics" className="hover:text-sky-400 transition-colors">
                  Pediatrics & Child
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Contacts */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Hospital Contact
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-sky-400 shrink-0 mt-0.5" />
                <span>450 Healthcare Boulevard, Metro Medical City, NY 10021</span>
              </div>
              <div className="flex items-center text-rose-400 font-medium">
                <PhoneCall className="w-4 h-4 mr-2 shrink-0" />
                <span>24/7 ER: 1-800-WECARE-911</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-sky-400 shrink-0" />
                <span>helpdesk@wecarehospital.org</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-sky-400 shrink-0" />
                <span>Emergency: 24 Hours / 7 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <strong className="text-slate-300">Important Medical Safety Notice:</strong> The information provided on this website, including guidance generated by the AI Doctor Assistant, is intended for informational and appointment-scheduling assistance only. It does not constitute medical diagnosis, advice, or treatment plans. In case of acute or life-threatening symptoms, immediately call your local emergency services (e.g. 911) or visit the nearest emergency medical facility.
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} WeCare Hospital Healthcare Systems. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-white">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white">Patient Rights</Link>
            <Link to="/admin/login" className="hover:text-sky-400">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
