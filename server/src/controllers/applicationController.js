const Application = require('../models/Application');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const { evaluateMatch } = require('../services/matchingEngine');

// @desc    Candidate apply to a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Candidate only)
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active.',
      });
    }

    // Check if candidate has uploaded a resume
    let profile = await CandidateProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please upload and parse your resume before applying for jobs.',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position.',
        application: existingApplication,
      });
    }

    // Compute AI match analysis
    const matchAnalysis = evaluateMatch(job, profile);

    // Create Application
    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      candidateProfile: profile._id,
      stage: 'Applied',
      stageHistory: [
        {
          stage: 'Applied',
          updatedBy: req.user.id,
          updatedAt: new Date(),
          note: 'Application submitted by candidate.',
        },
      ],
      matchAnalysis,
    });

    // Increment applicantsCount on job
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Your AI match score has been computed.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job (Kanban & List views)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
exports.getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email phone avatar')
      .populate('candidateProfile')
      .populate('stageHistory.updatedBy', 'name role')
      .sort({ 'matchAnalysis.overallScore': -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application stage (Pipeline / Kanban move)
// @route   PUT /api/applications/:id/stage
// @access  Private (Recruiter)
exports.updateApplicationStage = async (req, res, next) => {
  try {
    const { stage, note } = req.body;
    const allowedStages = ['Applied', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

    if (!allowedStages.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: `Invalid stage. Allowed stages: ${allowedStages.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email phone')
      .populate('job', 'title company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Append to stage history
    application.stage = stage;
    application.stageHistory.push({
      stage,
      updatedBy: req.user.id,
      updatedAt: new Date(),
      note: note || `Candidate moved to ${stage}`,
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: `Candidate stage updated to '${stage}' successfully.`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule or update interview details
// @route   PUT /api/applications/:id/schedule-interview
// @access  Private (Recruiter)
exports.scheduleInterview = async (req, res, next) => {
  try {
    const { scheduledAt, type, meetingLink, interviewer, notes } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    application.interviewDetails = {
      scheduledAt: scheduledAt || application.interviewDetails?.scheduledAt,
      type: type || application.interviewDetails?.type || 'Technical',
      meetingLink: meetingLink !== undefined ? meetingLink : application.interviewDetails?.meetingLink,
      interviewer: interviewer || application.interviewDetails?.interviewer,
      notes: notes || application.interviewDetails?.notes,
    };

    // If stage was not already 'Interview Scheduled', auto transition
    if (application.stage !== 'Interview Scheduled') {
      application.stage = 'Interview Scheduled';
      application.stageHistory.push({
        stage: 'Interview Scheduled',
        updatedBy: req.user.id,
        updatedAt: new Date(),
        note: `Interview scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      });
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Interview details scheduled successfully.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's submitted applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job')
      .populate('stageHistory.updatedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add recruiter note to application
// @route   PUT /api/applications/:id/notes
// @access  Private (Recruiter)
exports.updateRecruiterNotes = async (req, res, next) => {
  try {
    const { recruiterNotes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { recruiterNotes },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notes updated successfully.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
