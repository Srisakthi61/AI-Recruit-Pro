const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (with search, skills filter, type filter)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { search, type, department, location, minExperience, status } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'active'; // Default active jobs for candidates
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minExperience !== undefined && minExperience !== '') {
      query.minExperience = { $lte: Number(minExperience) };
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's posted jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter only)
exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .populate('recruiter', 'name email company')
      .sort({ createdAt: -1 });

    // Attach current live applicant counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        const jobObj = job.toObject();
        jobObj.applicantsCount = count;
        return jobObj;
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      data: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    const applicantsCount = await Application.countDocuments({ job: job._id });
    const jobData = job.toObject();
    jobData.applicantsCount = applicantsCount;

    res.status(200).json({
      success: true,
      data: jobData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      department,
      location,
      type,
      description,
      requiredSkills,
      optionalSkills,
      minExperience,
      maxExperience,
      educationRequirement,
      salaryMin,
      salaryMax,
      salaryCurrency,
      status,
    } = req.body;

    // Normalize requiredSkills from comma string or array
    let parsedRequiredSkills = requiredSkills;
    if (typeof requiredSkills === 'string') {
      parsedRequiredSkills = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    let parsedOptionalSkills = optionalSkills;
    if (typeof optionalSkills === 'string') {
      parsedOptionalSkills = optionalSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title,
      company: company || req.user.company || 'AI Recruit Pro Hiring',
      department: department || 'Engineering',
      location: location || 'Remote',
      type: type || 'Full-Time',
      description,
      requiredSkills: parsedRequiredSkills || [],
      optionalSkills: parsedOptionalSkills || [],
      minExperience: Number(minExperience) || 0,
      maxExperience: Number(maxExperience) || 10,
      educationRequirement: educationRequirement || 'Bachelor',
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      salaryCurrency: salaryCurrency || 'USD',
      status: status || 'active',
      recruiter: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this job posting.',
      });
    }

    if (typeof req.body.requiredSkills === 'string') {
      req.body.requiredSkills = req.body.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof req.body.optionalSkills === 'string') {
      req.body.optionalSkills = req.body.optionalSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job posting.',
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also delete associated applications
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job posting and related applications deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
