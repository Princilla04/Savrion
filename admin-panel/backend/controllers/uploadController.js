const { uploadToCloudStorage } = require('../config/storage');
const fs = require('fs');
const path = require('path');

/** Stores uploads locally only when running outside of production. */
const saveLocalUpload = (file) => {
  const uploadDirectory = path.join(__dirname, '../uploads');
  fs.mkdirSync(uploadDirectory, { recursive: true });
  const extension = path.extname(file.originalname).toLowerCase();
  const filename = `savrion-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  fs.writeFileSync(path.join(uploadDirectory, filename), file.buffer);
  return { url: `/uploads/${filename}`, filename };
};

// @desc    Upload an image or video file
// @route   POST /api/upload
// @access  Private (Admin)
const uploadMedia = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please select a media file to upload'
    });
  }

  try {
    const cloudUrl = await uploadToCloudStorage(req.file);
    if (!cloudUrl && process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Cloud Storage is not configured for production uploads.' });
    }
    const localUpload = cloudUrl ? null : saveLocalUpload(req.file);
    const fileUrl = cloudUrl || localUpload.url;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: localUpload?.filename || req.file.originalname
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadMedia };
