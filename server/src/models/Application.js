const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidateProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateProfile',
      required: true,
    },
    stage: {
      type: String,
      enum: ['Applied', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    stageHistory: [
      {
        stage: {
          type: String,
          enum: ['Applied', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
          required: true,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: '',
        },
      },
    ],
    matchAnalysis: {
      overallScore: { type: Number, default: 0 },
      skillsScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
      semanticScore: { type: Number, default: 0 },
      matchedSkills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      additionalSkills: { type: [String], default: [] },
      experienceFit: {
        candidateYears: { type: Number, default: 0 },
        requiredYears: { type: Number, default: 0 },
        status: { type: String, default: 'Meets' }, // Below, Meets, Exceeds
      },
      educationFit: {
        candidateDegree: { type: String, default: '' },
        requiredDegree: { type: String, default: '' },
        status: { type: String, default: 'Meets' }, // Below, Meets, Exceeds
      },
      recommendation: {
        type: String,
        enum: ['Strong Match', 'Good Match', 'Potential Match', 'Low Match'],
        default: 'Potential Match',
      },
      aiSummary: { type: String, default: '' },
    },
    interviewDetails: {
      scheduledAt: { type: Date },
      type: {
        type: String,
        enum: ['Technical', 'HR', 'System Design', 'Cultural Fit', 'Final Round', 'General'],
        default: 'Technical',
      },
      meetingLink: { type: String, default: '' },
      interviewer: { type: String, default: '' },
      notes: { type: String, default: '' },
      feedback: { type: String, default: '' },
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent candidate from applying to the same job multiple times
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
