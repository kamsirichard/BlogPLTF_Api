const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth'); // Middleware to verify users
const router = express.Router();

// Create a new blog post (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const blog = new Blog({ ...req.body, author: req.user.userId });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a blog post (Only the author can edit)
router.put('/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        Object.assign(blog, req.body);
        await blog.save();
        res.json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a blog post (Only the author can delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await blog.deleteOne();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all blog posts (Public route)
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
