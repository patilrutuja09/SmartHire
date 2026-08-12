const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc   Register a new user (recruiter or candidate)
// @route  POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, company, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (!['recruiter', 'candidate'].includes(role)) {
      return res.status(400).json({ message: 'Role must be recruiter or candidate' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role, company, phone });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get logged-in user profile
// @route  GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
