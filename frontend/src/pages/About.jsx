import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Award,
  ShieldCheck,
  Target,
  Eye,
  Heart,
  Activity,
  CheckCircle,
  Users,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-sky-50 to-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-4">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Excellence in Healthcare Since 2004</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About WeCare Hospital
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Delivering advanced clinical medicine with genuine human compassion. WeCare Hospital is recognized as an international benchmark in patient safety, medical research, and patient-centered healing.
          </p>
        </div>
      </section>

      {/* Hospital Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-sky-600">450+</div>
            <div className="text-xs font-bold uppercase text-slate-400 mt-1">Hospital Beds</div>
            <p className="text-xs text-slate-500 mt-2">Equipped with 90 ICU & critical care units</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">45+</div>
            <div className="text-xs font-bold uppercase text-slate-400 mt-1">Specialists</div>
            <p className="text-xs text-slate-500 mt-2">Board-certified physicians & surgeons</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">120,000+</div>
            <div className="text-xs font-bold uppercase text-slate-400 mt-1">Patients Healed</div>
            <p className="text-xs text-slate-500 mt-2">Annual inpatient & outpatient visits</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600">24/7</div>
            <div className="text-xs font-bold uppercase text-slate-400 mt-1">Trauma Center</div>
            <p className="text-xs text-slate-500 mt-2">Zero-wait emergency resuscitation</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-sky-50/70 rounded-3xl p-8 border border-sky-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-600/20">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To preserve health, alleviate suffering, and provide empathetic, high-caliber healthcare services accessible to every individual. We are committed to clinical transparency, scientific advancement, and continuous medical innovation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-sky-200/60 flex items-center text-xs font-semibold text-sky-800">
              <CheckCircle className="w-4 h-4 mr-2 text-sky-600" />
              Patient-centric medical outcomes
            </div>
          </div>

          {/* Vision */}
          <div className="bg-teal-50/70 rounded-3xl p-8 border border-teal-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-md shadow-teal-600/20">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To be the most trusted healthcare institution in the region, recognized globally for groundbreaking clinical therapies, rapid diagnostics, AI-assisted healthcare pathways, and unforgettable patient compassion.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-teal-200/60 flex items-center text-xs font-semibold text-teal-800">
              <CheckCircle className="w-4 h-4 mr-2 text-teal-600" />
              Pioneering modern medical technology
            </div>
          </div>
        </div>
      </section>

      {/* Patient Care Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Core Guiding Principles
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Our Patient Care Philosophy
            </h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              We believe healthcare is not merely treating symptoms, but honoring human dignity, providing active listening, and collaborating with patients throughout their healing journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Compassionate Healing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Treating every patient like beloved family with dignity, empathy, and active emotional support.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Integrity & Transparency</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uncompromising ethics, transparent treatment pricing, and complete clarity about medical decisions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Innovation & Precision</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continual adoption of state-of-the-art diagnostic algorithms and minimally invasive surgical robotics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Facilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Infrastructure
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Modern Healthcare Facilities
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Engineered from the ground up for infection control, sterile surgical excellence, and comfortable patient recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600"
              alt="Advanced Surgical Theatres"
              className="h-48 w-full object-cover"
            />
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900">Modular Surgical Theaters</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                12 HEPA-filtered laminar airflow operating rooms equipped with robotic surgical consoles and 4K laparoscopic imaging.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
              alt="Diagnostic Imaging Center"
              className="h-48 w-full object-cover"
            />
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900">3T Digital Imaging & Cath Lab</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-resolution 3.0 Tesla MRI, 256-slice dual-source cardiac CT scanner, and bi-plane coronary angiography suite.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600"
              alt="Intensive Care Unit"
              className="h-48 w-full object-cover"
            />
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900">Critical Care & Trauma ICU</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Round-the-clock intensivist coverage with automated hemodynamic monitoring and negative-pressure isolation suites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto">
            Experience Personalized Healthcare with WeCare Hospital
          </h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Our outpatient departments and specialist clinics are ready to welcome you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-appointment"
              className="inline-flex items-center px-6 py-3.5 rounded-xl text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Link>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ask AI Doctor Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
