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

// File storage setup with multer
const upload = multer({ dest: 'uploads/' });

// Image compression route
app.post('/compress', upload.single('image'), async (req, res) => {
  try {
    const { compressionLevel, format, width, height } = req.body;
    const outputPath = `optimized/${Date.now()}_optimized.${format}`;

    await sharp(req.file.path)
      .resize(parseInt(width), parseInt(height)) // Resize
      .toFormat(format) // Convert to the selected format
      .jpeg({ quality: parseInt(compressionLevel) }) // Compress image
      .toFile(outputPath);

    // Remove original uploaded file
    fs.unlinkSync(req.file.path);

    // Return download link
    res.json({ downloadLink: `/${outputPath}` });
  } catch (error) {
    res.status(500).json({ message: 'Error compressing image' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});