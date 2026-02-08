const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
// --- CRITICAL FIX FOR IMAGES ---
// Increase the limit to 50MB so phone photos can be uploaded
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// -------------------------------

// Models (Defined in Step 2 of previous turn)
const User = require("./models/User");
const Post = require("./models/Post");

// --- API ROUTES ---

// 1. Fetch Feed (Public)
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Create Post
app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// 3. Like Toggle
app.post("/api/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { userId } = req.body;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json(err);
  }
});
// 1. Signup Route
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // In a real app, hash password here. For this sprint, we store as-is.
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: "User already exists or data invalid" });
  }
});

// 2. Login Route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    res.json(user); // Send user details back to frontend
  } catch (err) {
    res.status(500).json(err);
  }
});
// Add a Comment to a Post
app.post('/api/posts/:id/comment', async (req, res) => {
    try {
        const { username, text } = req.body;
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = { username, text, createdAt: new Date() };
        post.comments.push(newComment);
        
        await post.save();
        res.json(post);
    } catch (err) { res.status(400).json(err); }
});
// --- SEARCH ROUTE ---
app.get('/api/users/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    // Search for users where username contains 'q' (case-insensitive)
    const users = await User.find({ 
      username: { $regex: q, $options: 'i' } 
    }).select('username _id email'); // Only send back safe info
    
    res.json(users);
  } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch((err) => console.log(err));
