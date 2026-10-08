import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Stethoscope, Sparkles } from 'lucide-react';
import api from '../services/api';
import DoctorCard from '../components/DoctorCard';

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDept = searchParams.get('department') || 'all';

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.getDepartments();
        if (res.success) {
          setDepartments(res.data);
        }
      } catch (err) {
        console.error('Failed to load departments list:', err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await api.getDoctors({
          department: selectedDept,
          search: searchTerm,
        });
        if (res.success) {
          setDoctors(res.data);
        } else {
          setError('Unable to load doctors.');
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
        setError('Failed to connect to the hospital service.');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchDoctors, 250);
    return () => clearTimeout(debounce);
  }, [selectedDept, searchTerm]);

  const handleDeptChange = (deptId) => {
    setSelectedDept(deptId);
    if (deptId === 'all') {
      searchParams.delete('department');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ department: deptId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Multidisciplinary Medical Faculty</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Find Your Doctor
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Search and book consultations with our board-certified medical specialists. Filter by clinical department or search by name.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors by name, specialty, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900"
          />
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => handleDeptChange('all')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedDept === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Departments
          </button>
          {departments.map((d) => (
            <button
              key={d.departmentId}
              onClick={() => handleDeptChange(d.departmentId)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedDept === d.departmentId
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 px-1">
        <span>Showing {doctors.length} Doctors</span>
        {selectedDept !== 'all' && (
          <button
            onClick={() => handleDeptChange('all')}
            className="text-sky-600 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center">
          <p className="font-semibold">{error}</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 p-12 rounded-3xl text-center max-w-lg mx-auto space-y-3">
          <p className="text-slate-700 font-medium">No doctors found matching your criteria.</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms or select "All Departments".
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              handleDeptChange('all');
            }}
            className="mt-2 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700"
          >
            Show All Doctors
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <DoctorCard key={doc.doctorId} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
