const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateJWT } = require('../config/auth');
const router = express.Router();

// Function to generate JWT token
const generateAccessToken = (user, expiresIn) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });};


router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('users', { users });
});

router.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();
    req.flash('success', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    const errors = [];
    if (err.message.includes('username')) {
      errors.push({ msg: 'Username is already taken' });
    }
    if (err.message.includes('email')) {
      errors.push({ msg: 'Email is already registered' });
    }
    res.render('register', { errors });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { errors: req.flash('error') });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Email not registered');
      return res.redirect('/users/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid password');
      return res.redirect('/users/login');
    }

    const rememberMe = req.body.remember_me === 'true';
    const tokenExpiration = rememberMe ? process.env.TOKEN_EXPIRATION_LONG : process.env.TOKEN_EXPIRATION_SHORT;
    const expiresInDays = parseInt(tokenExpiration);
    const expiresIn = `${expiresInDays}d`;

    const token = generateAccessToken(user, expiresIn);

    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', expiresIn });
    res.redirect('/publications');
  } catch (err) {
    console.log(err);
    req.flash('error', 'An error occurred during login');
    res.redirect('/users/login');
  }
});


router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.log(err);
    }
    req.flash('success', 'You have been logged out');
    res.redirect('/users/login');
  });
});

module.exports = router;
module.exports.authenticateJWT = authenticateJWT;
