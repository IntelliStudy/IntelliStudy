// Express initialization
const express = require('express');
const cors = require('cors');

const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');

const PORT = process.env.PORT || 3000;

// Creattion of Express application
const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // Mount user routes
app.use('/api/auth', authRoutes); // Mount authentication routes

// Default route for handling invalid routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
