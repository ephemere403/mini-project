const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs')

const router = express.Router();

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
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcryptjs
    const user = new User({ username, email, password: hashedPassword }); // Save the hashed password

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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/publications',
  failureRedirect: '/users/login',
  failureFlash: true
}));

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
