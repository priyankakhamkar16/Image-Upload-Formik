const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer'); // Add multer for handling file uploads

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Priyanka123:Mongodb162001@cluster0.j9fjj2f.mongodb.net/?authMechanism=DEFAULT', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors({
  origin: 'https://image-upload-formik-bnf2.vercel.app', // Replace this with your frontend URL
  optionsSuccessStatus: 200,
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image Schema
const imageSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
});

const Image = mongoose.model('Image', imageSchema);

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images' });
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new Image({
      filename: req.file.filename,
      originalname: req.file.originalname,
    });

    await image.save();
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
