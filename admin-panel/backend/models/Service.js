const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Service slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'Code'
  },
  image: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required']
  },
  capabilities: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
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

module.exports = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
