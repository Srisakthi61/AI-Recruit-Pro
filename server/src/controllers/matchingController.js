const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const { evaluateMatch } = require('../services/matchingEngine');

// @desc    Get ranked candidates for a specific job
// @route   GET /api/matching/job/:jobId/ranked-candidates
// @access  Private (Recruiter)
exports.getRankedCandidatesForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    // 1. Get all applications for this job (if any)
    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email phone avatar')
      .populate('candidateProfile');

    // 2. Also fetch all CandidateProfiles in the database to allow ranking across pool
    const allProfiles = await CandidateProfile.find().populate('user', 'name email phone avatar');

    // Build unique list of candidate evaluations
    const appliedProfileIds = new Set(
      applications.map((app) => app.candidateProfile?._id?.toString()).filter(Boolean)
    );

    const rankedList = [];

    // Evaluate existing applicants first
    for (const app of applications) {
      if (!app.candidateProfile) continue;
      const match = evaluateMatch(job, app.candidateProfile);

      // Update application matchAnalysis if not stored or refreshed
      app.matchAnalysis = match;
      await app.save();

      rankedList.push({
        isApplicant: true,
        applicationId: app._id,
        stage: app.stage,
        stageHistory: app.stageHistory,
        interviewDetails: app.interviewDetails,
        recruiterNotes: app.recruiterNotes,
        appliedAt: app.createdAt,
        candidate: app.candidate,
        candidateProfile: app.candidateProfile,
        matchAnalysis: match,
      });
    }

    // Include other talent pool candidates who haven't applied yet (for recruiter discovery)
    for (const prof of allProfiles) {
      if (!appliedProfileIds.has(prof._id.toString())) {
        const match = evaluateMatch(job, prof);
        rankedList.push({
          isApplicant: false,
          applicationId: null,
          stage: 'Talent Pool',
          stageHistory: [],
          appliedAt: prof.createdAt,
          candidate: prof.user || { name: prof.parsedData?.name, email: prof.parsedData?.email },
          candidateProfile: prof,
          matchAnalysis: match,
        });
      }
    }

    // Sort descending by overall match score
    rankedList.sort((a, b) => b.matchAnalysis.overallScore - a.matchAnalysis.overallScore);

    res.status(200).json({
      success: true,
      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
        requiredSkills: job.requiredSkills,
        minExperience: job.minExperience,
        educationRequirement: job.educationRequirement,
      },
      count: rankedList.length,
      data: rankedList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get match evaluation between a Candidate and a Job
// @route   GET /api/matching/evaluate/:jobId
// @access  Private (Candidate or Recruiter)
exports.evaluateCandidateForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    let profile;
    if (req.user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ user: req.user.id });
    } else if (req.query.profileId) {
      profile = await CandidateProfile.findById(req.query.profileId);
    }

    if (!profile) {
      return res.status(200).json({
        success: true,
        evaluated: false,
        message: 'No resume profile available to evaluate.',
        matchAnalysis: {
          overallScore: 0,
          skillsScore: 0,
          experienceScore: 0,
          educationScore: 0,
          matchedSkills: [],
          missingSkills: job.requiredSkills,
          recommendation: 'Low Match',
          aiSummary: 'Upload your resume to view AI match score.',
        },
      });
    }

    const match = evaluateMatch(job, profile);

    res.status(200).json({
      success: true,
      evaluated: true,
      matchAnalysis: match,
    });
  } catch (error) {
    next(error);
  }
};
