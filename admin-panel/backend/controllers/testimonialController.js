const Testimonial = require('../models/Testimonial');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

const normaliseTestimonialPayload = (payload) => {
  const rating = Number(payload.rating);
  const order = Number(payload.order);

  return {
    clientName: payload.clientName?.trim(),
    company: payload.company?.trim(),
    role: payload.role?.trim() || 'Executive',
    content: payload.content?.trim(),
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 5,
    avatar: payload.avatar || '',
    status: ['active', 'inactive'].includes(payload.status) ? payload.status : 'active',
    order: Number.isFinite(order) && order >= 0 ? order : 0
  };
};

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
    const itemData = normaliseTestimonialPayload(req.body);

    if (!itemData.clientName || !itemData.company || !itemData.content) {
      return res.status(400).json({
        success: false,
        message: 'Client name, company, and testimonial content are required.'
      });
    }

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
    const itemData = normaliseTestimonialPayload(req.body);

    if (!itemData.clientName || !itemData.company || !itemData.content) {
      return res.status(400).json({
        success: false,
        message: 'Client name, company, and testimonial content are required.'
      });
    }
    let updated = null;

    if (getIsFallbackMode()) {
      updated = await datastore.findByIdAndUpdate('testimonials', id, itemData);
    } else {
      updated = await Testimonial.findByIdAndUpdate(id, itemData, { new: true, runValidators: true });
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
