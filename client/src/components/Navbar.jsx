import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Briefcase,
  LayoutDashboard,
  KanbanSquare,
  FileText,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Layers,
  Send,
  Building2,
} from 'lucide-react';

const Navbar = () => {
  const { user, role, isRecruiter, isCandidate, isAuthenticated, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickDemoSwitch = async (email) => {
    try {
      await login(email, 'password123');
      setDemoDropdownOpen(false);
      navigate(email.includes('recruiter') ? '/recruiter-dashboard' : '/candidate-dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-[#DFE6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#EDF2F0] border border-[#DFE6E2] flex items-center justify-center p-0.5 group-hover:border-[#CFD9D3] transition-colors">
                <Sparkles className="w-5 h-5 text-[#315B52] group-hover:rotate-12 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-[#202925] flex items-center gap-1.5">
                  AI Recruit <span className="text-[#315B52] font-extrabold">PRO</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#7A8781]">
                  Intelligent Hiring Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                {isRecruiter ? (
                  <>
                    <Link
                      to="/recruiter-dashboard"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/recruiter-dashboard')
                          ? 'bg-[#EDF2F0] text-[#315B52] font-semibold border border-[#CFD9D3]'
                          : 'text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/jobs"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/jobs')
                          ? 'bg-[#EDF2F0] text-[#315B52] font-semibold border border-[#CFD9D3]'
                          : 'text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Job Postings
                    </Link>
                    <Link
                      to="/pipeline"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/pipeline')
                          ? 'bg-[#EDF2F0] text-[#315B52] font-semibold border border-[#CFD9D3]'
                          : 'text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]'
                      }`}
                    >
                      <KanbanSquare className="w-4 h-4" />
                      Pipeline (Kanban)
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/candidate-dashboard"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/candidate-dashboard')
                          ? 'bg-[#EDF2F0] text-[#315B52] font-semibold border border-[#CFD9D3]'
                          : 'text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/jobs"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/jobs')
                          ? 'bg-[#EDF2F0] text-[#315B52] font-semibold border border-[#CFD9D3]'
                          : 'text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Explore Jobs
                    </Link>
                    <Link
                      to="/resume-upload"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/resume-upload')
                          ? 'bg-[#EDF2F0] text-[#315B52] font-semibold border border-[#CFD9D3]'
                          : 'text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      AI Resume Analyzer
                    </Link>
                    <Link
                      to="/my-applications"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/my-applications')
                          ? 'bg-[#EDF2F0] text-[#315B52] font-semibold border border-[#CFD9D3]'
                          : 'text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      My Applications
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Actions & User Pill */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#596760] bg-white hover:text-[#202925] hover:bg-[#EDF2F0] border border-[#DFE6E2] rounded-xl transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-[#315B52]" />
                <span>Switch Demo User</span>
                <ChevronDown className="w-3 h-3 text-[#7A8781]" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#DFE6E2] p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8781] px-2 py-1">
                    Recruiter Accounts
                  </div>
                  <button
                    onClick={() => handleQuickDemoSwitch('recruiter@airecruit.pro')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#202925] hover:bg-[#EDF2F0] hover:text-[#315B52] rounded-lg flex items-center justify-between"
                  >
                    <span>Sarah (Head of Talent)</span>
                    <span className="text-[10px] text-[#315B52] font-semibold">Recruiter</span>
                  </button>
                  <button
                    onClick={() => handleQuickDemoSwitch('recruiter2@airecruit.pro')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#202925] hover:bg-[#EDF2F0] hover:text-[#315B52] rounded-lg flex items-center justify-between"
                  >
                    <span>Marcus (Tech Recruiter)</span>
                    <span className="text-[10px] text-[#315B52] font-semibold">Recruiter</span>
                  </button>

                  <div className="border-t border-[#E8EDEA] my-1.5" />
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8781] px-2 py-1">
                    Candidate Accounts
                  </div>
                  <button
                    onClick={() => handleQuickDemoSwitch('alex.dev@example.com')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#202925] hover:bg-[#EDF2F0] hover:text-[#315B52] rounded-lg flex items-center justify-between"
                  >
                    <span>Alex (Senior Full-Stack)</span>
                    <span className="text-[10px] text-[#52796F] font-semibold">Candidate</span>
                  </button>
                  <button
                    onClick={() => handleQuickDemoSwitch('sarah.data@example.com')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#202925] hover:bg-[#EDF2F0] hover:text-[#315B52] rounded-lg flex items-center justify-between"
                  >
                    <span>Sarah (AI/ML Engineer, PhD)</span>
                    <span className="text-[10px] text-[#52796F] font-semibold">Candidate</span>
                  </button>
                  <button
                    onClick={() => handleQuickDemoSwitch('david.cloud@example.com')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#202925] hover:bg-[#EDF2F0] hover:text-[#315B52] rounded-lg flex items-center justify-between"
                  >
                    <span>David (DevOps Architect)</span>
                    <span className="text-[10px] text-[#52796F] font-semibold">Candidate</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-[#DFE6E2]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#315B52] flex items-center justify-center text-white text-xs font-bold">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#202925] leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#52796F]">
                      {role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-[#7A8781] hover:text-[#B54747] rounded-xl hover:bg-[#FBECEC] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#596760] hover:text-[#202925] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#596760] hover:text-[#202925] rounded-lg hover:bg-[#EDF2F0]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DFE6E2] px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-[#DFE6E2] flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#202925]">{user?.name}</div>
                  <div className="text-xs text-[#52796F] uppercase font-semibold">{role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-xs text-[#B54747] bg-[#FBECEC] rounded-lg border border-[#B54747]/20"
                >
                  Logout
                </button>
              </div>

              {isRecruiter ? (
                <>
                  <Link
                    to="/recruiter-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]"
                  >
                    Job Postings
                  </Link>
                  <Link
                    to="/pipeline"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]"
                  >
                    Pipeline (Kanban)
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/candidate-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]"
                  >
                    Explore Jobs
                  </Link>
                  <Link
                    to="/resume-upload"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]"
                  >
                    AI Resume Analyzer
                  </Link>
                  <Link
                    to="/my-applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#596760] hover:text-[#202925] hover:bg-[#EDF2F0]"
                  >
                    My Applications
                  </Link>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-center text-sm font-medium text-[#202925] bg-[#EDF2F0] border border-[#DFE6E2] rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-center text-sm font-medium text-white bg-[#315B52] hover:bg-[#26483F] rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
