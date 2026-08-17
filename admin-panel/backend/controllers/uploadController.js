// @desc    Upload an image file
// @route   POST /api/upload
// @access  Private (Admin)
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please select an image file to upload'
    });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename
  });
};

module.exports = { uploadImage };
