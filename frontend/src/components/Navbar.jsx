import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Clock,
  Sparkles,
  Calendar,
  Search,
  Menu,
  X,
  ShieldCheck,
  HeartPulse,
  LogOut,
  User,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('wecare_admin_token');
  const adminUser = localStorage.getItem('wecare_admin_user');

  const handleLogout = () => {
    localStorage.removeItem('wecare_admin_token');
    localStorage.removeItem('wecare_admin_user');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Book Appointment', path: '/book-appointment' },
    { name: 'Track Booking', path: '/track-booking' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Emergency & Info Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-rose-400 font-semibold tracking-wide">
              <PhoneCall className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
              24/7 Emergency: <a href="tel:1800932273" className="ml-1 text-white hover:underline">1-800-WECARE-911</a>
            </span>
            <span className="hidden md:flex items-center text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              OPD Timings: Mon - Sat 08:00 AM - 08:00 PM
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-slate-400">
              JCI & NABH Accredited Healthcare Center
            </span>
            {token ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center text-sky-400 hover:text-sky-300 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-400 ml-2"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-slate-400 hover:text-white flex items-center transition-colors"
              >
                <User className="w-3.5 h-3.5 mr-1" />
                Admin Portal
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                WeCare <span className="text-sky-600 font-semibold">Hospital</span>
              </div>
              <div className="text-[10px] tracking-wider uppercase font-semibold text-teal-600 -mt-1">
                Advanced Care & Compassion
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-sky-600 bg-sky-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs: AI Assistant & Book Appointment */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* AI Doctor Assistant Button */}
            <Link
              to="/ai-assistant"
              className="relative inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-sky-700 bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 hover:border-sky-300 hover:bg-sky-100/60 shadow-sm transition-all group ai-pulse"
            >
              <Sparkles className="w-4 h-4 mr-2 text-sky-500 group-hover:rotate-12 transition-transform" />
              <span>Ask AI Doctor</span>
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">
                AI
              </span>
            </Link>

            {/* Book Appointment CTA */}
            <Link
              to="/book-appointment"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/25 transition-all hover:shadow-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <Link
              to="/ai-assistant"
              className="p-2 text-sky-600 bg-sky-50 rounded-lg sm:hidden"
              title="Ask AI Doctor"
            >
              <Sparkles className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'text-sky-600 bg-sky-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              to="/ai-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-sky-800 bg-sky-50 border border-sky-200"
            >
              <Sparkles className="w-4 h-4 mr-2 text-sky-600" />
              Ask AI Doctor Assistant
            </Link>
            <Link
              to="/book-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
