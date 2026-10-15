const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: 'Engineering',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      default: 'Remote',
    },
    type: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship'],
      default: 'Full-Time',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill is needed'],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: 'Please provide at least one required skill',
      },
    },
    optionalSkills: {
      type: [String],
      default: [],
    },
    minExperience: {
      type: Number,
      required: [true, 'Minimum years of experience is required'],
      min: [0, 'Minimum experience cannot be negative'],
      default: 0,
    },
    maxExperience: {
      type: Number,
      min: [0, 'Maximum experience cannot be negative'],
      default: 10,
    },
    educationRequirement: {
      type: String,
      enum: ['Any', 'High School', 'Associate', 'Bachelor', 'Master', 'PhD'],
      default: 'Bachelor',
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryCurrency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
