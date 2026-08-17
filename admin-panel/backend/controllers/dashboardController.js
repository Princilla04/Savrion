const Service = require('../models/Service');
const Project = require('../models/Project');
const Technology = require('../models/Technology');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

// @desc    Get dashboard metrics & stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    let stats = {
      servicesCount: 0,
      projectsCount: 0,
      technologiesCount: 0,
      testimonialsCount: 0,
      contactsTotal: 0,
      contactsUnread: 0,
      recentContacts: [],
      recentProjects: []
    };

    if (getIsFallbackMode()) {
      stats.servicesCount = await datastore.count('services');
      stats.projectsCount = await datastore.count('projects');
      stats.technologiesCount = await datastore.count('technologies');
      stats.testimonialsCount = await datastore.count('testimonials');
      
      const allContacts = await datastore.find('contacts');
      stats.contactsTotal = allContacts.length;
      stats.contactsUnread = allContacts.filter(c => c.status === 'unread').length;
      
      stats.recentContacts = allContacts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const allProjects = await datastore.find('projects');
      stats.recentProjects = allProjects.slice(0, 4);
    } else {
      const [
        servicesCount,
        projectsCount,
        technologiesCount,
        testimonialsCount,
        contactsTotal,
        contactsUnread,
        recentContacts,
        recentProjects
      ] = await Promise.all([
        Service.countDocuments(),
        Project.countDocuments(),
        Technology.countDocuments(),
        Testimonial.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'unread' }),
        Contact.find().sort({ createdAt: -1 }).limit(5),
        Project.find().sort({ createdAt: -1 }).limit(4)
      ]);

      stats = {
        servicesCount,
        projectsCount,
        technologiesCount,
        testimonialsCount,
        contactsTotal,
        contactsUnread,
        recentContacts,
        recentProjects
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
