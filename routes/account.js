const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {authenticateJWT } = require('../config/auth');
const router = express.Router();


router.get('/calendar', authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('publications');
      res.render('calendar', { user });
    } catch (err) {
      req.flash('error', 'Could not fetch user information');
      res.redirect('/publications');
    }
  });
  

module.exports = router;
