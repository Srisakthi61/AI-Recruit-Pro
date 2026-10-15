import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, Building2, Phone, Briefcase, AlertCircle, ArrowRight, Check } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await register({
        name,
        email,
        password,
        role,
        company: role === 'recruiter' ? company : '',
        title,
        phone,
      });

      navigate(role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl bg-white border border-[#DFE6E2] p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2] mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#202925]">Create Your Account</h1>
            <p className="text-xs text-[#596760] mt-1">
              Join <span className="text-[#315B52] font-semibold">AI Recruit Pro</span> today
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="mb-6 p-1.5 rounded-xl bg-[#EDF2F0] border border-[#DFE6E2] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'candidate'
                  ? 'bg-[#315B52] text-white shadow-sm'
                  : 'text-[#596760] hover:text-[#202925]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>I am a Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'recruiter'
                  ? 'bg-[#315B52] text-white shadow-sm'
                  : 'text-[#596760] hover:text-[#202925]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>I am a Recruiter</span>
            </button>
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
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7A8781] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A8781] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Password * (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A8781] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                />
              </div>
            </div>

            {/* Recruiter extra fields */}
            {role === 'recruiter' && (
              <div>
                <label className="block text-xs font-semibold text-[#596760] mb-1">
                  Company / Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#7A8781] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="CloudScale Technologies"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#596760] mb-1">
                  Job Title / Headline
                </label>
                <input
                  type="text"
                  placeholder={role === 'recruiter' ? 'Head of Talent' : 'Senior Full Stack Engineer'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#596760] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-[#7A8781]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#315B52] hover:text-[#26483F] font-semibold underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
