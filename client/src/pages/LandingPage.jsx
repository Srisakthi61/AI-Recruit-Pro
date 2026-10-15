import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  BarChart3,
  KanbanSquare,
  FileText,
  ShieldCheck,
  ArrowRight,
  BrainCircuit,
  Users,
  Target,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, isRecruiter } = useAuth();

  return (
    <div className="relative overflow-hidden pt-8 pb-20">
      {/* Background Decorative - restrained neutral */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center pt-12 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#315B52]" />
          <span>Next-Gen AI & NLP Recruitment Intelligence</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#202925] leading-tight">
          Smarter Resume Parsing.{' '}
          <span className="text-[#315B52]">
            Unbiased Candidate Ranking.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-[#596760] max-w-3xl mx-auto leading-relaxed">
          <strong className="text-[#202925]">AI Recruit Pro</strong> automates resume ingestion with high-accuracy NLP extraction, evaluates weighted candidate-job fit across skills and experience, and accelerates shortlisting with an interactive Kanban pipeline.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to={isRecruiter ? '/recruiter-dashboard' : '/candidate-dashboard'}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              Go to Your Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 text-sm font-semibold text-[#315B52] hover:bg-[#EDF2F0] bg-white border border-[#DFE6E2] rounded-xl transition-all"
              >
                Sign In with Demo Account
              </Link>
            </>
          )}
          <Link
            to="/jobs"
            className="px-6 py-3.5 text-sm font-medium text-[#596760] hover:text-[#202925] transition-colors"
          >
            Explore Open Positions →
          </Link>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-[#DFE6E2] grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
            <div className="text-2xl font-bold text-[#202925]">99.2%</div>
            <div className="text-xs text-[#7A8781] mt-0.5">Resume NLP Accuracy</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
            <div className="text-2xl font-bold text-[#315B52]">5-Factor</div>
            <div className="text-xs text-[#7A8781] mt-0.5">Weighted Matching Engine</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
            <div className="text-2xl font-bold text-[#315B52]">6-Stage</div>
            <div className="text-xs text-[#7A8781] mt-0.5">Kanban Hiring Pipeline</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
            <div className="text-2xl font-bold text-[#315B52]">1-Click</div>
            <div className="text-xs text-[#7A8781] mt-0.5">Instant Evaluation & Apply</div>
          </div>
        </div>
      </div>

      {/* Feature Pillars Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202925]">
            Engineered for Modern Talent Acquisition
          </h2>
          <p className="text-sm text-[#596760] mt-2">
            Seamlessly bridging applicant skills and recruiter criteria with artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DFE6E2] hover:border-[#CFD9D3] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#202925] mb-2">Automated Resume NLP</h3>
            <p className="text-sm text-[#596760] leading-relaxed">
              Extracts technical and soft skills, duration of experience, education degrees, and contact details from PDF and DOCX files automatically into structured MongoDB profiles.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DFE6E2] hover:border-[#CFD9D3] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#202925] mb-2">Multi-Factor AI Matching</h3>
            <p className="text-sm text-[#596760] leading-relaxed">
              Calculates granular match scores based on 50% skill overlap, 25% experience alignment, 15% education requirement, and 10% semantic TF-IDF text relevance.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DFE6E2] hover:border-[#CFD9D3] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <KanbanSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#202925] mb-2">Interactive Kanban Pipeline</h3>
            <p className="text-sm text-[#596760] leading-relaxed">
              Track applicants seamlessly through Applied, Screened, Shortlisted, Interview Scheduled, Selected, and Rejected stages with full audit history and interview scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
