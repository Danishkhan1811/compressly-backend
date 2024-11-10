# Compressly

## Description
Compressly is an image compression web app that allows users to upload images and compress them using various formats (JPEG, PNG, WebP) and compression levels. The optimized images are stored on the server and can be downloaded via a generated link.

## Table of Contents
- [Usage](#usage)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)

## Usage
Uploading and Compressing an Image
To compress an image, send a POST request to /compress with the following form data:
- image: The image file to be compressed (required).
- compressionLevel: The quality level for compression (1-100, required).
- format: The desired output format (jpeg, png, or webp, required).
- width: Optional width for resizing.
- height: Optional height for resizing.

## Installation

To set up the Image Compression API locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>

2. Navigate to the project directory:
   ```bash
   cd <project-directory>

3. Install the required dependencies:
   ```bash
   npm install

4. Start the server:
   ```bash
   npm start

## API Endpoints
POST /compress: Uploads an image for compression.
- Request Body: Form data with image, compressionLevel, format, width, and height.
GET /download/:filename: Downloads the compressed image.
- URL Parameter: filename - The name of the compressed image file.

  ## Example
  Example using curl
  ```bash
    curl -X POST http://localhost:5000/compress \
      -F "image=@path/to/your/image.jpg" \
      -F "compressionLevel=80" \
      -F "format=jpeg" \
      -F "width=800"

Downloading the Compressed Image
After successfully compressing an image, you will receive a JSON response containing a download link:
```bash
{
  "downloadLink": "https://your-server/download/filename"
}
