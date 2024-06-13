// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const errorHandler = require('./middleware/errorHandler');
const security = require('./middleware/security');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

security(app); // Assuming security middleware sets up security measures

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/pdfs', pdfRoutes);

// Error handler middleware
app.use(errorHandler);

// MongoDB connection
const mongoURI = process.env.MONGO_URI; // Ensure you have .env file with MONGO_URI defined
mongoose.connect(mongoURI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
