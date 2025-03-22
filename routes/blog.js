const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const blog = new Blog({ ...req.body, author: req.user.userId });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
});

module.exports = router;
