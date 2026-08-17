const Contact = require('../models/Contact');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

// @desc    Submit new contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.'
      });
    }

    const contactData = {
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      company: company || '',
      subject,
      message,
      status: 'unread',
      notes: ''
    };

    let newContact = null;
    if (getIsFallbackMode()) {
      newContact = await datastore.create('contacts', contactData);
    } else {
      newContact = await Contact.create(contactData);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. Our team will contact you shortly.',
      data: {
        id: newContact._id || newContact.id,
        createdAt: newContact.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact enquiries
// @route   GET /api/contact
// @access  Private (Admin)
const getContacts = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let contacts = [];

    if (getIsFallbackMode()) {
      let query = {};
      if (status && status !== 'all') query.status = status;

      contacts = await datastore.find('contacts', query);
      if (search) {
        const s = search.toLowerCase();
        contacts = contacts.filter(item =>
          item.name.toLowerCase().includes(s) ||
          item.email.toLowerCase().includes(s) ||
          item.subject.toLowerCase().includes(s) ||
          (item.company && item.company.toLowerCase().includes(s))
        );
      }
      contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      let dbQuery = {};
      if (status && status !== 'all') dbQuery.status = status;
      if (search) {
        dbQuery.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } }
        ];
      }
      contacts = await Contact.find(dbQuery).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact enquiry
// @route   GET /api/contact/:id
// @access  Private (Admin)
const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let contact = null;

    if (getIsFallbackMode()) {
      contact = await datastore.findById('contacts', id);
    } else {
      contact = await Contact.findById(id);
    }

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status or notes
// @route   PUT /api/contact/:id
// @access  Private (Admin)
const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    let updated = null;
    if (getIsFallbackMode()) {
      updated = await datastore.findByIdAndUpdate('contacts', id, updateData);
    } else {
      updated = await Contact.findByIdAndUpdate(id, updateData, { new: true });
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact enquiry
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (getIsFallbackMode()) {
      deleted = await datastore.findByIdAndDelete('contacts', id);
    } else {
      deleted = await Contact.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact, getContacts, getContactById, updateContact, deleteContact };
