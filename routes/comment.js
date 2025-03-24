const express = require('express');
const { addComment } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware'); // Ensure token authentication

const router = express.Router();

// Add a comment (Protected)
router.post('/:blogId/comments', auth, async (req, res) => {
    try {
        const { blogId } = req.params;
        const { comment } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const newComment = {
            user: req.user.userId, // Authenticated user
            comment,
            createdAt: new Date(),
        };

        blog.comments.push(newComment);
        await blog.save();

        res.status(201).json({ message: 'Comment added', comment: newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a comment (Only the author of the comment can delete it)
router.delete('/:blogId/comments/:commentId', auth, async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const commentIndex = blog.comments.findIndex(
            (c) => c._id.toString() === commentId && c.user.toString() === req.user.userId
        );

        if (commentIndex === -1) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        blog.comments.splice(commentIndex, 1);
        await blog.save();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
