const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./userRoutes'); // assuming userRoutes.js is in the same directory
const pdfRoutes = require('./PDF'); // assuming pdf.js is in the same directory

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/pdfs', pdfRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});