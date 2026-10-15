const Job = require('../models/Job');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');

// @desc    Get dashboard metrics for recruiter
// @route   GET /api/stats/recruiter
// @access  Private (Recruiter)
exports.getRecruiterStats = async (req, res, next) => {
  try {
    const recruiterId = req.user.id;

    // Jobs posted by recruiter
    const myJobs = await Job.find({ recruiter: recruiterId });
    const jobIds = myJobs.map((j) => j._id);

    const totalJobs = myJobs.length;
    const activeJobs = myJobs.filter((j) => j.status === 'active').length;

    // Applications for recruiter's jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company')
      .populate('candidate', 'name email avatar')
      .populate('candidateProfile');

    const totalApplicants = applications.length;
    const shortlistedCount = applications.filter((a) => a.stage === 'Shortlisted').length;
    const interviewCount = applications.filter((a) => a.stage === 'Interview Scheduled').length;
    const selectedCount = applications.filter((a) => a.stage === 'Selected').length;
    const rejectedCount = applications.filter((a) => a.stage === 'Rejected').length;

    // Compute average AI match score
    let avgMatchScore = 0;
    if (applications.length > 0) {
      const sum = applications.reduce((acc, curr) => acc + (curr.matchAnalysis?.overallScore || 0), 0);
      avgMatchScore = Math.round(sum / applications.length);
    }

    // Stage distribution
    const stageDistribution = {
      Applied: applications.filter((a) => a.stage === 'Applied').length,
      Screened: applications.filter((a) => a.stage === 'Screened').length,
      Shortlisted: shortlistedCount,
      'Interview Scheduled': interviewCount,
      Selected: selectedCount,
      Rejected: rejectedCount,
    };

    // Recent 5 applications
    const recentApplications = applications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplicants,
        shortlistedCount,
        interviewCount,
        selectedCount,
        rejectedCount,
        avgMatchScore,
        stageDistribution,
      },
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics for candidate
// @route   GET /api/stats/candidate
// @access  Private (Candidate)
exports.getCandidateStats = async (req, res, next) => {
  try {
    const candidateId = req.user.id;

    const applications = await Application.find({ candidate: candidateId }).populate('job', 'title company location type');
    const profile = await CandidateProfile.findOne({ user: candidateId });

    const totalApplied = applications.length;
    const inReview = applications.filter((a) => ['Applied', 'Screened'].includes(a.stage)).length;
    const shortlisted = applications.filter((a) => a.stage === 'Shortlisted').length;
    const interviews = applications.filter((a) => a.stage === 'Interview Scheduled').length;
    const offers = applications.filter((a) => a.stage === 'Selected').length;

    res.status(200).json({
      success: true,
      stats: {
        totalApplied,
        inReview,
        shortlisted,
        interviews,
        offers,
        hasResume: !!profile,
        resumeSkillsCount: profile?.parsedData?.skills?.length || 0,
        totalYearsExperience: profile?.parsedData?.totalYearsExperience || 0,
      },
      profileSummary: profile ? profile.parsedData : null,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
