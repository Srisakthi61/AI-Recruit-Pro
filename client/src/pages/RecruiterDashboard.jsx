import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, jobsAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Users,
  UserCheck,
  Calendar,
  Sparkles,
  Plus,
  KanbanSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
  MoreVertical,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import JobFormModal from '../components/JobFormModal';
import CandidateDetailModal from '../components/CandidateDetailModal';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState(null);
  const [selectedMatchAnalysis, setSelectedMatchAnalysis] = useState(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        statsAPI.getRecruiterStats(),
        jobsAPI.getMyJobs(),
      ]);

      if (statsRes.data.success) {
        setStatsData(statsRes.data);
      }
      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching recruiter stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveJob = async (jobData) => {
    try {
      setIsSubmittingJob(true);
      if (editingJob) {
        await jobsAPI.updateJob(editingJob._id, jobData);
      } else {
        await jobsAPI.createJob(jobData);
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
      fetchDashboardData();
    } catch (err) {
      console.error('Error saving job:', err);
      alert(err.response?.data?.message || 'Error saving job.');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleScheduleInterview = async (interviewDetails) => {
    if (!selectedApplicationId) return;
    try {
      await applicationAPI.scheduleInterview(selectedApplicationId, interviewDetails);
      setIsInterviewModalOpen(false);
      fetchDashboardData();
      alert('Interview scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling interview:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#315B52] animate-spin" />
        <p className="text-sm text-[#7A8781]">Loading recruiter intelligence dashboard...</p>
      </div>
    );
  }

  const stats = statsData?.stats || {
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0,
    avgMatchScore: 0,
    stageDistribution: {},
  };

  const recentApplications = statsData?.recentApplications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DFE6E2]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202925]">
              Talent Hub & AI Screener
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
              Recruiter Mode
            </span>
          </div>
          <p className="mt-1 text-sm text-[#596760]">
            Welcome back, <strong className="text-[#202925]">{user?.name}</strong> at{' '}
            <strong className="text-[#315B52]">{user?.company || 'CloudScale Tech'}</strong>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingJob(null);
              setIsJobModalOpen(true);
            }}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </button>
          <Link
            to="/pipeline"
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#315B52] bg-white hover:bg-[#EDF2F0] border border-[#DFE6E2] rounded-xl transition-all flex items-center gap-2"
          >
            <KanbanSquare className="w-4 h-4 text-[#315B52]" />
            Open Kanban Board
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Active Jobs */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE6E2]">
          <div className="flex items-center justify-between text-[#7A8781] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Jobs</span>
            <Briefcase className="w-4 h-4 text-[#315B52]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#202925]">
            {stats.activeJobs}
            <span className="text-xs font-normal text-[#7A8781] ml-1">/ {stats.totalJobs}</span>
          </div>
          <div className="text-[11px] text-[#7A8781] mt-1">Accepting applications</div>
        </div>

        {/* Total Applicants */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE6E2]">
          <div className="flex items-center justify-between text-[#7A8781] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Applicants</span>
            <Users className="w-4 h-4 text-[#426D8A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#202925]">
            {stats.totalApplicants}
          </div>
          <div className="text-[11px] text-[#7A8781] mt-1">Across all postings</div>
        </div>

        {/* Shortlisted */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE6E2]">
          <div className="flex items-center justify-between text-[#7A8781] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Shortlisted</span>
            <UserCheck className="w-4 h-4 text-[#34765B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#34765B]">
            {stats.shortlistedCount}
          </div>
          <div className="text-[11px] text-[#7A8781] mt-1">Top match tier</div>
        </div>

        {/* Interviews */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFE6E2]">
          <div className="flex items-center justify-between text-[#7A8781] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Interviews</span>
            <Calendar className="w-4 h-4 text-[#52796F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#52796F]">
            {stats.interviewCount}
          </div>
          <div className="text-[11px] text-[#7A8781] mt-1">Scheduled rounds</div>
        </div>

        {/* Avg Match Score */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#EDF2F0] border border-[#DFE6E2]">
          <div className="flex items-center justify-between text-[#315B52] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Avg Match Fit</span>
            <Sparkles className="w-4 h-4 text-[#315B52]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#315B52]">
            {stats.avgMatchScore}%
          </div>
          <div className="text-[11px] text-[#596760] mt-1">AI weighted score</div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Posted Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202925] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#315B52]" />
              <span>Your Job Postings & Ranking</span>
            </h2>
            <Link to="/jobs" className="text-xs font-medium text-[#315B52] hover:text-[#26483F] flex items-center gap-1">
              View all ({jobs.length}) <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-5 rounded-2xl bg-white border border-[#DFE6E2] hover:border-[#CFD9D3] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#202925] text-base hover:text-[#315B52] transition-colors">
                        {job.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          job.status === 'active'
                            ? 'bg-[#E8F3EC] text-[#34765B] border border-[#34765B]/25'
                            : 'bg-[#EDF2F0] text-[#7A8781]'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A8781]">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.minExperience}+ yrs exp</span>
                    </div>

                    {/* Required Skills Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.requiredSkills.slice(0, 4).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EDF2F0] text-[#596760] border border-[#DFE6E2]"
                        >
                          {s}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="text-[10px] text-[#7A8781] self-center">
                          +{job.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Applicant Counter */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DFE6E2]">
                    <Link
                      to={`/matching/job/${job._id}`}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Rank Candidates ({job.applicantsCount || 0})</span>
                    </Link>

                    <Link
                      to={`/pipeline?jobId=${job._id}`}
                      title="Open in Pipeline Kanban"
                      className="p-2 rounded-xl text-[#596760] hover:text-[#202925] bg-white hover:bg-[#EDF2F0] border border-[#DFE6E2]"
                    >
                      <KanbanSquare className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-[#DFE6E2] text-center text-[#7A8781]">
                <Briefcase className="w-8 h-8 text-[#7A8781] mx-auto mb-2" />
                <p className="text-sm">No job postings yet. Create your first listing!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Recent Applications Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202925] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#315B52]" />
              <span>Recent Applicant Stream</span>
            </h2>
          </div>

          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-2xl bg-white border border-[#DFE6E2] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-[#202925] text-sm">
                        {app.candidate?.name || app.candidateProfile?.parsedData?.name || 'Applicant'}
                      </h4>
                      <p className="text-xs text-[#315B52] font-medium">
                        {app.job?.title}
                      </p>
                    </div>
                    <MatchScoreBadge score={app.matchAnalysis?.overallScore || 0} size="sm" />
                  </div>

                  {/* Stage & Details */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8EDEA]">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EDF2F0] text-[#596760] border border-[#DFE6E2]">
                      {app.stage}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedCandidateProfile(app.candidateProfile);
                        setSelectedMatchAnalysis(app.matchAnalysis);
                        setSelectedCandidateName(app.candidate?.name || 'Candidate');
                        setSelectedJobTitle(app.job?.title || 'Position');
                        setSelectedApplicationId(app._id);
                        setIsCandidateModalOpen(true);
                      }}
                      className="text-[#315B52] hover:text-[#26483F] font-medium text-xs flex items-center gap-1"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-[#DFE6E2] text-center text-[#7A8781] text-xs">
                No recent applicants yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <JobFormModal
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleSaveJob}
        initialJob={editingJob}
        isSubmitting={isSubmittingJob}
      />

      <CandidateDetailModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        candidateProfile={selectedCandidateProfile}
        matchAnalysis={selectedMatchAnalysis}
        onOpenScheduleInterview={() => {
          setIsCandidateModalOpen(false);
          setIsInterviewModalOpen(true);
        }}
        onOpenScoreBreakdown={() => {
          setIsCandidateModalOpen(false);
          setIsBreakdownModalOpen(true);
        }}
      />

      <ScoreBreakdownModal
        isOpen={isBreakdownModalOpen}
        onClose={() => setIsBreakdownModalOpen(false)}
        candidateName={selectedCandidateName}
        jobTitle={selectedJobTitle}
        matchAnalysis={selectedMatchAnalysis}
      />

      <ScheduleInterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSubmit={handleScheduleInterview}
        candidateName={selectedCandidateName}
      />
    </div>
  );
};

export default RecruiterDashboard;
