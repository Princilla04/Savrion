const express = require('express');
const router = express.Router();
const { createContact, getContacts, getContactById, updateContact, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createContact);
router.get('/', protect, getContacts);
router.get('/:id', protect, getContactById);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
