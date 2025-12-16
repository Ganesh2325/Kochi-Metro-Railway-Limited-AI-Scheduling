import React, { useState } from 'react';
import { AuthService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) err.email = 'Valid email required';
    if (form.password.length < 6) err.password = 'Password must be at least 6 characters';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await AuthService.register(form);
      navigate('/login');  // GO TO LOGIN AFTER SIGNUP
    } catch (err) {
      const msg = err?.response?.data?.message || 'Signup failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-slate-200 p-8 space-y-6">

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-teal-100 text-teal-700">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500">Sign up to access the dashboard.</p>
          </div>
        </div>

        {serverError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
              <User size={16} className="text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center">
          Already have an account? <Link to="/login" className="text-teal-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
