const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Project slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  client: {
    type: String,
    default: 'Confidential Enterprise Client'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  bannerImage: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  shortDescription: {
    type: String,
    required: [true, 'Short description is required']
  },
  problem: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  results: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  liveUrl: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
