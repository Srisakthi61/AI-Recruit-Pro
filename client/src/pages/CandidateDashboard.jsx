import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, jobsAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  ChevronRight,
  Upload,
  Layers,
  Award,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import confetti from 'canvas-confetti';

const STAGES_ORDER = ['Applied', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Selected'];

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        statsAPI.getCandidateStats(),
        jobsAPI.getJobs({ limit: 4 }),
      ]);

      if (statsRes.data.success) {
        setStatsData(statsRes.data);
      }
      if (jobsRes.data.success) {
        setRecommendedJobs(jobsRes.data.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching candidate stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      const res = await applicationAPI.applyToJob(jobId);
      if (res.data.success) {
        // Trigger celebration confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        alert('Application submitted successfully! Check your tracker.');
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting application.');
    } finally {
      setApplyingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#315B52] animate-spin" />
        <p className="text-sm text-[#596760]">Loading candidate portal...</p>
      </div>
    );
  }

  const stats = statsData?.stats || {
    totalApplied: 0,
    inReview: 0,
    shortlisted: 0,
    interviews: 0,
    offers: 0,
    hasResume: false,
    resumeSkillsCount: 0,
    totalYearsExperience: 0,
  };

  const applications = statsData?.applications || [];
  const profileSummary = statsData?.profileSummary || null;

  // Find upcoming interview if any
  const upcomingInterviewApp = applications.find(
    (a) => a.stage === 'Interview Scheduled' && a.interviewDetails?.scheduledAt
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DFE6E2]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202925]">
              Candidate Career Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
              Candidate Mode
            </span>
          </div>
          <p className="mt-1 text-sm text-[#596760]">
            Welcome, <strong className="text-[#202925]">{user?.name}</strong> • AI Profile & Job Tracker
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/resume-upload"
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {stats.hasResume ? 'Update / Re-analyze Resume' : 'Upload Resume for AI Match'}
          </Link>
          <Link
            to="/jobs"
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#315B52] bg-white hover:bg-[#EDF2F0] border border-[#DFE6E2] rounded-xl transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-[#315B52]" />
            Explore Jobs
          </Link>
        </div>
      </div>

      {/* Upcoming Interview Alert Box (if scheduled) */}
      {upcomingInterviewApp && (
        <div className="p-5 rounded-2xl bg-[#EAF1F7] border border-[#426D8A]/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white text-[#426D8A] border border-[#DFE6E2]">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#426D8A]">
                  🎉 Upcoming Live Interview Scheduled!
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#426D8A] border border-[#426D8A]/20">
                  {upcomingInterviewApp.interviewDetails.type} Round
                </span>
              </div>
              <h3 className="text-base font-bold text-[#202925] mt-0.5">
                {upcomingInterviewApp.job?.title} at {upcomingInterviewApp.job?.company}
              </h3>
              <p className="text-xs text-[#596760] flex items-center gap-2 mt-1">
                <Calendar className="w-3.5 h-3.5 text-[#426D8A]" />
                <span>{new Date(upcomingInterviewApp.interviewDetails.scheduledAt).toLocaleString()}</span>
                {upcomingInterviewApp.interviewDetails.interviewer && (
                  <span>• Interviewer: {upcomingInterviewApp.interviewDetails.interviewer}</span>
                )}
              </p>
              {upcomingInterviewApp.interviewDetails.notes && (
                <p className="text-xs text-[#7A8781] mt-1 italic">
                  Note: "{upcomingInterviewApp.interviewDetails.notes}"
                </p>
              )}
            </div>
          </div>

          {upcomingInterviewApp.interviewDetails.meetingLink && (
            <a
              href={upcomingInterviewApp.interviewDetails.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              <Video className="w-4 h-4" />
              Join Video Room
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE6E2] shadow-sm">
          <div className="flex items-center justify-between text-[#7A8781] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Applied Roles</span>
            <Briefcase className="w-4 h-4 text-[#315B52]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#202925]">{stats.totalApplied}</div>
          <div className="text-[11px] text-[#7A8781] mt-1">Active submissions</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE6E2] shadow-sm">
          <div className="flex items-center justify-between text-[#7A8781] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>In Screening</span>
            <Clock className="w-4 h-4 text-[#426D8A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#426D8A]">{stats.inReview}</div>
          <div className="text-[11px] text-[#7A8781] mt-1">Under AI evaluation</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE6E2] shadow-sm">
          <div className="flex items-center justify-between text-[#7A8781] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-[#34765B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#34765B]">{stats.shortlisted}</div>
          <div className="text-[11px] text-[#7A8781] mt-1">Top candidate tier</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#315B52] border border-[#315B52] shadow-sm text-white">
          <div className="flex items-center justify-between text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Interviews</span>
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.interviews}</div>
          <div className="text-[11px] text-white/80 mt-1">Live rounds active</div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Application Pipeline Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202925] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#315B52]" />
              <span>Active Application Tracker</span>
            </h2>
            <Link to="/my-applications" className="text-xs font-medium text-[#315B52] hover:text-[#26483F] flex items-center gap-1">
              View full tracker →
            </Link>
          </div>

          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => {
                const currentStageIdx = STAGES_ORDER.indexOf(app.stage);
                return (
                  <div
                    key={app._id}
                    className="p-5 rounded-2xl bg-white border border-[#DFE6E2] space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[#202925] text-base">{app.job?.title}</h3>
                        <p className="text-xs text-[#596760] font-medium">{app.job?.company}</p>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <MatchScoreBadge score={app.matchAnalysis?.overallScore || 0} size="sm" />
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
                          {app.stage}
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="grid grid-cols-5 gap-1.5">
                        {STAGES_ORDER.map((stageName, idx) => {
                          const isDone = currentStageIdx >= idx;
                          const isCurrent = app.stage === stageName;
                          return (
                            <div key={idx} className="flex flex-col gap-1">
                              <div
                                className={`h-1.5 rounded-full transition-all ${
                                  isDone
                                    ? isCurrent
                                      ? 'bg-[#315B52] animate-pulse'
                                      : 'bg-[#52796F]'
                                    : 'bg-[#EDF2F0]'
                                }`}
                              />
                              <span className="text-[10px] text-[#7A8781] text-center truncate hidden sm:block">
                                {stageName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Latest Stage Note */}
                    {app.stageHistory && app.stageHistory.length > 0 && (
                      <div className="text-xs text-[#596760] bg-[#F5F7F6] p-2.5 rounded-lg border border-[#DFE6E2] flex items-center justify-between">
                        <span>Latest Update: "{app.stageHistory[app.stageHistory.length - 1].note || `Stage updated to ${app.stage}`}"</span>
                        <span className="text-[10px] text-[#7A8781] shrink-0 ml-2">
                          {new Date(app.stageHistory[app.stageHistory.length - 1].updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-[#DFE6E2] text-center text-[#596760] shadow-sm">
                <Briefcase className="w-8 h-8 text-[#7A8781] mx-auto mb-2" />
                <p className="text-sm">You haven't submitted any applications yet.</p>
                <Link
                  to="/jobs"
                  className="inline-block mt-3 px-4 py-2 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-colors"
                >
                  Browse Open Positions
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Profile & Recommended Jobs */}
        <div className="space-y-6">
          {/* Parsed Profile Snapshot */}
          <div className="p-5 rounded-2xl bg-white border border-[#DFE6E2] space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#202925] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#315B52]" />
                <span>AI Parsed Resume Profile</span>
              </h3>
              <Link to="/resume-upload" className="text-xs text-[#315B52] hover:text-[#26483F]">
                Edit →
              </Link>
            </div>

            {profileSummary ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#596760]">
                  <span>Total Experience:</span>
                  <strong className="text-[#202925]">{profileSummary.totalYearsExperience || 0} Years</strong>
                </div>
                <div className="flex items-center justify-between text-[#596760]">
                  <span>Education Level:</span>
                  <strong className="text-[#202925]">{profileSummary.highestEducation || 'Bachelor'}</strong>
                </div>

                <div>
                  <span className="text-[#7A8781] block mb-1.5">Key Extracted Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {(profileSummary.skills || []).slice(0, 8).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]"
                      >
                        {s}
                      </span>
                    ))}
                    {(profileSummary.skills || []).length > 8 && (
                      <span className="text-[10px] text-[#7A8781] self-center">
                        +{(profileSummary.skills || []).length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-[#7A8781] mb-3">
                  Upload your resume to automatically extract skills, calculate experience, and view AI compatibility scores.
                </p>
                <Link
                  to="/resume-upload"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-lg inline-block transition-colors"
                >
                  Upload Resume (PDF/DOCX)
                </Link>
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#202925] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#315B52]" />
              <span>Recommended Open Roles</span>
            </h3>

            {recommendedJobs.map((job) => {
              const hasApplied = applications.some((a) => a.job?._id === job._id || a.job === job._id);
              return (
                <div
                  key={job._id}
                  className="p-4 rounded-xl bg-white border border-[#DFE6E2] space-y-2 hover:border-[#315B52]/50 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-[#202925] text-xs hover:text-[#315B52] transition-colors">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h4>
                      <p className="text-[11px] text-[#7A8781]">{job.company} • {job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#7A8781]">{job.minExperience}+ yrs exp</span>

                    {hasApplied ? (
                      <span className="text-[11px] font-semibold text-[#34765B] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={applyingJobId === job._id}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-lg transition-colors disabled:opacity-50"
                      >
                        {applyingJobId === job._id ? 'Applying...' : '1-Click Apply'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
