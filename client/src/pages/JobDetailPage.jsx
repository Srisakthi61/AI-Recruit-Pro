import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI, matchingAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  KanbanSquare,
  Users,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import confetti from 'canvas-confetti';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isRecruiter, isCandidate, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await jobsAPI.getJobById(id);
        if (res.data.success) {
          setJob(res.data.data);
        }

        if (isCandidate) {
          const [matchRes, appsRes] = await Promise.all([
            matchingAPI.evaluateCandidateForJob(id).catch(() => null),
            applicationAPI.getMyApplications().catch(() => null),
          ]);

          if (matchRes?.data?.success) {
            setMatchAnalysis(matchRes.data.matchAnalysis);
          }

          if (appsRes?.data?.success) {
            const isAlreadyApplied = appsRes.data.data.some((a) => a.job?._id === id || a.job === id);
            setHasApplied(isAlreadyApplied);
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, isCandidate]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      const res = await applicationAPI.applyToJob(id);
      if (res.data.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
        setHasApplied(true);
        alert('Application submitted successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#315B52] animate-spin" />
        <p className="text-sm text-[#596760]">Loading role specifications...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-[#202925] mb-2">Job posting not found</h2>
        <Link to="/jobs" className="text-sm text-[#315B52] underline">
          ← Return to job board
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A8781] hover:text-[#202925] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      {/* Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DFE6E2] space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#315B52] flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {job.company} • {job.department}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202925] mt-1">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A8781] mt-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#7A8781]" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#7A8781]" />
                {job.type}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-[#7A8781]" />
                {job.minExperience}+ years experience ({job.educationRequirement} degree)
              </span>
            </div>
          </div>

          {/* Action on Header */}
          <div className="flex items-center gap-3">
            {isRecruiter ? (
              <div className="flex items-center gap-2">
                <Link
                  to={`/matching/job/${job._id}`}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Rank Candidates ({job.applicantsCount || 0})
                </Link>
                <Link
                  to={`/pipeline?jobId=${job._id}`}
                  className="px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#315B52] bg-[#EDF2F0] hover:bg-[#DFE6E2] rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <KanbanSquare className="w-4 h-4" />
                  Pipeline
                </Link>
              </div>
            ) : (
              <div>
                {hasApplied ? (
                  <div className="px-5 py-2.5 rounded-xl bg-[#E8F3EC] text-[#34765B] border border-[#34765B]/20 text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Applied
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="px-6 py-3 text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : '1-Click Apply Now'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Salary & Fast Badges */}
        <div className="pt-4 border-t border-[#E8EDEA] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#7A8781]">Compensation:</span>
            <span className="text-[#34765B] font-bold text-sm">
              {job.salaryMin > 0 && job.salaryMax > 0
                ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} / year`
                : 'Competitive Salary + Equity'}
            </span>
          </div>
          <div className="text-[#7A8781]">
            Posted by <span className="text-[#202925]">{job.recruiter?.name || 'Recruiter'}</span>
          </div>
        </div>
      </div>

      {/* Candidate AI Compatibility Card (If Candidate) */}
      {isCandidate && matchAnalysis && (
        <div className="p-6 rounded-2xl bg-white border border-[#DFE6E2] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MatchScoreBadge score={matchAnalysis.overallScore} size="lg" showRecommendation={true} recommendation={matchAnalysis.recommendation} />
              <div className="text-xs text-[#596760]">
                <span className="font-semibold text-[#202925]">Your AI Profile Compatibility</span>
                <p className="text-[#7A8781]">{matchAnalysis.aiSummary}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E8EDEA] text-xs">
            <div>
              <span className="text-[#34765B] font-semibold block mb-1">
                ✓ Matched Skills ({matchAnalysis.matchedSkills?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {(matchAnalysis.matchedSkills || []).map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#E8F3EC] text-[#34765B] border border-[#34765B]/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {matchAnalysis.missingSkills?.length > 0 && (
              <div>
                <span className="text-[#B54747] font-semibold block mb-1">
                  ✗ Missing Skills ({matchAnalysis.missingSkills.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {matchAnalysis.missingSkills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#FBECEC] text-[#B54747] border border-[#B54747]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Description */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DFE6E2] space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#202925] mb-3">About the Role</h2>
          <div className="text-sm text-[#596760] leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#202925] mb-2.5">
            Required Technical Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Optional Skills */}
        {job.optionalSkills && job.optionalSkills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#202925] mb-2.5">
              Nice to Have Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.optionalSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F5F7F6] text-[#7A8781] border border-[#DFE6E2]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
