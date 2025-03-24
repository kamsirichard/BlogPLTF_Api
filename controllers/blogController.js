const Blog = require('../models/Blog');

exports.addComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id; // Assuming you get user ID from the token

        // Find the blog post
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog post not found' });

        // Add comment
        blog.comments.push({ user: userId, comment });
        await blog.save();

        res.status(201).json({ message: 'Comment added successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
