const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { MongoClient } = require('mongodb');
const auth = require('./auth'); // assuming auth.js is in the same directory

cloudinary.config({
  cloud_name: 'dgbidm8vv',
  api_key: '622325385243675',
  api_secret: 'r7dMSpvrhStWx6o9lPXGs6LjqVc'
});

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  }
});

const router = express.Router();

router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw'
    });

    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('pdfs');
    await collection.insertOne({
      filename: req.file.originalname,
      url: result.url,
      uploadedAt: new Date(),
      userId: req.user.id
    });

    res.json({ msg: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/user/:userId/pdfs', auth, async (req, res) => {
    try {
      const client = new MongoClient(process.env.MONGODB_URL);
      await client.connect();
      const db = client.db('test');
      const collection = db.collection('pdfs');
      const pdfs = await collection.find({ userId: req.params.userId }).toArray();
  
      res.json(pdfs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;