const router = require('express').Router();
const Post = require('../models/Post');

// GET all posts for the Public Feed
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// CREATE a post (Text, Image, or Both)
router.post('/', async (req, res) => {
  const newPost = new Post(req.body); 
  await newPost.save();
  res.json(newPost);
});

// LIKE a post
router.post('/:id/like', async (req, res) => {
  const post = await Post.findById(req.params.id);
  // Simple logic: add userId to likes array
  post.likes.push(req.body.userId); 
  await post.save();
  res.json(post);
});

module.exports = router;