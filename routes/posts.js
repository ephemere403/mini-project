const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const path = require('path');

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../lenta.html'));
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
