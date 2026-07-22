import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('employee@ashoka.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      
      const role = res.data.user.role;
      if (role === 'HR') {
        navigate('/hr-insights');
      } else if (role === 'MANAGER') {
        navigate('/team');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#E8E1DC 1px, transparent 1px), linear-gradient(90deg, #E8E1DC 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      ></div>

      {/* Decorative Lines */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30">
        <div className="w-32 h-[1px] bg-sowaka-primary"></div>
        <div className="w-24 h-[1px] bg-sowaka-primary"></div>
        <div className="w-32 h-[1px] bg-sowaka-primary"></div>
      </div>
      
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30 items-end">
        <div className="w-32 h-[1px] bg-sowaka-primary"></div>
        <div className="w-24 h-[1px] bg-sowaka-primary"></div>
        <div className="w-32 h-[1px] bg-sowaka-primary"></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center px-4">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center text-sowaka-primary text-3xl font-serif font-bold tracking-tight gap-2">
            Sowaka
          </div>
          <div className="w-8 h-[2px] bg-sowaka-primary mt-2"></div>
        </div>

        {/* Card */}
        <div className="bg-white w-full rounded-[4px] shadow-sm border border-sowaka-border p-10 py-12 text-center">
          <h1 className="font-serif text-2xl font-semibold text-sowaka-text mb-2">Welcome Back</h1>
          <p className="text-sowaka-textMuted text-sm mb-10">
            Access your performance evaluations<br/>and team feedback.
          </p>

          <form onSubmit={handleLogin} className="text-left flex flex-col gap-6">
            {error && <div className="p-3 bg-[#FDECEC] text-[#C04C4C] rounded text-sm text-center">{error}</div>}
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-sowaka-textMuted tracking-wider uppercase">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full border-b border-sowaka-border pb-2 outline-none text-sm text-sowaka-text placeholder-gray-300 focus:border-sowaka-primary transition-colors bg-transparent border-t-0 border-l-0 border-r-0 ring-0 focus:ring-0 px-0"
                  required
                />
                <Mail size={18} className="absolute right-0 top-0 text-sowaka-textMuted" />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-sowaka-textMuted tracking-wider uppercase">Password</label>
                <a href="#" className="text-[11px] font-semibold text-sowaka-primary hover:text-sowaka-primaryHover">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full border-b border-sowaka-border pb-2 outline-none text-sm text-sowaka-text placeholder-gray-300 focus:border-sowaka-primary transition-colors bg-transparent border-t-0 border-l-0 border-r-0 ring-0 focus:ring-0 px-0"
                  required
                />
                <button 
                  type="button" 
                  className="absolute right-0 top-0 text-sowaka-textMuted hover:text-sowaka-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded-sm border-gray-300 text-sowaka-primary focus:ring-sowaka-primary accent-sowaka-primary bg-transparent"
              />
              <label htmlFor="remember" className="text-xs text-sowaka-textMuted">Remember this device for 30 days</label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-sowaka-primary hover:bg-sowaka-primaryHover text-white py-3 mt-4 rounded text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'} {!loading && <span className="text-lg leading-none">&rarr;</span>}
            </button>
          </form>

          <div className="w-full h-[1px] bg-sowaka-border my-8"></div>

          <p className="text-xs text-sowaka-textMuted">
            Don't have an account? <a href="#" className="font-semibold text-sowaka-primary hover:underline">Request access</a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-[#D2C5BB] uppercase tracking-wider">
          <Lock size={14} />
          <span>Secure enterprise authentication powered by Sowaka</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
