import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Sparkles, Building2, MapPin, DollarSign } from 'lucide-react';

const JobFormModal = ({ isOpen, onClose, onSubmit, initialJob = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-Time',
    description: '',
    requiredSkills: '',
    optionalSkills: '',
    minExperience: 3,
    maxExperience: 8,
    educationRequirement: 'Bachelor',
    salaryMin: 120000,
    salaryMax: 160000,
    salaryCurrency: 'USD',
    status: 'active',
  });

  useEffect(() => {
    if (initialJob) {
      setFormData({
        title: initialJob.title || '',
        company: initialJob.company || '',
        department: initialJob.department || 'Engineering',
        location: initialJob.location || 'Remote',
        type: initialJob.type || 'Full-Time',
        description: initialJob.description || '',
        requiredSkills: Array.isArray(initialJob.requiredSkills)
          ? initialJob.requiredSkills.join(', ')
          : initialJob.requiredSkills || '',
        optionalSkills: Array.isArray(initialJob.optionalSkills)
          ? initialJob.optionalSkills.join(', ')
          : initialJob.optionalSkills || '',
        minExperience: initialJob.minExperience ?? 3,
        maxExperience: initialJob.maxExperience ?? 8,
        educationRequirement: initialJob.educationRequirement || 'Bachelor',
        salaryMin: initialJob.salaryMin ?? 120000,
        salaryMax: initialJob.salaryMax ?? 160000,
        salaryCurrency: initialJob.salaryCurrency || 'USD',
        status: initialJob.status || 'active',
      });
    } else {
      setFormData({
        title: '',
        company: '',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-Time',
        description: '',
        requiredSkills: '',
        optionalSkills: '',
        minExperience: 3,
        maxExperience: 8,
        educationRequirement: 'Bachelor',
        salaryMin: 120000,
        salaryMax: 160000,
        salaryCurrency: 'USD',
        status: 'active',
      });
    }
  }, [initialJob, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      optionalSkills: formData.optionalSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      minExperience: Number(formData.minExperience),
      maxExperience: Number(formData.maxExperience),
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202925]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-[#DFE6E2] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8EDEA]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
              <Briefcase className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#202925]">
              {initialJob ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A8781] hover:text-[#202925] rounded-lg hover:bg-[#EDF2F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Senior Full-Stack Engineer"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                required
                placeholder="e.g. CloudScale Tech"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                placeholder="Engineering / AI / Product"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="Remote / San Francisco, CA / Hybrid"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Employment Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Required Skills (Comma Separated) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#202925]">
                Required Technical Skills (comma-separated) *
              </label>
              <span className="text-[11px] text-[#52796F] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#315B52]" /> Used by AI Matching Engine
              </span>
            </div>
            <input
              type="text"
              name="requiredSkills"
              required
              placeholder="React, Node.js, TypeScript, MongoDB, Docker"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm font-mono focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
            />
          </div>

          {/* Optional Skills */}
          <div>
            <label className="block text-xs font-semibold text-[#202925] mb-1">
              Optional / Nice-to-Have Skills (comma-separated)
            </label>
            <input
              type="text"
              name="optionalSkills"
              placeholder="AWS, GraphQL, Redis, Tailwind CSS, CI/CD"
              value={formData.optionalSkills}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm font-mono focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
            />
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Min Exp (Years) *
              </label>
              <input
                type="number"
                name="minExperience"
                min="0"
                max="30"
                required
                value={formData.minExperience}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Max Exp (Years)
              </label>
              <input
                type="number"
                name="maxExperience"
                min="0"
                max="30"
                value={formData.maxExperience}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Education
              </label>
              <select
                name="educationRequirement"
                value={formData.educationRequirement}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              >
                <option value="Any">Any Degree</option>
                <option value="Associate">Associate / Diploma</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD / Doctorate</option>
              </select>
            </div>
          </div>

          {/* Salary Range & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Salary Min ($)
              </label>
              <input
                type="number"
                name="salaryMin"
                step="5000"
                value={formData.salaryMin}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Salary Max ($)
              </label>
              <input
                type="number"
                name="salaryMax"
                step="5000"
                value={formData.salaryMax}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202925] mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
              >
                <option value="active">Active (Open)</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-[#202925] mb-1">
              Job Description & Responsibilities *
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Describe the role requirements, responsibilities, team structure, and impact..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm leading-relaxed focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E8EDEA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#596760] bg-white hover:bg-[#EDF2F0] hover:text-[#202925] border border-[#DFE6E2] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialJob ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
