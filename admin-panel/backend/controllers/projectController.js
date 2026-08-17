const Project = require('../models/Project');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public / Admin
const getProjects = async (req, res, next) => {
  try {
    const { category, featured, status, search } = req.query;

    let projects = [];

    if (getIsFallbackMode()) {
      let query = {};
      if (status) query.status = status;
      if (category && category !== 'All') query.category = category;
      if (featured !== undefined) query.featured = featured === 'true';

      projects = await datastore.find('projects', query);
      if (search) {
        const s = search.toLowerCase();
        projects = projects.filter(item => 
          item.title.toLowerCase().includes(s) || 
          item.shortDescription.toLowerCase().includes(s) ||
          (item.technologies && item.technologies.some(t => t.toLowerCase().includes(s)))
        );
      }
      projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
      let dbQuery = {};
      if (status) dbQuery.status = status;
      if (category && category !== 'All') dbQuery.category = category;
      if (featured !== undefined) dbQuery.featured = featured === 'true';
      if (search) {
        dbQuery.$or = [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { technologies: { $regex: search, $options: 'i' } }
        ];
      }
      projects = await Project.find(dbQuery).sort({ order: 1, createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by slug or ID
// @route   GET /api/projects/:identifier
// @access  Public
const getProject = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let project = null;

    if (getIsFallbackMode()) {
      project = await datastore.findOne('projects', { slug: identifier });
      if (!project) {
        project = await datastore.findById('projects', identifier);
      }
    } else {
      project = await Project.findOne({ slug: identifier });
      if (!project && identifier.match(/^[0-9a-fA-F]{24}$/)) {
        project = await Project.findById(identifier);
      }
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with identifier '${identifier}'`
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res, next) => {
  try {
    const { 
      title, client, category, bannerImage, images, shortDescription, 
      problem, solution, results, features, technologies, liveUrl, featured, status, order 
    } = req.body;

    if (!title || !category || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and short description are required.'
      });
    }

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(title);

    const projectData = {
      title,
      slug,
      client: client || 'Global Enterprise Client',
      category,
      bannerImage: bannerImage || '',
      images: Array.isArray(images) ? images : (images ? images.split(',').map(s => s.trim()) : []),
      shortDescription,
      problem: problem || '',
      solution: solution || '',
      results: results || '',
      features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean).map(s => s.trim()) : []),
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(s => s.trim()) : []),
      liveUrl: liveUrl || '',
      featured: featured === true || featured === 'true',
      status: status || 'active',
      order: order ? Number(order) : 0
    };

    let newProject = null;
    if (getIsFallbackMode()) {
      newProject = await datastore.create('projects', projectData);
    } else {
      newProject = await Project.create(projectData);
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.title && !updateData.slug) {
      updateData.slug = slugify(updateData.title);
    } else if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
    }

    if (typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(s => s.trim());
    }
    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split('\n').filter(Boolean).map(s => s.trim());
    }
    if (typeof updateData.images === 'string') {
      updateData.images = updateData.images.split(',').map(s => s.trim());
    }

    let updated = null;
    if (getIsFallbackMode()) {
      updated = await datastore.findByIdAndUpdate('projects', id, updateData);
    } else {
      updated = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (getIsFallbackMode()) {
      deleted = await datastore.findByIdAndDelete('projects', id);
    } else {
      deleted = await Project.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
