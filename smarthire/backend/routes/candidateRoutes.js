const express = require('express');
const router = express.Router();
const { updateProfile, uploadResume, searchCandidates, getDashboardStats } = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/role');
const upload = require('../middleware/upload');

router.put('/profile', protect, authorize('candidate'), updateProfile);
router.post('/resume', protect, authorize('candidate'), upload.single('resume'), uploadResume);
router.get('/', protect, authorize('recruiter'), searchCandidates);
router.get('/dashboard-stats', protect, authorize('recruiter'), getDashboardStats);

module.exports = router;
