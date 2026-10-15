const express = require('express');
const router = express.Router();
const { getRecruiterStats, getCandidateStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/recruiter', protect, authorize('recruiter'), getRecruiterStats);
router.get('/candidate', protect, authorize('candidate'), getCandidateStats);

module.exports = router;
