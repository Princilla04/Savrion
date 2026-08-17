const Testimonial = require('../models/Testimonial');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public / Admin
const getTestimonials = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    let testimonials = [];

    if (getIsFallbackMode()) {
      testimonials = await datastore.find('testimonials', query);
      testimonials.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
      testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
const createTestimonial = async (req, res, next) => {
  try {
    const { clientName, company, role, content, rating, avatar, status, order } = req.body;

    if (!clientName || !company || !content) {
      return res.status(400).json({
        success: false,
        message: 'Client name, company, and testimonial content are required.'
      });
    }

    const itemData = {
      clientName,
      company,
      role: role || 'Executive',
      content,
      rating: rating ? Number(rating) : 5,
      avatar: avatar || '',
      status: status || 'active',
      order: order ? Number(order) : 0
    };

    let newItem = null;
    if (getIsFallbackMode()) {
      newItem = await datastore.create('testimonials', itemData);
    } else {
      newItem = await Testimonial.create(itemData);
    }

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated = null;

    if (getIsFallbackMode()) {
      updated = await datastore.findByIdAndUpdate('testimonials', id, req.body);
    } else {
      updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (getIsFallbackMode()) {
      deleted = await datastore.findByIdAndDelete('testimonials', id);
    } else {
      deleted = await Testimonial.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
