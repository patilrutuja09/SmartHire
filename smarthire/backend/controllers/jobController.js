const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc   Create a job (recruiter only)
// @route  POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    const { title, description, company, location, jobType, skillsRequired, salaryRange, experienceRequired } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: 'Title, description, company and location are required' });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      jobType,
      salaryRange,
      experienceRequired,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : (skillsRequired || '').split(',').map((s) => s.trim()).filter(Boolean),
      recruiter: req.user._id,
    });

    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all open jobs (with search/filter) - public/candidate view
// @route  GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, status } = req.query;
    const query = {};

    if (status) query.status = status;
    else query.status = 'open';

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { skillsRequired: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;

    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate('recruiter', 'name company');
    res.json({ jobs, count: jobs.length });
  } catch (err) {
    next(err);
  }
};

// @desc   Get jobs posted by the logged-in recruiter
// @route  GET /api/jobs/my-jobs
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicantCount };
      })
    );

    res.json({ jobs: jobsWithCounts });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single job
// @route  GET /api/jobs/:id
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc   Update job (owner recruiter only)
// @route  PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    const fields = ['title', 'description', 'company', 'location', 'jobType', 'salaryRange', 'experienceRequired', 'status'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });
    if (req.body.skillsRequired) {
      job.skillsRequired = Array.isArray(req.body.skillsRequired)
        ? req.body.skillsRequired
        : req.body.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }

    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete job (owner recruiter only)
// @route  DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, getJobs, getMyJobs, getJobById, updateJob, deleteJob };
