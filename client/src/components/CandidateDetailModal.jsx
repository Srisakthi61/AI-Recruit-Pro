import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Link2,
  Download,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';

const CandidateDetailModal = ({
  isOpen,
  onClose,
  candidateProfile,
  matchAnalysis,
  stage,
  onOpenScheduleInterview,
  onOpenScoreBreakdown,
}) => {
  if (!isOpen || !candidateProfile) return null;

  const parsed = candidateProfile.parsedData || {};
  const {
    name = 'Candidate',
    email = '',
    phone = '',
    location = '',
    summary = '',
    skills = [],
    technicalSkills = [],
    softSkills = [],
    totalYearsExperience = 0,
    highestEducation = 'Bachelor',
    experience = [],
    education = [],
    certifications = [],
    links = [],
  } = parsed;

  const originalFileName = candidateProfile.originalFileName || 'resume.pdf';
  const fileUrl = candidateProfile.fileUrl || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202925]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-[#DFE6E2] p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#E8EDEA]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#315B52] flex items-center justify-center text-white font-bold text-lg">
              {name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#202925]">{name}</h2>
                {stage && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
                    {stage}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#596760]">
                {email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#7A8781]" /> {email}
                  </span>
                )}
                {phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#7A8781]" /> {phone}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7A8781]" /> {location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A8781] hover:text-[#202925] rounded-lg hover:bg-[#EDF2F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Match Overview (if available) */}
        {matchAnalysis && (
          <div className="mt-5 p-4 rounded-xl bg-[#EDF2F0] border border-[#DFE6E2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MatchScoreBadge score={matchAnalysis.overallScore} size="md" showRecommendation={true} recommendation={matchAnalysis.recommendation} />
              <div className="text-xs text-[#596760]">
                <span>{matchAnalysis.matchedSkills?.length || 0} skills matched • {matchAnalysis.experienceFit?.status || 'Meets'} experience</span>
              </div>
            </div>
            {onOpenScoreBreakdown && (
              <button
                onClick={onOpenScoreBreakdown}
                className="px-3 py-1.5 text-xs font-medium text-[#315B52] bg-white hover:bg-[#EDF2F0] border border-[#DFE6E2] rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#315B52]" /> View Breakdown
              </button>
            )}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A8781] mb-1.5">
              Professional Summary
            </h3>
            <p className="text-sm text-[#202925] leading-relaxed bg-[#F5F7F6] p-3.5 rounded-xl border border-[#DFE6E2]">
              {summary}
            </p>
          </div>
        )}

        {/* Skills Tag Matrix */}
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A8781] mb-2">
            Skills Extracted by NLP ({skills.length})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => {
              const isMatched = matchAnalysis?.matchedSkills?.includes(skill);
              return (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                    isMatched
                      ? 'bg-[#E8F3EC] text-[#34765B] border-[#34765B]/25 font-semibold'
                      : 'bg-[#EDF2F0] text-[#596760] border-[#DFE6E2]'
                  }`}
                >
                  {isMatched ? `✓ ${skill}` : skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A8781] flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#315B52]" />
              <span>Work Experience ({totalYearsExperience} Total Years)</span>
            </h3>
          </div>
          <div className="space-y-3">
            {experience && experience.length > 0 ? (
               experience.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F5F7F6] border border-[#DFE6E2]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-semibold text-[#202925]">{exp.title}</h4>
                    <span className="text-xs text-[#7A8781] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#7A8781]" />
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-xs text-[#52796F] font-medium mt-0.5">{exp.company}</div>
                  {exp.description && <p className="text-xs text-[#596760] mt-2">{exp.description}</p>}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-[#596760]">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#7A8781] italic">No structured work history items listed.</p>
            )}
          </div>
        </div>

        {/* Education & Links Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Education */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A8781] flex items-center gap-1.5 mb-2.5">
              <GraduationCap className="w-4 h-4 text-[#426D8A]" />
              <span>Education ({highestEducation})</span>
            </h3>
            <div className="space-y-2">
              {education && education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#F5F7F6] border border-[#DFE6E2] text-xs">
                    <div className="font-semibold text-[#202925]">{edu.degree}</div>
                    <div className="text-[#596760]">{edu.institution}</div>
                    <div className="text-[#7A8781] text-[11px] mt-0.5">
                      {edu.fieldOfStudy} {edu.endYear ? `• Graduated ${edu.endYear}` : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#DFE6E2] text-xs text-[#596760]">
                  {highestEducation} Degree
                </div>
              )}
            </div>
          </div>

          {/* Links & Resume File */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A8781] flex items-center gap-1.5 mb-2.5">
              <Link2 className="w-4 h-4 text-[#315B52]" />
              <span>Portfolio & Original Resume</span>
            </h3>
            <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#DFE6E2] space-y-2 text-xs">
              {links && links.length > 0 && (
                <div className="space-y-1 mb-2">
                  {links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#315B52] hover:text-[#26483F] transition-colors truncate"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="capitalize">{link.type}: </span>
                      <span className="underline truncate">{link.url}</span>
                    </a>
                  ))}
                </div>
              )}

              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={originalFileName}
                  className="inline-flex items-center gap-2 px-3 py-2 w-full rounded-lg bg-white hover:bg-[#EDF2F0] text-[#202925] font-medium transition-colors justify-center border border-[#DFE6E2]"
                >
                  <Download className="w-4 h-4 text-[#315B52]" />
                  <span>Download {originalFileName}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8EDEA] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7A8781]">
            Confidence Score: {Math.round((candidateProfile.parsingMetadata?.confidenceScore || 0.95) * 100)}% • NLP Parser v1.0
          </div>
          <div className="flex items-center gap-2">
            {onOpenScheduleInterview && (
              <button
                onClick={onOpenScheduleInterview}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                Schedule Interview
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#596760] bg-white hover:bg-[#EDF2F0] hover:text-[#202925] border border-[#DFE6E2] rounded-xl transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
