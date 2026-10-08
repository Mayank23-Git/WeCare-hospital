import React, { useEffect, useState } from 'react';
import { Search, Building, Sparkles } from 'lucide-react';
import api from '../services/api';
import DepartmentCard from '../components/DepartmentCard';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await api.getDepartments();
        if (res.success) {
          setDepartments(res.data);
        } else {
          setError('Unable to load departments. Please refresh.');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to connect to the hospital service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      d.specialization.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
          <Building className="w-3.5 h-3.5" />
          <span>Comprehensive Medical Specializations</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Clinical Departments
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Our specialized clinical institutes bring together leading medical minds, state-of-the-art diagnostic equipment, and tailored treatment plans for every patient.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments by name or health concern..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center">
          <p className="font-semibold">{error}</p>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 p-12 rounded-3xl text-center max-w-lg mx-auto">
          <p className="text-slate-600 font-medium">No departments matched "{searchTerm}".</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 text-sm font-semibold text-sky-600 hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <DepartmentCard key={dept.departmentId} department={dept} />
          ))}
        </div>
      )}
    </div>
  );
}
