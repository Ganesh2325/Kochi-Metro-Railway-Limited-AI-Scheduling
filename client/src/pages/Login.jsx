import React, { useState } from 'react';
import { AuthService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const err = {};
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
      const { data } = await AuthService.login(form);

      localStorage.setItem('kmrl_token', data.token);
      localStorage.setItem('kmrl_user', JSON.stringify({ name: data.name, email: data.email }));

      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-slate-200 p-8 space-y-6">

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-blue-100 text-blue-700">
            <LogIn size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500">Log in to access the dashboard.</p>
          </div>
        </div>

        {serverError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                placeholder="Your password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center">
          Don't have an account? <Link to="/signup" className="text-teal-600 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
