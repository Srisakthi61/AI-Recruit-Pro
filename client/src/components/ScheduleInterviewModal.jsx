import React, { useState } from 'react';
import { X, Calendar, Video, UserCheck, MessageSquare, Clock } from 'lucide-react';

const ScheduleInterviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  candidateName = 'Candidate',
  existingDetails = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    scheduledAt: existingDetails?.scheduledAt
      ? new Date(existingDetails.scheduledAt).toISOString().slice(0, 16)
      : new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    type: existingDetails?.type || 'Technical',
    meetingLink: existingDetails?.meetingLink || 'https://meet.google.com/rec-interview-room',
    interviewer: existingDetails?.interviewer || '',
    notes: existingDetails?.notes || '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202925]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#DFE6E2] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8EDEA]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#EDF2F0] text-[#315B52] border border-[#DFE6E2]">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#202925]">Schedule Interview</h2>
              <p className="text-xs text-[#7A8781]">With {candidateName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A8781] hover:text-[#202925] rounded-lg hover:bg-[#EDF2F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Date & Time */}
          <div>
            <label className="block font-semibold text-[#202925] mb-1">
              Interview Date & Time *
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              required
              value={formData.scheduledAt}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
            />
          </div>

          {/* Round Type */}
          <div>
            <label className="block font-semibold text-[#202925] mb-1">
              Interview Round Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
            >
              <option value="Technical">Technical Live Coding</option>
              <option value="System Design">System Architecture / Design</option>
              <option value="HR">HR / Initial Culture Screen</option>
              <option value="Cultural Fit">Values & Cultural Alignment</option>
              <option value="Final Round">Executive / Final Round</option>
              <option value="General">General Discussion</option>
            </select>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block font-semibold text-[#202925] mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#315B52]" />
              Meeting URL (Google Meet / Zoom / Teams)
            </label>
            <input
              type="url"
              name="meetingLink"
              required
              placeholder="https://meet.google.com/xyz-abcd-efg"
              value={formData.meetingLink}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
            />
          </div>

          {/* Interviewer */}
          <div>
            <label className="block font-semibold text-[#202925] mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#426D8A]" />
              Interviewer Name / Lead
            </label>
            <input
              type="text"
              name="interviewer"
              placeholder="e.g. Dr. Arthur Vance (VP Engineering)"
              value={formData.interviewer}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-[#202925] mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#52796F]" />
              Preparation Notes for Candidate / Interviewer
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Topics to evaluate, agenda, or prerequisites..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CFD9D3] text-[#202925] placeholder:text-[#7A8781] text-sm focus:border-[#52796F] focus:outline-none focus:ring-1 focus:ring-[#52796F]"
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
              {isSubmitting ? 'Confirming...' : 'Save & Notify Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
