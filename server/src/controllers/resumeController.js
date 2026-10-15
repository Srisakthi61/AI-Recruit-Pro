const CandidateProfile = require('../models/CandidateProfile');
const { parseResume } = require('../services/resumeParser');
const fs = require('fs');
const path = require('path');

// @desc    Upload and parse resume (PDF / DOCX)
// @route   POST /api/resume/upload
// @access  Private (Candidate or Recruiter)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file && !req.body.rawText) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file (PDF/DOCX) or provide raw resume text.',
      });
    }

    let fileBuffer;
    let originalName = 'resume.pdf';
    let mimeType = 'application/pdf';
    let fileSize = 0;
    let fileUrl = '';

    if (req.file) {
      fileBuffer = fs.readFileSync(req.file.path);
      originalName = req.file.originalname;
      mimeType = req.file.mimetype;
      fileSize = req.file.size;
      fileUrl = `/uploads/${path.basename(req.file.path)}`;
    } else {
      fileBuffer = req.body.rawText;
      originalName = 'manual_input.txt';
      mimeType = 'text/plain';
      fileSize = Buffer.byteLength(req.body.rawText, 'utf8');
      fileUrl = '/uploads/manual_input.txt';
    }

    // Call modular NLP resume parsing service
    const parseResult = await parseResume(fileBuffer, mimeType, originalName);

    // If user is candidate, update or create their profile
    let profile;
    if (req.user) {
      profile = await CandidateProfile.findOne({ user: req.user.id });

      if (profile) {
        // Update existing profile
        profile.originalFileName = originalName;
        profile.fileUrl = fileUrl;
        profile.mimeType = mimeType;
        profile.fileSize = fileSize;
        profile.parsedData = parseResult.parsedData;
        profile.rawText = parseResult.rawText;
        profile.parsingMetadata = parseResult.parsingMetadata;
        await profile.save();
      } else {
        // Create new profile
        profile = await CandidateProfile.create({
          user: req.user.id,
          originalFileName: originalName,
          fileUrl: fileUrl,
          mimeType: mimeType,
          fileSize: fileSize,
          parsedData: parseResult.parsedData,
          rawText: parseResult.rawText,
          parsingMetadata: parseResult.parsingMetadata,
        });
      }
    } else {
      // Standalone upload
      profile = await CandidateProfile.create({
        originalFileName: originalName,
        fileUrl: fileUrl,
        mimeType: mimeType,
        fileSize: fileSize,
        parsedData: parseResult.parsedData,
        rawText: parseResult.rawText,
        parsingMetadata: parseResult.parsingMetadata,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume parsed and analyzed successfully by AI NLP Engine.',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current candidate's profile
// @route   GET /api/resume/my-profile
// @access  Private (Candidate)
exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No resume profile found yet. Please upload a resume.',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate profile by ID (for Recruiter)
// @route   GET /api/resume/:id
// @access  Private (Recruiter)
exports.getProfileById = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findById(req.params.id).populate('user', 'name email phone avatar');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update parsed profile details manually
// @route   PUT /api/resume/my-profile
// @access  Private (Candidate)
exports.updateMyProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No profile found to update. Please upload a resume first.',
      });
    }

    if (req.body.parsedData) {
      profile.parsedData = { ...profile.parsedData.toObject(), ...req.body.parsedData };
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Candidate profile updated successfully.',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
