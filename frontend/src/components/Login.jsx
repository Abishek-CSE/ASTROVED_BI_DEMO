import React, { useState } from 'react';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@astroved.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);
      setIsLoading(false);
      onLogin(response.user, response.permissions);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Invalid email or password. Please use default credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 overflow-hidden">
      {/* Decorative Light Radial Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#6868f9]/5 blur-[120px] pointer-events-none" />

      {/* Main Login Panel Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_0_30px_rgba(104,104,249,0.03)] mx-4 flex flex-col items-center">
        {/* AstroVed Official CDN Logo */}
        <div className="flex flex-col items-center mb-5">
          <img 
            src="https://cdn.astroved.com/images/images-av/AstroVed-Logo.svg" 
            alt="AstroVed Logo" 
            className="h-10 object-contain"
          />
          <h2 className="text-base font-black text-slate-800 tracking-tight mt-3">Business Intelligence</h2>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Enterprise Analytics Network</p>
        </div>

        {error && (
          <div className="w-full p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4 text-xs">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={14} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-[#6868f9] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                placeholder="name@astroved.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={14} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-[#6868f9] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-colors font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#6868f9] hover:bg-[#5252e6] text-white font-bold flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 shadow-md shadow-[#6868f9]/15"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <span>Access BI Dashboard</span>
            )}
          </button>
        </form>

        {/* Credentials Tip */}
        <div className="mt-6 text-[10px] text-slate-500 border border-slate-100 bg-slate-50 p-2.5 rounded-xl w-full text-center">
          <span className="font-bold block text-slate-400">Default Demo Credentials:</span>
          <span className="font-mono mt-0.5 block">admin@astroved.com / admin123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
