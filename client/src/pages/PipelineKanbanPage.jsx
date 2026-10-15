import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobsAPI, applicationAPI } from '../services/api';
import {
  KanbanSquare,
  Briefcase,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  ExternalLink,
  Loader2,
  Filter,
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import CandidateDetailModal from '../components/CandidateDetailModal';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';

const KANBAN_STAGES = [
  { id: 'Applied', title: 'Applied', color: 'border-[#DFE6E2] bg-[#EDF2F0] text-[#596760]' },
  { id: 'Screened', title: 'Screened', color: 'border-[#426D8A]/30 bg-[#EAF1F7] text-[#426D8A]' },
  { id: 'Shortlisted', title: 'Shortlisted', color: 'border-[#52796F]/30 bg-[#EDF2F0] text-[#315B52]' },
  { id: 'Interview Scheduled', title: 'Interview', color: 'border-[#315B52]/30 bg-[#EDF2F0] text-[#315B52]' },
  { id: 'Selected', title: 'Selected / Offer', color: 'border-[#34765B]/30 bg-[#E8F3EC] text-[#34765B]' },
  { id: 'Rejected', title: 'Rejected', color: 'border-[#B54747]/30 bg-[#FBECEC] text-[#B54747]' },
];

const PipelineKanbanPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedApp, setSelectedApp] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Fetch all recruiter's jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobsAPI.getMyJobs();
        if (res.data.success) {
          setJobs(res.data.data);
          if (!selectedJobId && res.data.data.length > 0) {
            setSelectedJobId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applications whenever selected job changes
  const fetchApplications = async () => {
    if (!selectedJobId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await applicationAPI.getJobApplications(selectedJobId);
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    if (selectedJobId) {
      setSearchParams({ jobId: selectedJobId });
    }
  }, [selectedJobId]);

  const handleMoveStage = async (appId, targetStage) => {
    try {
      await applicationAPI.updateStage(appId, targetStage);
      fetchApplications();
    } catch (err) {
      console.error('Error moving stage:', err);
    }
  };

  const handleScheduleInterview = async (interviewDetails) => {
    if (!selectedApp) return;
    try {
      await applicationAPI.scheduleInterview(selectedApp._id, interviewDetails);
      setIsInterviewModalOpen(false);
      fetchApplications();
      alert('Interview scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling interview:', err);
    }
  };

  // Filter applications by search
  const filteredApps = applications.filter((app) => {
    const name = app.candidate?.name || app.candidateProfile?.parsedData?.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeJob = jobs.find((j) => j._id === selectedJobId);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DFE6E2]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#202925] flex items-center gap-2">
              <KanbanSquare className="w-6 h-6 text-[#315B52]" />
              <span>Pipeline & Shortlisting Kanban</span>
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#596760]">
            Drag, prioritize, and advance candidates through recruitment stages with automated AI screening scores.
          </p>
        </div>

        {/* Controls: Job Selector & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Job Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#596760] font-semibold">Job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-[#202925] text-xs sm:text-sm font-semibold bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none min-w-[200px]"
            >
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.applicantsCount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A8781] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search applicant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-[#202925] placeholder:text-[#7A8781] bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-xs"
            />
          </div>

          {selectedJobId && (
            <Link
              to={`/matching/job/${selectedJobId}`}
              className="px-3 py-1.5 text-xs font-semibold text-[#315B52] bg-white hover:bg-[#EDF2F0] border border-[#DFE6E2] rounded-xl transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#315B52]" />
              AI Ranking View
            </Link>
          )}
        </div>
      </div>

      {/* Kanban Board Horizontal Columns Container */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#315B52] animate-spin" />
          <p className="text-xs text-[#596760]">Loading pipeline board...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start min-h-[650px] overflow-x-auto pb-4">
          {KANBAN_STAGES.map((col, colIdx) => {
            const stageApps = filteredApps.filter((a) => a.stage === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-[#F5F7F6] border border-[#DFE6E2] p-3 min-w-[250px] max-h-[80vh] overflow-y-auto space-y-3"
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${col.color}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-[#202925] border border-[#DFE6E2]">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1">
                  {stageApps.map((app) => {
                    const match = app.matchAnalysis || {};
                    const parsed = app.candidateProfile?.parsedData || {};
                    const candName = app.candidate?.name || parsed.name || 'Candidate';

                    return (
                      <div
                        key={app._id}
                        className="p-3.5 rounded-xl bg-white border border-[#DFE6E2] hover:border-[#315B52]/50 transition-all space-y-3 shadow-sm group relative"
                      >
                        {/* Top: Name & Match Badge */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-[#202925] text-xs hover:text-[#315B52] transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedApp(app);
                                setIsCandidateModalOpen(true);
                              }}
                            >
                              {candName}
                            </h4>
                            <p className="text-[10px] text-[#7A8781] mt-0.5">
                              {parsed.totalYearsExperience || 0} yrs exp • {parsed.highestEducation || 'Bachelor'}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              setSelectedApp(app);
                              setIsBreakdownModalOpen(true);
                            }}
                            className="cursor-pointer shrink-0"
                          >
                            <MatchScoreBadge score={match.overallScore || 0} size="sm" />
                          </div>
                        </div>

                        {/* Matched Skills Tags */}
                        {match.matchedSkills && match.matchedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {match.matchedSkills.slice(0, 3).map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#E8F3EC] text-[#34765B] border border-[#34765B]/20"
                              >
                                {s}
                              </span>
                            ))}
                            {match.matchedSkills.length > 3 && (
                              <span className="text-[9px] text-[#7A8781] self-center">
                                +{match.matchedSkills.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Interview info if scheduled */}
                        {app.interviewDetails?.scheduledAt && (
                          <div className="text-[10px] text-[#315B52] bg-[#EDF2F0] p-1.5 rounded-lg border border-[#DFE6E2] flex items-center justify-between">
                            <span className="flex items-center gap-1 truncate">
                              <Calendar className="w-3 h-3 text-[#315B52] shrink-0" />
                              {new Date(app.interviewDetails.scheduledAt).toLocaleDateString()}
                            </span>
                            {app.interviewDetails.meetingLink && (
                              <a
                                href={app.interviewDetails.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#315B52] hover:text-[#26483F] shrink-0"
                              >
                                <Video className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Actions Footer */}
                        <div className="pt-2 border-t border-[#E8EDEA] flex items-center justify-between text-xs">
                          {/* Prev Stage Move */}
                          <button
                            disabled={colIdx === 0}
                            onClick={() => handleMoveStage(app._id, KANBAN_STAGES[colIdx - 1].id)}
                            title="Move back"
                            className="p-1 rounded text-[#7A8781] hover:text-[#202925] disabled:opacity-20 hover:bg-[#EDF2F0]"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* Action icons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setIsCandidateModalOpen(true);
                              }}
                              title="View Full Profile"
                              className="p-1 rounded text-[#7A8781] hover:text-[#202925] hover:bg-[#EDF2F0]"
                            >
                              <Eye className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setIsInterviewModalOpen(true);
                              }}
                              title="Schedule Interview"
                              className="p-1 rounded text-[#315B52] hover:text-[#26483F] hover:bg-[#EDF2F0]"
                            >
                              <Calendar className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Next Stage Move */}
                          <button
                            disabled={colIdx === KANBAN_STAGES.length - 1}
                            onClick={() => handleMoveStage(app._id, KANBAN_STAGES[colIdx + 1].id)}
                            title="Advance to next stage"
                            className="p-1 rounded text-[#7A8781] hover:text-[#202925] disabled:opacity-20 hover:bg-[#EDF2F0]"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {stageApps.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-[#7A8781] italic">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CandidateDetailModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        candidateProfile={selectedApp?.candidateProfile}
        matchAnalysis={selectedApp?.matchAnalysis}
        stage={selectedApp?.stage}
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
        candidateName={selectedApp?.candidate?.name || 'Candidate'}
        jobTitle={activeJob?.title || 'Position'}
        matchAnalysis={selectedApp?.matchAnalysis}
      />

      <ScheduleInterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSubmit={handleScheduleInterview}
        candidateName={selectedApp?.candidate?.name || 'Candidate'}
        existingDetails={selectedApp?.interviewDetails}
      />
    </div>
  );
};

export default PipelineKanbanPage;
