import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationAPI, resumeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  Plus,
  Users,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Building2,
  Trash2,
  Edit,
  GraduationCap,
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import JobFormModal from '../components/JobFormModal';
import confetti from 'canvas-confetti';

const JobListingsPage = () => {
  const { user, isRecruiter, isCandidate, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minExpFilter, setMinExpFilter] = useState('');

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedType) params.type = selectedType;
      if (selectedLocation) params.location = selectedLocation;
      if (minExpFilter) params.minExperience = minExpFilter;

      const res = await jobsAPI.getJobs(params);
      if (res.data.success) {
        setJobs(res.data.data);
      }

      if (isCandidate) {
        const [profRes, appRes] = await Promise.all([
          resumeAPI.getMyProfile().catch(() => ({ data: { data: null } })),
          applicationAPI.getMyApplications().catch(() => ({ data: { data: [] } })),
        ]);
        if (profRes.data?.data) {
          setCandidateProfile(profRes.data.data);
        }
        if (appRes.data?.data) {
          setMyApplications(appRes.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, selectedType, selectedLocation, minExpFilter]);

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
      fetchJobs();
    } catch (err) {
      console.error('Error saving job:', err);
      alert(err.response?.data?.message || 'Error saving job.');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobsAPI.deleteJob(jobId);
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      alert('Please sign in or create an account to apply.');
      return;
    }
    try {
      setApplyingJobId(jobId);
      const res = await applicationAPI.applyToJob(jobId);
      if (res.data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        alert('Application submitted successfully!');
        fetchJobs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying for job.');
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DFE6E2]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202925] flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-[#315B52]" />
            <span>Job Opportunities & AI Screening</span>
          </h1>
          <p className="mt-1 text-sm text-[#596760]">
            Browse active technical openings with automated skill overlap and experience calculation.
          </p>
        </div>

        {isRecruiter && (
          <button
            onClick={() => {
              setEditingJob(null);
              setIsJobModalOpen(true);
            }}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Job Posting
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DFE6E2] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A8781] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, skill, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-xs sm:text-sm"
          />
        </div>

        {/* Job Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-xs sm:text-sm"
          >
            <option value="">All Employment Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <input
            type="text"
            placeholder="Filter location (e.g. Remote, SF)..."
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-xs sm:text-sm"
          />
        </div>

        {/* Min Exp Filter */}
        <div>
          <select
            value={minExpFilter}
            onChange={(e) => setMinExpFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-xs sm:text-sm"
          >
            <option value="">Any Experience Level</option>
            <option value="1">Entry Level (≤ 1 yr)</option>
            <option value="3">Mid Level (≤ 3 yrs)</option>
            <option value="5">Senior Level (≤ 5 yrs)</option>
            <option value="10">Staff / Lead (≤ 10 yrs)</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#315B52] animate-spin" />
          <p className="text-xs text-[#596760]">Loading positions...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => {
            const hasApplied = myApplications.some((a) => a.job?._id === job._id || a.job === job._id);

            // Calculate quick rough match preview for candidate if candidateProfile exists
            let quickMatch = 0;
            if (candidateProfile?.parsedData?.skills && job.requiredSkills?.length) {
              const userSkills = candidateProfile.parsedData.skills.map((s) => s.toLowerCase());
              const matched = job.requiredSkills.filter((r) => userSkills.includes(r.toLowerCase()));
              quickMatch = Math.round((matched.length / job.requiredSkills.length) * 100);
            }

            return (
              <div
                key={job._id}
                className="p-6 rounded-2xl bg-white border border-[#DFE6E2] hover:border-[#315B52]/50 transition-all flex flex-col justify-between space-y-4 group shadow-sm"
              >
                <div>
                  {/* Top line: Company & Match Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-[#315B52] uppercase tracking-wider flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <h2 className="text-lg font-bold text-[#202925] group-hover:text-[#315B52] transition-colors mt-0.5">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h2>
                    </div>

                    {isCandidate && candidateProfile && (
                      <MatchScoreBadge score={quickMatch} size="sm" />
                    )}
                  </div>

                  {/* Meta details */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A8781] mt-2.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7A8781]" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#7A8781]" />
                      {job.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#7A8781]" />
                      {job.minExperience}+ yrs exp ({job.educationRequirement})
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-[#596760] mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Required Skills Badges */}
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold text-[#7A8781] mb-1.5 uppercase tracking-wider">
                      Required Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-[#E8EDEA] flex items-center justify-between">
                  <div className="text-xs text-[#596760] font-medium">
                    {job.salaryMin > 0 && job.salaryMax > 0 ? (
                      <span className="text-[#34765B] font-semibold">
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                      </span>
                    ) : (
                      'Competitive'
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isRecruiter && (
                      <>
                        <Link
                          to={`/matching/job/${job._id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Rank Candidates
                        </Link>
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setIsJobModalOpen(true);
                          }}
                          className="p-1.5 text-[#7A8781] hover:text-[#202925] rounded-lg hover:bg-[#EDF2F0]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-1.5 text-[#7A8781] hover:text-[#B54747] rounded-lg hover:bg-[#FBECEC]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {isCandidate && (
                      <>
                        {hasApplied ? (
                          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E8F3EC] text-[#34765B] border border-[#34765B]/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(job._id)}
                            disabled={applyingJobId === job._id}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-lg transition-all shadow-sm disabled:opacity-50"
                          >
                            {applyingJobId === job._id ? 'Applying...' : '1-Click Apply'}
                          </button>
                        )}
                      </>
                    )}

                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-2.5 py-1.5 text-xs font-medium text-[#315B52] hover:text-[#26483F] bg-[#EDF2F0] hover:bg-[#DFE6E2] rounded-lg transition-colors"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white border border-[#DFE6E2] text-center text-[#596760] space-y-2 shadow-sm">
          <Search className="w-8 h-8 text-[#7A8781] mx-auto" />
          <h3 className="text-base font-semibold text-[#202925]">No job postings found</h3>
          <p className="text-xs">Try adjusting your keyword search or filters.</p>
        </div>
      )}

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
    </div>
  );
};

export default JobListingsPage;
