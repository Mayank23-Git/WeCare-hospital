import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  PhoneCall,
  Clock,
  ShieldCheck,
  HeartPulse,
  Activity,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Building,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import DepartmentCard from '../components/DepartmentCard';
import DoctorCard from '../components/DoctorCard';

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptsRes, docsRes] = await Promise.all([
          api.getDepartments(),
          api.getDoctors(),
        ]);
        if (deptsRes.success) setDepartments(deptsRes.data.slice(0, 4));
        if (docsRes.success) setDoctors(docsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page preview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Tag */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Welcome to WeCare Hospital • Quaternary Healthcare</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
                World-Class Clinical Care,{' '}
                <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
                  Intelligent Guidance.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Experience next-generation hospital care. From board-certified specialists to our revolutionary AI Doctor Recommendation Assistant, we ensure you connect with the right care at the right time.
              </p>

              {/* Dual Main CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-2xl text-base font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/30 hover:shadow-xl transition-all"
                >
                  <Calendar className="w-5 h-5 mr-2.5" />
                  Book an Appointment
                </Link>

                <Link
                  to="/ai-assistant"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-2xl text-base font-bold text-sky-900 bg-gradient-to-r from-sky-100 to-teal-100 hover:from-sky-200 hover:to-teal-200 border border-sky-300 shadow-sm transition-all group ai-pulse"
                >
                  <Sparkles className="w-5 h-5 mr-2.5 text-sky-600 group-hover:rotate-12 transition-transform" />
                  <span>Not Sure Which Doctor? Ask AI</span>
                </Link>
              </div>

              {/* Trust Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">45+</div>
                  <div className="text-xs text-slate-500 font-medium">Board Specialists</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">24/7</div>
                  <div className="text-xs text-slate-500 font-medium">Emergency Care</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">98.6%</div>
                  <div className="text-xs text-slate-500 font-medium">Patient Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Visual Image & Quick Emergency Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                    alt="WeCare Hospital Facility"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  {/* Floating AI Callout */}
                  <div className="p-5 bg-white border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">AI Medical Triage</h4>
                          <p className="text-xs text-slate-500">Instant symptom-to-doctor matchmaking</p>
                        </div>
                      </div>
                      <Link
                        to="/ai-assistant"
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center"
                      >
                        Try Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Emergency Badge */}
                <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-rose-400">Rapid Trauma Response</div>
                    <div className="text-sm font-bold">1-800-WECARE-911</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 24x7 EMERGENCY & URGENT CARE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                24/7 Acute & Emergency Services
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
                Immediate Critical Care Always Open
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Level 1 Trauma Center, Chest Pain Unit, and Stroke Care Center operating around the clock with rapid ambulance dispatch.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href="tel:1800932273"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors text-center"
            >
              Call Ambulance: 1-800-WECARE-911
            </a>
            <Link
              to="/book-appointment"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors text-center"
            >
              Schedule Routine Visit
            </Link>
          </div>
        </div>
      </section>

      {/* AI DOCTOR ASSISTANT FEATURE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-sky-900 via-sky-800 to-teal-800 text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Feature Spotlight • AI Doctor Assistant</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Not sure which specialist you should consult?
              </h2>
              <p className="text-sky-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Describe your symptoms in simple everyday language. Powered by Google Gemini AI, our assistant analyzes your health concern, pinpoints the appropriate hospital department, and recommends verified doctors available at WeCare Hospital.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <span className="bg-white/15 px-3 py-1 rounded-full">✓ ENT & Sore Throat</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">✓ Headaches & Dizziness</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">✓ Skin Rash & Allergies</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">✓ Joint & Back Pain</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                to="/ai-assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-sky-950 bg-white hover:bg-sky-50 shadow-xl shadow-sky-950/30 hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2.5 text-sky-600" />
                Ask AI Assistant Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Centers of Excellence
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Explore Our Medical Departments
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Specialized clinical care backed by multidisciplinary medical teams and modern diagnostic technologies.
            </p>
          </div>
          <Link
            to="/departments"
            className="inline-flex items-center text-sm font-bold text-sky-600 hover:text-sky-700 group"
          >
            View All Departments
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.departmentId} department={dept} />
            ))}
          </div>
        )}
      </section>

      {/* DOCTORS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Renowned Medical Staff
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Meet Our Specialist Doctors
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Consult with internationally trained doctors offering individualized treatment plans and empathetic care.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center text-sm font-bold text-sky-600 hover:text-sky-700 group"
          >
            Browse All Doctors
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <DoctorCard key={doc.doctorId} doctor={doc} />
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE WECARE */}
      <section className="bg-slate-900 text-white py-16 -mx-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Clinical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Why Patients Trust WeCare Hospital
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Combining evidence-based clinical practices with cutting-edge patient care systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Global Accreditations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Certified by the Joint Commission International (JCI) for meeting the highest standards in patient safety and quality.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Advanced Technologies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Equipped with 3T MRI, robotic-assisted surgical theaters, high-definition digital cath labs, and hybrid ICU rooms.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">AI Health Assistant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant preliminary department and doctor recommendations to guide you accurately before booking.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Patient-First Care</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated patient relationship coordinators, zero-wait OPD scheduling, and transparent treatment consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PATIENT CARE INFO & APPOINTMENT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-50 rounded-3xl p-8 sm:p-12 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Seamless Patient Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ready to schedule your appointment?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Book your visit in under 60 seconds. Receive your official booking ID, verify your slot, and track real-time status updates anytime.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/book-appointment"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md transition-all text-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Link>
            <Link
              to="/track-booking"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all text-center"
            >
              Track Existing Booking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
