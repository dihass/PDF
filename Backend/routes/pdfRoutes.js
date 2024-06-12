const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { MongoClient } = require('mongodb');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
    });

    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('pdfs');
    await collection.insertOne({
      filename: req.file.originalname,
      url: result.url,
      uploadedAt: new Date(),
      userId: req.user.id,
    });

    res.json({ msg: 'File uploaded successfully' });
  } catch (err) {
    logger.error(err.message, { metadata: err });
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:userId/pdfs', auth, [
  check('userId', 'Invalid user ID').isMongoId()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('pdfs');
    const pdfs = await collection.find({ userId: req.params.userId }).toArray();

    res.json(pdfs);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
