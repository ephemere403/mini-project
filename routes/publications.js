const express = require('express');
const Publication = require('../models/publication');
const {authenticateJWT } = require('../config/auth');
const router = express.Router();

const getIO = (req, res, next) => {
  try {
    req.io = require('../socket').getIO();
    next();
  } catch (error) {
    console.error(error);
  }
};

router.get('/coingecko', authenticateJWT, async (req, res) => {
  try {
    res.render('coingecko');
  } catch (err) {
    req.flash('error', 'Could not fetch coingecko page');
    res.redirect('/');
  }
});

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const publications = await Publication.find().populate('author');
    res.render('publications', { publications, errors: req.flash('error'), success: req.flash('success') });
  } catch (err) {
    req.flash('error', 'Could not fetch publications');
    res.redirect('/');
  }
});

router.get('/new', authenticateJWT, (req, res) => {
  res.render('new_publication', { errors: req.flash('error') });
});

  router.post('/new', authenticateJWT, getIO, async (req, res) => {
    const { title, content } = req.body;
    const author = req.user.id;
  const publication = new Publication({ title, author, content });
  try {
    await publication.save();
    req.io.emit('new_publication', publication);
    req.flash('success', 'Publication created successfully');
    res.redirect('/publications');
  } catch (err) {
    console.log(err);
    req.flash('error', 'Could not create publication');
    res.redirect('/publications/new');
  }
});


module.exports = router;
