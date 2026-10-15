const express = require('express');
const router = express.Router();
const {
  getJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter'), createJob);

router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, authorize('recruiter'), updateJob)
  .delete(protect, authorize('recruiter'), deleteJob);

module.exports = router;
