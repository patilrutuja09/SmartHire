const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc   Candidate applies to a job
// @route  POST /api/applications/:jobId
const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ message: 'This job is no longer accepting applications' });

    const existing = await Application.findOne({ job: job._id, candidate: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already applied to this job' });

    const candidate = await User.findById(req.user._id);

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      recruiter: job.recruiter,
      resumeUrl: candidate.resumeUrl || req.body.resumeUrl,
      coverNote: req.body.coverNote,
    });

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
};

// @desc   Candidate: view own applications
// @route  GET /api/applications/my-applications
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .sort({ createdAt: -1 })
      .populate('job', 'title company location jobType status');
    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc   Recruiter: view applicants for a specific job
// @route  GET /api/applications/job/:jobId
const getApplicantsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: job._id })
      .sort({ createdAt: -1 })
      .populate('candidate', 'name email phone skills education experience resumeUrl');

    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc   Recruiter: view all applicants across all their jobs
// @route  GET /api/applications/all
const getAllApplicantsForRecruiter = async (req, res, next) => {
  try {
    const applications = await Application.find({ recruiter: req.user._id })
      .sort({ createdAt: -1 })
      .populate('candidate', 'name email phone skills education experience resumeUrl')
      .populate('job', 'title company');
    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc   Recruiter: update application status (shortlist/reject/hire)
// @route  PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['applied', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();
    res.json({ application });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  getAllApplicantsForRecruiter,
  updateApplicationStatus,
};
