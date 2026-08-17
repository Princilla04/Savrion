const Service = require('../models/Service');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

// Helper to generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public / Admin
const getServices = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.status = status;

    let services = [];

    if (getIsFallbackMode()) {
      services = await datastore.find('services', query);
      if (search) {
        const s = search.toLowerCase();
        services = services.filter(item => 
          item.title.toLowerCase().includes(s) || 
          item.shortDescription.toLowerCase().includes(s)
        );
      }
      services.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
      let dbQuery = status ? { status } : {};
      if (search) {
        dbQuery.$or = [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } }
        ];
      }
      services = await Service.find(dbQuery).sort({ order: 1, createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by slug or ID
// @route   GET /api/services/:identifier
// @access  Public
const getService = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let service = null;

    if (getIsFallbackMode()) {
      service = await datastore.findOne('services', { slug: identifier });
      if (!service) {
        service = await datastore.findById('services', identifier);
      }
    } else {
      service = await Service.findOne({ slug: identifier });
      if (!service && identifier.match(/^[0-9a-fA-F]{24}$/)) {
        service = await Service.findById(identifier);
      }
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with identifier '${identifier}'`
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res, next) => {
  try {
    const { title, shortDescription, detailedDescription, icon, image, capabilities, technologies, status, order } = req.body;

    if (!title || !shortDescription || !detailedDescription) {
      return res.status(400).json({
        success: false,
        message: 'Title, short description, and detailed description are required.'
      });
    }

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(title);

    const serviceData = {
      title,
      slug,
      icon: icon || 'Code',
      image: image || '',
      shortDescription,
      detailedDescription,
      capabilities: Array.isArray(capabilities) ? capabilities : (capabilities ? capabilities.split(',').map(s => s.trim()) : []),
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(s => s.trim()) : []),
      status: status || 'active',
      order: order ? Number(order) : 0
    };

    let newService = null;
    if (getIsFallbackMode()) {
      newService = await datastore.create('services', serviceData);
    } else {
      newService = await Service.create(serviceData);
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.title && !updateData.slug) {
      updateData.slug = slugify(updateData.title);
    } else if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
    }

    if (typeof updateData.capabilities === 'string') {
      updateData.capabilities = updateData.capabilities.split(',').map(s => s.trim());
    }
    if (typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(s => s.trim());
    }

    let updated = null;
    if (getIsFallbackMode()) {
      updated = await datastore.findByIdAndUpdate('services', id, updateData);
    } else {
      updated = await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (getIsFallbackMode()) {
      deleted = await datastore.findByIdAndDelete('services', id);
    } else {
      deleted = await Service.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getServices, getService, createService, updateService, deleteService };
