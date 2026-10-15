import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(data.user.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setLoading(true);

    try {
      const data = await login(demoEmail, 'password123');
      navigate(demoRole === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-white border border-[#DFE6E2] p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2] mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#202925]">Welcome Back</h1>
            <p className="text-xs text-[#596760] mt-1">
              Sign in to your <span className="text-[#315B52] font-semibold">AI Recruit Pro</span> account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#FBECEC] border border-[#B54747]/30 text-[#B54747] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A8781] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A8781] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-[#DFE6E2]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8781] text-center mb-3">
              ⚡ 1-Click Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('recruiter@airecruit.pro', 'recruiter')}
                className="p-2.5 rounded-xl bg-[#EDF2F0] hover:bg-[#DFE6E2] text-[#315B52] border border-[#CFD9D3] text-xs font-medium text-left transition-colors"
              >
                <div className="font-bold text-[#202925] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#315B52]" /> Recruiter
                </div>
                <div className="text-[10px] text-[#7A8781] truncate">Sarah Jenkins</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('alex.dev@example.com', 'candidate')}
                className="p-2.5 rounded-xl bg-[#EDF2F0] hover:bg-[#DFE6E2] text-[#315B52] border border-[#CFD9D3] text-xs font-medium text-left transition-colors"
              >
                <div className="font-bold text-[#202925] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#315B52]" /> Candidate
                </div>
                <div className="text-[10px] text-[#7A8781] truncate">Alex (Full-Stack)</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('sarah.data@example.com', 'candidate')}
                className="p-2 rounded-xl bg-[#EAF1F7] hover:bg-[#DFE6E2] text-[#426D8A] border border-[#CFD9D3] text-xs font-medium text-left transition-colors"
              >
                <div className="font-bold text-[#202925] text-[11px]">Sarah Lin (PhD)</div>
                <div className="text-[10px] text-[#7A8781]">AI / ML Lead</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('david.cloud@example.com', 'candidate')}
                className="p-2 rounded-xl bg-[#E8F3EC] hover:bg-[#DFE6E2] text-[#34765B] border border-[#CFD9D3] text-xs font-medium text-left transition-colors"
              >
                <div className="font-bold text-[#202925] text-[11px]">David Miller</div>
                <div className="text-[10px] text-[#7A8781]">DevOps / Cloud</div>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-[#7A8781]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#315B52] hover:text-[#26483F] font-semibold underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
