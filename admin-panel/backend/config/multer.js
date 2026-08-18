const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg|gif|mp4|webm|ogg/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files (.jpg, .png, .webp, .svg, .gif, .mp4, .webm, .ogg) are allowed!'));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for product videos
  fileFilter: fileFilter
});

module.exports = upload;
