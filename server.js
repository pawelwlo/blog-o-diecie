const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./blog-dieta-68ca8-firebase-adminsdk-803k0-b26b6cd3a7.json'); // Update with your service account key path

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://blog-dieta-68ca8.appspot.com', // Replace with your Firebase Storage bucket URL
});

// Create a storage bucket reference
const bucket = admin.storage().bucket();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/uploads', upload.single('image'), async (req, res) => {
  try {
    // Get file from multer
    const file = req.file;

    // Generate a unique filename or use the original name
    const fileName = Date.now() + '-' + file.originalname;

    // Upload file to Firebase Storage
    await bucket.file(fileName).createWriteStream().end(file.buffer);

    // Get download URL
    const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Return the download URL in the response
    res.json({
      path: downloadUrl,
      size: file.size,
      dateModified: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
