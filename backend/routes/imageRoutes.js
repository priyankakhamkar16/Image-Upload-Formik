const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route to handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
      contentType: req.file.mimetype,
    });
    await image.save();
    res.json({ message: 'Image uploaded successfully', image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
