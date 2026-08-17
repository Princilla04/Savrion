const WebsiteContent = require('../models/WebsiteContent');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

// @desc    Get website content
// @route   GET /api/website-content
// @access  Public
const getContent = async (req, res, next) => {
  try {
    let content = null;

    if (getIsFallbackMode()) {
      content = await datastore.findOne('content', { key: 'global_content' });
    } else {
      content = await WebsiteContent.findOne({ key: 'global_content' });
    }

    if (!content) {
      // Default fallback structure
      content = {
        key: 'global_content',
        hero: {
          badge: 'Next-Generation Software Engineering',
          title: 'Architecting Intelligent Software Solutions for Global Enterprises',
          subtitle: 'Savrion empowers market leaders with high-performance web applications, scalable cloud infrastructure, custom software engineering, and intelligent digital systems.',
          primaryCtaText: 'Get In Touch',
          primaryCtaLink: '/contact',
          secondaryCtaText: 'Explore Services',
          secondaryCtaLink: '/services'
        },
        about: {
          title: 'Engineering the Future of Digital Innovation',
          description: 'Savrion is a premier software solutions and technology services firm dedicated to transforming ambitious ideas into secure, scalable, and high-impact digital products.',
          mission: 'To empower organizations worldwide with state-of-the-art software systems, cloud technologies, and exceptional engineering expertise.',
          vision: 'To be the most trusted technology innovation partner for businesses navigating the digital era.',
          coreValues: [
            { title: 'Engineering Excellence', description: 'Upholding uncompromising standards of code quality, scalability, and security.' },
            { title: 'Client-Centric Agility', description: 'Delivering tailored software solutions aligned strictly with enterprise goals.' },
            { title: 'Continuous Innovation', description: 'Adopting bleeding-edge frameworks, AI integrations, and cloud architectures.' }
          ]
        },
        company: {
          name: 'Savrion',
          tagline: 'Empowering Businesses Through Advanced Software Solutions',
          email: 'contact@savrion.com',
          phone: '+1 (800) 555-0199',
          address: '100 Cyber Tower, Innovation Boulevard, Suite 500, Tech City',
          socials: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        },
        stats: [
          { label: 'Projects Delivered', value: '150+', description: 'Across 18+ industries worldwide' },
          { label: 'Client Satisfaction', value: '99.4%', description: 'Net promoter score rating' },
          { label: 'Expert Engineers', value: '45+', description: 'Specialized architects and developers' },
          { label: 'System Uptime SLA', value: '99.99%', description: 'Enterprise reliability guarantee' }
        ]
      };
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website content
// @route   PUT /api/website-content
// @access  Private (Admin)
const updateContent = async (req, res, next) => {
  try {
    const updateData = { ...req.body, key: 'global_content' };
    let updated = null;

    if (getIsFallbackMode()) {
      const existing = await datastore.findOne('content', { key: 'global_content' });
      if (existing) {
        updated = await datastore.findByIdAndUpdate('content', existing._id || existing.id, updateData);
      } else {
        updated = await datastore.create('content', updateData);
      }
    } else {
      updated = await WebsiteContent.findOneAndUpdate(
        { key: 'global_content' },
        updateData,
        { new: true, upsert: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Website content updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getContent, updateContent };
