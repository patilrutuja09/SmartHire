const User = require('../models/User');
const Application = require('../models/Application');

// @desc   Update own candidate profile
// @route  PUT /api/candidates/profile
const updateProfile = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.user._id);
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can update this profile' });
    }

    const fields = ['name', 'phone', 'education', 'experience'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) candidate[f] = req.body[f];
    });
    if (req.body.skills) {
      candidate.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    await candidate.save();
    res.json({ user: candidate.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc   Upload / attach resume URL & filename to candidate profile
// @route  POST /api/candidates/resume
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No resume file uploaded' });

    const candidate = await User.findById(req.user._id);
    candidate.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    candidate.resumeFileName = req.file.originalname;
    await candidate.save();

    res.json({ resumeUrl: candidate.resumeUrl, resumeFileName: candidate.resumeFileName });
  } catch (err) {
    next(err);
  }
};

// @desc   Recruiter: search & filter candidates
// @route  GET /api/candidates
const searchCandidates = async (req, res, next) => {
  try {
    const { search, skill } = req.query;
    const query = { role: 'candidate' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { education: { $regex: search, $options: 'i' } },
      ];
    }
    if (skill) query.skills = { $regex: skill, $options: 'i' };

    const candidates = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ candidates, count: candidates.length });
  } catch (err) {
    next(err);
  }
};

// @desc   Recruiter dashboard summary stats
// @route  GET /api/candidates/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const Job = require('../models/Job');
    const totalJobs = await Job.countDocuments({ recruiter: req.user._id });
    const openJobs = await Job.countDocuments({ recruiter: req.user._id, status: 'open' });
    const totalApplications = await Application.countDocuments({ recruiter: req.user._id });
    const shortlisted = await Application.countDocuments({ recruiter: req.user._id, status: 'shortlisted' });
    const rejected = await Application.countDocuments({ recruiter: req.user._id, status: 'rejected' });
    const hired = await Application.countDocuments({ recruiter: req.user._id, status: 'hired' });

    res.json({ totalJobs, openJobs, totalApplications, shortlisted, rejected, hired });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateProfile, uploadResume, searchCandidates, getDashboardStats };
