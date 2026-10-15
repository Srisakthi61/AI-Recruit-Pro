const express = require('express');
const router = express.Router();
const {
  getRankedCandidatesForJob,
  evaluateCandidateForJob,
} = require('../controllers/matchingController');
const { protect, authorize } = require('../middlewares/auth');

// Recruiter gets ranked candidates for a specific job
router.get('/job/:jobId/ranked-candidates', protect, authorize('recruiter'), getRankedCandidatesForJob);

// Candidate or Recruiter evaluates match against a job
router.get('/evaluate/:jobId', protect, evaluateCandidateForJob);

module.exports = router;
