const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rule_holiday_super_secret_jwt_key_2026_!@#', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// In-memory fallback user store when MongoDB is offline
const inMemoryUsers = [];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    let user;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      user = await User.create({
        name,
        email,
        password,
        phone: phone || ''
      });
    } catch (dbErr) {
      console.warn('MongoDB offline, using in-memory user registration fallback');
      const existing = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      user = {
        _id: 'mem_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password,
        phone: phone || '',
        role: 'user'
      };
      inMemoryUsers.push(user);
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user;
    let isMatch = false;

    try {
      user = await User.findOne({ email }).select('+password');
      if (user) {
        isMatch = await user.matchPassword(password);
      }
    } catch (dbErr) {
      console.warn('MongoDB offline, checking in-memory user login fallback');
      user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && user.password === password) {
        isMatch = true;
      }
    }

    if (user && isMatch) {
      const token = generateToken(user._id);
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
