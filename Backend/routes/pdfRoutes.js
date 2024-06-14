const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

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

router.post('/upload', auth, upload.single('PDF'), async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('PDF');
    await collection.insertOne({
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`, // Assuming the server serves files from the 'uploads' directory
      uploadedAt: new Date(),
      userId: req.user.id,
    });
    res.status(200).send({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    await client.close();
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
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('PDF');
    const pdfs = await collection.find({ userId: req.params.userId }).toArray();

    res.json(pdfs);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to fetch PDFs for the logged-in user
router.get('/user/me', auth, async (req, res) => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('PDF');
    const pdfs = await collection.find({ userId: req.user.id }).toArray();
    res.json(pdfs);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to fetch individual PDF details
router.get('/:id', auth, async (req, res) => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('PDF');
    const pdf = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    res.json({ url: pdf.url }); // Send only the URL to the client
  } catch (err) {
    logger.error(err.message, { metadata: err });
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/pdf/:pdfId', auth, async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('PDF');
    const pdfId = req.params.pdfId;
    const pdf = await collection.findOne({ _id: new ObjectId(pdfId) });

    if (!pdf) {
      return res.status(404).send({ message: 'PDF not found' });
    }

    const file = path.resolve(__dirname, '../uploads', pdf.url);

    fs.readFile(file, (err, data) => {
      if (err) {
        console.error('Error reading PDF:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=' + path.basename(pdf.url));
      res.send(data);
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});
module.exports = router;
