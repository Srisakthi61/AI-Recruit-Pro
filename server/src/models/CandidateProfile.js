const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    parsedData: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      summary: { type: String, default: '' },
      skills: { type: [String], default: [] },
      technicalSkills: { type: [String], default: [] },
      softSkills: { type: [String], default: [] },
      totalYearsExperience: { type: Number, default: 0 },
      highestEducation: {
        type: String,
        enum: ['None', 'High School', 'Associate', 'Bachelor', 'Master', 'PhD'],
        default: 'Bachelor',
      },
      experience: [
        {
          company: { type: String, default: '' },
          title: { type: String, default: '' },
          location: { type: String, default: '' },
          startDate: { type: String, default: '' },
          endDate: { type: String, default: '' },
          durationYears: { type: Number, default: 0 },
          description: { type: String, default: '' },
          bullets: { type: [String], default: [] },
        },
      ],
      education: [
        {
          institution: { type: String, default: '' },
          degree: { type: String, default: '' },
          fieldOfStudy: { type: String, default: '' },
          startYear: { type: String, default: '' },
          endYear: { type: String, default: '' },
          grade: { type: String, default: '' },
        },
      ],
      certifications: { type: [String], default: [] },
      links: [
        {
          type: { type: String, default: 'other' }, // linkedin, github, portfolio, etc.
          url: { type: String, default: '' },
        },
      ],
    },
    rawText: {
      type: String,
      default: '',
    },
    parsingMetadata: {
      parserVersion: { type: String, default: '1.0.0' },
      parsedAt: { type: Date, default: Date.now },
      confidenceScore: { type: Number, default: 0.9 },
      processingTimeMs: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
