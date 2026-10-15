const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getJobApplications,
  updateApplicationStage,
  scheduleInterview,
  getMyApplications,
  updateRecruiterNotes,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/auth');

// Candidate routes
router.post('/apply/:jobId', protect, authorize('candidate'), applyToJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);

// Recruiter routes
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.put('/:id/stage', protect, authorize('recruiter'), updateApplicationStage);
router.put('/:id/schedule-interview', protect, authorize('recruiter'), scheduleInterview);
router.put('/:id/notes', protect, authorize('recruiter'), updateRecruiterNotes);

module.exports = router;
