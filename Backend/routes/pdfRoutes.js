const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Initialize Firebase
var serviceAccount = require("../path/to/your/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "pdf-mern.appspot.com"
});

const bucket = admin.storage().bucket();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/', auth, upload.single('pdf'), async (req, res) => {
  try {
    // Upload the PDF to Firebase Storage
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      throw new Error('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', async () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // Save the metadata to MongoDB
      const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      const collection = client.db("test").collection("PDF");
      await collection.insertOne({ filename: req.file.originalname, url: publicUrl });

      res.status(200).send({ filename: req.file.originalname, url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;