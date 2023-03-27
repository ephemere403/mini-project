const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateJWT } = require('../config/auth');
const router = express.Router();

// Function to generate JWT token
function generateAccessToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}


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

router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/users/login');
    }
    req.login(user, async (err) => {
      if (err) {
        return next(err);
      }
      const token = generateAccessToken(user);
      res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      console.log("TOKEN:"+token);
      return res.redirect('/publications');
    });
  })(req, res, next);
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
