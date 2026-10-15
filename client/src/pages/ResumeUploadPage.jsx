import React, { useState, useEffect, useRef } from 'react';
import { resumeAPI } from '../services/api';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Save,
  Check,
  Loader2,
  Link2,
  FileCode,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ResumeUploadPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'
  const [rawText, setRawText] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [parsingStep, setParsingStep] = useState(0);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await resumeAPI.getMyProfile();
      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setErrorMessage('');
    setUploading(true);
    setParsingStep(1);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Simulated step progression for smooth UX
      setTimeout(() => setParsingStep(2), 600);
      setTimeout(() => setParsingStep(3), 1200);

      const res = await resumeAPI.uploadResume(formData);
      if (res.data.success) {
        setParsingStep(4);
        setProfile(res.data.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error uploading and parsing resume.');
    } finally {
      setUploading(false);
      setParsingStep(0);
    }
  };

  const handleRawTextSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setErrorMessage('');
    setUploading(true);

    try {
      const res = await resumeAPI.uploadRawText(rawText);
      if (res.data.success) {
        setProfile(res.data.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error parsing resume text.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim() || !profile) return;

    const currentSkills = profile.parsedData?.skills || [];
    if (!currentSkills.includes(newSkill.trim())) {
      const updated = [...currentSkills, newSkill.trim()];
      setProfile({
        ...profile,
        parsedData: {
          ...profile.parsedData,
          skills: updated,
        },
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!profile) return;
    const currentSkills = profile.parsedData?.skills || [];
    const updated = currentSkills.filter((s) => s !== skillToRemove);
    setProfile({
      ...profile,
      parsedData: {
        ...profile.parsedData,
        skills: updated,
      },
    });
  };

  const handleProfileChange = (field, value) => {
    if (!profile) return;
    setProfile({
      ...profile,
      parsedData: {
        ...profile.parsedData,
        [field]: value,
      },
    });
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      setSaveSuccess(false);
      const res = await resumeAPI.updateMyProfile(profile.parsedData);
      if (res.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert('Error updating profile.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#DFE6E2]">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
            <Sparkles className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202925]">
              AI Resume Parser & Profile Extractor
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#596760]">
              Upload your resume (PDF/DOCX) to automatically extract skills, calculate experience, and generate a structured career profile.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FBECEC] border border-[#B54747]/30 text-[#B54747] text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Section */}
      <div className="p-6 rounded-2xl bg-white border border-[#DFE6E2] space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DFE6E2] pb-3">
          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'file'
                  ? 'border-[#315B52] text-[#315B52]'
                  : 'border-transparent text-[#7A8781] hover:text-[#202925]'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload PDF / DOCX Document
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'text'
                  ? 'border-[#315B52] text-[#315B52]'
                  : 'border-transparent text-[#7A8781] hover:text-[#202925]'
              }`}
            >
              <FileCode className="w-4 h-4" />
              Paste Raw Resume Text
            </button>
          </div>
        </div>

        {activeTab === 'file' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className="border-2 border-dashed border-[#CFD9D3] hover:border-[#315B52] bg-[#F5F7F6] hover:bg-[#EDF2F0] rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-white text-[#315B52] border border-[#DFE6E2] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-[#202925] mb-1">
              Drag and drop your resume file here
            </h3>
            <p className="text-xs text-[#596760] max-w-sm mx-auto">
              Supported formats: PDF, DOCX, DOC, or TXT (Max 10MB)
            </p>

            <button
              type="button"
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-colors inline-block"
            >
              Browse Local Files
            </button>
          </div>
        ) : (
          <form onSubmit={handleRawTextSubmit} className="space-y-4">
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste the full text content of your resume here (experience, skills, education, contact info)..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] placeholder:text-[#7A8781] text-xs sm:text-sm font-mono leading-relaxed"
            />
            <button
              type="submit"
              disabled={uploading || !rawText.trim()}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {uploading ? 'Analyzing NLP Pipeline...' : 'Parse & Extract Profile'}
            </button>
          </form>
        )}

        {/* Upload & NLP Ingestion Progress Indicator */}
        {uploading && (
          <div className="p-4 rounded-xl bg-[#EDF2F0] border border-[#DFE6E2] space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-[#315B52] font-semibold">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#315B52]" />
                NLP Parser Engine in Progress...
              </span>
              <span>Step {parsingStep}/4</span>
            </div>
            <div className="w-full bg-[#DFE6E2] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#315B52] rounded-full transition-all duration-500"
                style={{ width: `${(parsingStep / 4) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-[#596760]">
              Extracting entities, tokenizing 500+ technical taxonomy skills, and calculating total experience years...
            </p>
          </div>
        )}
      </div>

      {/* Extracted Profile Form / Editor */}
      {profile && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DFE6E2] space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DFE6E2]">
            <div>
              <h2 className="text-xl font-bold text-[#202925] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#34765B]" />
                <span>Extracted Candidate Profile</span>
              </h2>
              <p className="text-xs text-[#596760] mt-0.5">
                Parsed from <strong className="text-[#202925]">{profile.originalFileName}</strong> • Confidence: {Math.round((profile.parsingMetadata?.confidenceScore || 0.95) * 100)}%
              </p>
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#34765B] hover:bg-[#26483F] rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Edits
                </>
              )}
            </button>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Extracted Name
              </label>
              <input
                type="text"
                value={profile.parsedData?.name || ''}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Extracted Email
              </label>
              <input
                type="email"
                value={profile.parsedData?.email || ''}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.parsedData?.phone || ''}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Total Years Experience (Calculated)
              </label>
              <input
                type="number"
                step="0.5"
                value={profile.parsedData?.totalYearsExperience || 0}
                onChange={(e) =>
                  handleProfileChange('totalYearsExperience', parseFloat(e.target.value) || 0)
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#596760] mb-1">
                Highest Education Level
              </label>
              <select
                value={profile.parsedData?.highestEducation || 'Bachelor'}
                onChange={(e) => handleProfileChange('highestEducation', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-sm"
              >
                <option value="PhD">PhD / Doctorate</option>
                <option value="Master">Master's Degree</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Associate">Associate / Diploma</option>
                <option value="High School">High School</option>
              </select>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <label className="block text-xs font-semibold text-[#596760] mb-1">
              Professional Summary
            </label>
            <textarea
              rows={3}
              value={profile.parsedData?.summary || ''}
              onChange={(e) => handleProfileChange('summary', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-sm leading-relaxed"
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-[#596760] mb-2">
              Extracted Technical & Soft Skills ({(profile.parsedData?.skills || []).length})
            </label>

            {/* Add skill input */}
            <form onSubmit={handleAddSkill} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Add custom skill (e.g. Next.js, Kubernetes, PyTorch)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3.5 py-1.5 rounded-xl bg-white border border-[#CFD9D3] focus:border-[#52796F] outline-none text-[#202925] text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#315B52] hover:bg-[#26483F] rounded-xl transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </form>

            {/* Skills pills */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#F5F7F6] border border-[#DFE6E2]">
              {(profile.parsedData?.skills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2] group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#7A8781] hover:text-[#B54747] transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadPage;
