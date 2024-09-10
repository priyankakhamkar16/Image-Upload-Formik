const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Initialize the app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow cross-origin requests
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define image schema and model
const imageSchema = new mongoose.Schema({
  originalname: String,
  filename: String,
  path: String,
  mimetype: String,
  size: Number
});

const Image = mongoose.model('Image', imageSchema);

// Configure Multer for file uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Route for uploading images
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new Image({
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route for fetching images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
