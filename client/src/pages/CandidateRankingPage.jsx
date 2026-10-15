import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { matchingAPI, applicationAPI } from '../services/api';
import {
  Sparkles,
  ArrowLeft,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Eye,
  KanbanSquare,
  Filter,
  Check,
  ChevronDown,
  Loader2,
  Building2,
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import CandidateDetailModal from '../components/CandidateDetailModal';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';

const STAGES = ['Applied', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

const CandidateRankingPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [selectedStageFilter, setSelectedStageFilter] = useState('');

  // Modals state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const fetchRankedData = async () => {
    try {
      setLoading(true);
      const res = await matchingAPI.getRankedCandidates(jobId);
      if (res.data.success) {
        setJob(res.data.job);
        setRankedCandidates(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching ranked candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankedData();
  }, [jobId]);

  const handleStageChange = async (appItem, newStage) => {
    if (!appItem.applicationId) {
      alert('This candidate is in the talent pool and has not formally applied yet.');
      return;
    }

    try {
      await applicationAPI.updateStage(appItem.applicationId, newStage);
      fetchRankedData();
    } catch (err) {
      console.error('Error updating stage:', err);
    }
  };

  const handleScheduleInterview = async (interviewDetails) => {
    if (!selectedCandidate?.applicationId) return;

    try {
      await applicationAPI.scheduleInterview(selectedCandidate.applicationId, interviewDetails);
      setIsInterviewModalOpen(false);
      fetchRankedData();
      alert('Interview scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling interview:', err);
    }
  };

  // Filter list
  const filteredList = rankedCandidates.filter((item) => {
    const scoreMatches = item.matchAnalysis.overallScore >= minScoreFilter;
    const stageMatches = !selectedStageFilter || item.stage === selectedStageFilter;
    return scoreMatches && stageMatches;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#315B52] animate-spin" />
        <p className="text-sm text-[#7A8781]">Running AI ranking algorithms on candidate pool...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#596760] hover:text-[#202925] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
        <Link
          to={`/pipeline?jobId=${jobId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#315B52] bg-white hover:bg-[#EDF2F0] border border-[#DFE6E2] rounded-xl transition-all"
        >
          <KanbanSquare className="w-4 h-4 text-[#315B52]" />
          Switch to Kanban Board
        </Link>
      </div>

      {/* Role Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#DFE6E2] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#315B52] mb-1">
            <Sparkles className="w-4 h-4 text-[#315B52]" />
            <span>AI Automated Ranking View</span>
          </div>
          <h1 className="text-2xl font-bold text-[#202925]">{job?.title}</h1>
          <p className="text-xs text-[#596760] mt-1">
            {job?.company} • Required: {job?.requiredSkills?.join(', ')} • Min {job?.minExperience}+ yrs exp
          </p>
        </div>

        <div className="flex items-center gap-3 text-center sm:text-right">
          <div className="p-3 rounded-xl bg-[#EDF2F0] border border-[#DFE6E2]">
            <div className="text-xl font-extrabold text-[#202925]">{rankedCandidates.length}</div>
            <div className="text-[11px] text-[#7A8781]">Evaluated Candidates</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#DFE6E2] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Min Score Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#596760] font-medium">Min Match Score:</span>
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#CFD9D3] text-[#202925] text-xs font-semibold focus:border-[#52796F] focus:outline-none"
            >
              <option value="0">All Scores (0%+)</option>
              <option value="50">Potential Match (50%+)</option>
              <option value="65">Good Match (65%+)</option>
              <option value="80">Strong Match (80%+)</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#596760] font-medium">Stage:</span>
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#CFD9D3] text-[#202925] text-xs font-semibold focus:border-[#52796F] focus:outline-none"
            >
              <option value="">All Stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="Talent Pool">Talent Pool (Not Applied)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#7A8781] font-medium">
          Showing <strong className="text-[#202925]">{filteredList.length}</strong> candidates
        </div>
      </div>

      {/* Ranked Candidate List */}
      <div className="space-y-4">
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => {
            const profile = item.candidateProfile;
            const parsed = profile?.parsedData || {};
            const match = item.matchAnalysis;
            const candName = item.candidate?.name || parsed.name || 'Candidate';

            return (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-[#DFE6E2] hover:border-[#CFD9D3] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left info: Rank & Candidate summary */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Rank Badge */}
                  <div className="w-9 h-9 rounded-xl bg-[#EDF2F0] border border-[#DFE6E2] flex items-center justify-center text-xs font-extrabold text-[#315B52] shrink-0">
                    #{index + 1}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#202925] text-base">{candName}</h3>
                      <span className="text-xs text-[#7A8781]">
                        ({parsed.totalYearsExperience || 0} yrs exp • {parsed.highestEducation || 'Bachelor'})
                      </span>
                      {item.stage && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
                          {item.stage}
                        </span>
                      )}
                    </div>

                    {/* Matched & Missing Skills Preview */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                      {match.matchedSkills?.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-[#E8F3EC] text-[#34765B] border border-[#34765B]/25 text-[11px] font-medium"
                        >
                          ✓ {s}
                        </span>
                      ))}

                      {match.missingSkills?.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-[#FBECEC] text-[#B54747] border border-[#B54747]/25 text-[11px] font-medium"
                        >
                          ✗ {s}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-[#7A8781] mt-1 italic line-clamp-1">
                      {match.aiSummary}
                    </p>
                  </div>
                </div>

                {/* Right info: Match Score & Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#DFE6E2]">
                  {/* Match Score Badge */}
                  <div
                    onClick={() => {
                      setSelectedCandidate(item);
                      setIsBreakdownModalOpen(true);
                    }}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <MatchScoreBadge
                      score={match.overallScore}
                      size="md"
                      showRecommendation={true}
                      recommendation={match.recommendation}
                    />
                  </div>

                  {/* Stage Dropdown (if applicant) */}
                  {item.isApplicant && (
                    <select
                      value={item.stage}
                      onChange={(e) => handleStageChange(item, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-xs font-semibold focus:border-[#52796F] focus:outline-none"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCandidate(item);
                        setIsCandidateModalOpen(true);
                      }}
                      title="View Full Parsed Profile"
                      className="p-2 rounded-xl text-[#596760] hover:text-[#202925] bg-white hover:bg-[#EDF2F0] border border-[#DFE6E2] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {item.isApplicant && (
                      <button
                        onClick={() => {
                          setSelectedCandidate(item);
                          setIsInterviewModalOpen(true);
                        }}
                        title="Schedule Interview"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Interview
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 rounded-2xl bg-white border border-[#DFE6E2] text-center text-[#7A8781]">
            <Users className="w-8 h-8 text-[#7A8781] mx-auto mb-2" />
            <p className="text-sm">No candidates match the selected filter threshold.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CandidateDetailModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        candidateProfile={selectedCandidate?.candidateProfile}
        matchAnalysis={selectedCandidate?.matchAnalysis}
        stage={selectedCandidate?.stage}
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
        candidateName={selectedCandidate?.candidate?.name || 'Candidate'}
        jobTitle={job?.title || 'Position'}
        matchAnalysis={selectedCandidate?.matchAnalysis}
      />

      <ScheduleInterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSubmit={handleScheduleInterview}
        candidateName={selectedCandidate?.candidate?.name || 'Candidate'}
        existingDetails={selectedCandidate?.interviewDetails}
      />
    </div>
  );
};

export default CandidateRankingPage;
