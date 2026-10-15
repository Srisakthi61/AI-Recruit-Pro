import React from 'react';
import { X, Sparkles, CheckCircle2, XCircle, Award, Briefcase, GraduationCap, FileText, Check } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';

const ScoreBreakdownModal = ({ isOpen, onClose, candidateName, jobTitle, matchAnalysis }) => {
  if (!isOpen || !matchAnalysis) return null;

  const {
    overallScore = 0,
    skillsScore = 0,
    experienceScore = 0,
    educationScore = 0,
    semanticScore = 0,
    matchedSkills = [],
    missingSkills = [],
    additionalSkills = [],
    experienceFit = {},
    educationFit = {},
    recommendation = '',
    aiSummary = '',
  } = matchAnalysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202925]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-[#DFE6E2] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E8EDEA]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[#202925]">AI Compatibility Breakdown</h2>
            </div>
            <p className="mt-1 text-sm text-[#7A8781]">
              Analysis for <strong className="text-[#202925]">{candidateName}</strong> against{' '}
              <strong className="text-[#315B52]">{jobTitle}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A8781] hover:text-[#202925] rounded-lg hover:bg-[#EDF2F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Box */}
        <div className="mt-5 p-4 rounded-xl bg-[#EDF2F0] border border-[#DFE6E2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <MatchScoreBadge score={overallScore} size="lg" showRecommendation={true} recommendation={recommendation} />
          <div className="text-xs sm:text-sm text-[#202925] bg-white p-3 rounded-lg border border-[#DFE6E2] flex-1">
            <span className="font-semibold text-[#315B52]">AI Assessment: </span>
            {aiSummary || `Candidate has strong alignment with the technical and experience prerequisites.`}
          </div>
        </div>

        {/* Factor Breakdown Grid */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A8781] mb-3">
            Scoring Dimensions (Weighted Formula)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Skills */}
            <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
              <div className="flex items-center justify-between text-xs text-[#596760] mb-1">
                <span>Skills (50%)</span>
                <span className="font-bold text-[#202925]">{skillsScore}%</span>
              </div>
              <div className="w-full bg-[#EDF2F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#315B52] rounded-full"
                  style={{ width: `${Math.min(100, skillsScore)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#7A8781]">
                {matchedSkills.length} matched / {matchedSkills.length + missingSkills.length} req
              </p>
            </div>

            {/* Experience */}
            <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
              <div className="flex items-center justify-between text-xs text-[#596760] mb-1">
                <span>Exp (25%)</span>
                <span className="font-bold text-[#202925]">{experienceScore}%</span>
              </div>
              <div className="w-full bg-[#EDF2F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#52796F] rounded-full"
                  style={{ width: `${Math.min(100, experienceScore)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#7A8781]">
                {experienceFit.candidateYears ?? 0} yrs ({experienceFit.status || 'Meets'})
              </p>
            </div>

            {/* Education */}
            <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
              <div className="flex items-center justify-between text-xs text-[#596760] mb-1">
                <span>Edu (15%)</span>
                <span className="font-bold text-[#202925]">{educationScore}%</span>
              </div>
              <div className="w-full bg-[#EDF2F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#426D8A] rounded-full"
                  style={{ width: `${Math.min(100, educationScore)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#7A8781]">
                {educationFit.candidateDegree || 'Degree'}
              </p>
            </div>

            {/* Semantic */}
            <div className="p-3 rounded-xl bg-white border border-[#DFE6E2]">
              <div className="flex items-center justify-between text-xs text-[#596760] mb-1">
                <span>NLP Fit (10%)</span>
                <span className="font-bold text-[#202925]">{semanticScore}%</span>
              </div>
              <div className="w-full bg-[#EDF2F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#84A59D] rounded-full"
                  style={{ width: `${Math.min(100, semanticScore)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#7A8781]">TF-IDF Overlap</p>
            </div>
          </div>
        </div>

        {/* Matched & Missing Skills Details */}
        <div className="mt-6 space-y-4">
          {/* Matched Skills */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34765B] uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Matched Required Skills ({matchedSkills.length})</span>
            </div>
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#E8F3EC] text-[#34765B] border border-[#34765B]/25"
                  >
                    <Check className="w-3 h-3" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A8781] italic">No direct required skill matches found.</p>
            )}
          </div>

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B54747] uppercase tracking-wider mb-2">
                <XCircle className="w-4 h-4" />
                <span>Missing Required Skills ({missingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FBECEC] text-[#B54747] border border-[#B54747]/25"
                  >
                    <X className="w-3 h-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Supplementary Skills */}
          {additionalSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7A8781] uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-[#52796F]" />
                <span>Supplementary / Additional Skills ({additionalSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {additionalSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#EDF2F0] text-[#596760] border border-[#DFE6E2]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8EDEA] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#596760] bg-white hover:bg-[#EDF2F0] hover:text-[#202925] border border-[#DFE6E2] rounded-xl transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdownModal;
