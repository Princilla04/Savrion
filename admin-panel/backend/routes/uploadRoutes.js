const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadMedia } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('file'), uploadMedia);

module.exports = router;
