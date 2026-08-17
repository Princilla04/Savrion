const Technology = require('../models/Technology');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

// @desc    Get all technologies
// @route   GET /api/technologies
// @access  Public / Admin
const getTechnologies = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    let query = {};
    if (status) query.status = status;
    if (category && category !== 'All') query.category = category;

    let technologies = [];

    if (getIsFallbackMode()) {
      technologies = await datastore.find('technologies', query);
      technologies.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
      technologies = await Technology.find(query).sort({ order: 1, name: 1 });
    }

    res.status(200).json({
      success: true,
      count: technologies.length,
      data: technologies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create technology
// @route   POST /api/technologies
// @access  Private (Admin)
const createTechnology = async (req, res, next) => {
  try {
    const { name, category, icon, logoUrl, description, proficiency, status, order } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Technology name and category are required.'
      });
    }

    const techData = {
      name,
      category,
      icon: icon || 'Cpu',
      logoUrl: logoUrl || '',
      description: description || '',
      proficiency: proficiency ? Number(proficiency) : 95,
      status: status || 'active',
      order: order ? Number(order) : 0
    };

    let newTech = null;
    if (getIsFallbackMode()) {
      newTech = await datastore.create('technologies', techData);
    } else {
      newTech = await Technology.create(techData);
    }

    res.status(201).json({
      success: true,
      message: 'Technology created successfully',
      data: newTech
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update technology
// @route   PUT /api/technologies/:id
// @access  Private (Admin)
const updateTechnology = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated = null;

    if (getIsFallbackMode()) {
      updated = await datastore.findByIdAndUpdate('technologies', id, req.body);
    } else {
      updated = await Technology.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Technology not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Technology updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete technology
// @route   DELETE /api/technologies/:id
// @access  Private (Admin)
const deleteTechnology = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (getIsFallbackMode()) {
      deleted = await datastore.findByIdAndDelete('technologies', id);
    } else {
      deleted = await Technology.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Technology not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Technology deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTechnologies, createTechnology, updateTechnology, deleteTechnology };
