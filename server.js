const express = require('express');
const connectDB = require('./src/config/db'); // Ensure this file exists
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/userRoutes'); // Updated path

require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes); // Ensure this matches your frontend calls

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Blog Platform API!');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
