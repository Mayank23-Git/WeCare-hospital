import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  HeartPulse,
} from 'lucide-react';
import api from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('AdminPassword123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await api.adminLogin({ username, password });
      if (res.success && res.token) {
        localStorage.setItem('wecare_admin_token', res.token);
        localStorage.setItem('wecare_admin_user', JSON.stringify(res.admin));
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Hospital Admin Portal
          </h2>
          <p className="text-xs text-slate-500">
            Sign in with authorized staff credentials to manage patient bookings.
          </p>
        </div>

        {/* Demo Hint Banner */}
        <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-3.5 text-xs text-sky-900">
          <div className="font-bold flex items-center mb-1">
            <HeartPulse className="w-3.5 h-3.5 mr-1 text-sky-600" />
            Default Staff Credentials:
          </div>
          <div className="font-mono text-[11px] space-y-0.5">
            <div>Username: <strong className="text-slate-900">admin</strong></div>
            <div>Password: <strong className="text-slate-900">AdminPassword123!</strong></div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 shadow-md shadow-sky-600/25 transition-all flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center">
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-500 hover:text-sky-600">
            ← Return to WeCare Hospital Website
          </Link>
        </div>
      </div>
    </div>
  );
}
