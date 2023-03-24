const express = require('express');
const Publication = require('../models/publication');
const router = express.Router();

router.get('/', async (req, res) => {
  const publications = await Publication.find().populate('author');
  const messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  res.render('index', { user: req.user, publications, messages });
});

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.log(err);
    }
    req.flash('success', 'You have been logged out');
    res.redirect('/index');
  });
});


module.exports = router;
