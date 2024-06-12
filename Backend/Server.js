const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const errorHandler = require('./middleware/errorHandler');
const security = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

security(app);

app.use('/api/users', userRoutes);
app.use('/api/pdfs', pdfRoutes);

app.use(errorHandler);

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
