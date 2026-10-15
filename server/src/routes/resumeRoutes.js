const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getMyProfile,
  getProfileById,
  updateMyProfile,
} = require('../controllers/resumeController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public or Candidate/Recruiter resume upload & parsing
router.post('/upload', protect, upload.single('resume'), uploadResume);

// Candidate profile routes
router.get('/my-profile', protect, authorize('candidate'), getMyProfile);
router.put('/my-profile', protect, authorize('candidate'), updateMyProfile);

// Recruiter view profile by ID
router.get('/:id', protect, authorize('recruiter'), getProfileById);

module.exports = router;
