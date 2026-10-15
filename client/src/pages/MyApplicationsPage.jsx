import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import {
  Send,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';

const STAGES_ORDER = ['Applied', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Selected'];

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationAPI.getMyApplications();
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#315B52] animate-spin" />
        <p className="text-sm text-[#596760]">Loading your applications tracker...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DFE6E2]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202925] flex items-center gap-2.5">
            <Send className="w-7 h-7 text-[#315B52]" />
            <span>My Job Applications</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#596760]">
            Real-time status updates, interview schedules, and stage progression history.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <Briefcase className="w-4 h-4" />
          Explore More Openings
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.length > 0 ? (
          applications.map((app) => {
            const currentStageIdx = STAGES_ORDER.indexOf(app.stage);
            const isRejected = app.stage === 'Rejected';

            return (
              <div
                key={app._id}
                className="p-6 rounded-2xl bg-white border border-[#DFE6E2] space-y-5 shadow-sm"
              >
                {/* Top header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[#315B52] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#315B52]" />
                      {app.job?.company}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#202925] mt-0.5">
                      <Link to={`/jobs/${app.job?._id}`} className="hover:text-[#315B52] transition-colors">
                        {app.job?.title}
                      </Link>
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-[#7A8781] mt-1">
                      <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{app.job?.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <MatchScoreBadge score={app.matchAnalysis?.overallScore || 0} size="sm" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isRejected
                          ? 'bg-[#FBECEC] text-[#B54747] border-[#B54747]/30'
                          : app.stage === 'Selected'
                          ? 'bg-[#E8F3EC] text-[#34765B] border-[#34765B]/30'
                          : 'bg-[#EDF2F0] text-[#315B52] border-[#DFE6E2]'
                      }`}
                    >
                      {app.stage}
                    </span>
                  </div>
                </div>

                {/* Progress Bar (if not rejected) */}
                {!isRejected && (
                  <div className="pt-2">
                    <div className="grid grid-cols-5 gap-2">
                      {STAGES_ORDER.map((stageName, idx) => {
                        const isDone = currentStageIdx >= idx;
                        const isCurrent = app.stage === stageName;

                        return (
                          <div key={idx} className="space-y-1">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isDone
                                  ? isCurrent
                                    ? 'bg-[#315B52] shadow-sm animate-pulse'
                                    : 'bg-[#52796F]'
                                  : 'bg-[#EDF2F0]'
                              }`}
                            />
                            <span
                              className={`text-[11px] block text-center truncate ${
                                isCurrent
                                  ? 'font-bold text-[#202925]'
                                  : isDone
                                  ? 'text-[#315B52] font-medium'
                                  : 'text-[#7A8781]'
                              }`}
                            >
                              {stageName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Interview Information Banner (if scheduled) */}
                {app.interviewDetails?.scheduledAt && (
                  <div className="p-4 rounded-xl bg-[#EAF1F7] border border-[#426D8A]/20 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-white text-[#426D8A] border border-[#DFE6E2]">
                          <Video className="w-4 h-4 text-[#426D8A]" />
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#202925]">
                            {app.interviewDetails.type} Interview Scheduled
                          </h4>
                          <p className="text-xs text-[#596760] flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-[#426D8A]" />
                            {new Date(app.interviewDetails.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {app.interviewDetails.meetingLink && (
                        <a
                          href={app.interviewDetails.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join Video Call
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {app.interviewDetails.notes && (
                      <p className="text-xs text-[#596760] bg-white p-2.5 rounded-lg border border-[#DFE6E2]">
                        <strong className="text-[#426D8A]">Preparation note: </strong>
                        {app.interviewDetails.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Stage History Timeline */}
                {app.stageHistory && app.stageHistory.length > 0 && (
                  <div className="pt-3 border-t border-[#E8EDEA] space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8781] block">
                      Stage Transition History
                    </span>
                    <div className="space-y-1.5">
                      {app.stageHistory.map((hist, hIdx) => (
                        <div
                          key={hIdx}
                          className="text-xs text-[#596760] flex items-center justify-between bg-[#F5F7F6] p-2 rounded-lg border border-[#DFE6E2]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#315B52]" />
                            <strong className="text-[#202925]">{hist.stage}</strong>
                            {hist.note && <span className="text-[#7A8781]">— "{hist.note}"</span>}
                          </div>
                          <span className="text-[10px] text-[#7A8781]">
                            {new Date(hist.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 rounded-2xl bg-white border border-[#DFE6E2] text-center text-[#596760] space-y-3 shadow-sm">
            <Send className="w-10 h-10 text-[#7A8781] mx-auto" />
            <h3 className="text-base font-semibold text-[#202925]">No applications yet</h3>
            <p className="text-xs max-w-sm mx-auto">
              Explore open positions and submit your profile with 1-click AI matching!
            </p>
            <Link
              to="/jobs"
              className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-colors"
            >
              Browse Job Openings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
