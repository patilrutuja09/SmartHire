const express = require('express');
const router = express.Router();
const { createJob, getJobs, getMyJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', getJobs);
router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;
