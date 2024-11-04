const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.static('public')); // Serve static frontend files from 'public'
app.use('/optimized', express.static(path.join(__dirname, 'optimized'))); // Serve optimized images

// Ensure 'optimized' folder exists
if (!fs.existsSync(path.join(__dirname, 'optimized'))) {
  fs.mkdirSync(path.join(__dirname, 'optimized'));
}

// File storage setup with multer
const upload = multer({ dest: 'uploads/' });

// Image compression route
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
      const { compressionLevel, format, width, height } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }
      if (!compressionLevel || !format) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const outputPath = path.join(__dirname, 'optimized', `${Date.now()}_optimized.${format}`);
      const image = sharp(req.file.path);
  
      if (width || height) {
        image.resize(parseInt(width) || null, parseInt(height) || null);
      }
  
      switch (format) {
        case 'jpeg':
          image.jpeg({ quality: parseInt(compressionLevel) });
          break;
        case 'png':
          image.png({ quality: parseInt(compressionLevel) });
          break;
        case 'webp':
          image.webp({ quality: parseInt(compressionLevel) });
          break;
        default:
          return res.status(400).json({ message: 'Invalid format' });
      }
  
      await image.toFile(outputPath);
      fs.unlinkSync(req.file.path);
  
      // Constructing the full download link
      const baseUrl = `${req.protocol}://${req.get('host')}/optimized/${path.basename(outputPath)}`;
      console.log("Output Path:", outputPath);
      console.log("Download Link:", baseUrl);
      
      res.json({ downloadLink: baseUrl });
    } catch (error) {
      console.error("Error compressing image:", error);
      res.status(500).json({ message: 'Error compressing image' });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});