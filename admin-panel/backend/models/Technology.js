const mongoose = require('mongoose');

const TechnologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Technology name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Frontend', 'Backend', 'Mobile', 'Cloud', 'Database', 'DevOps', 'AI/ML', 'Other'],
    default: 'Frontend'
  },
  icon: {
    type: String,
    default: 'Layers'
  },
  logoUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 95
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

module.exports = mongoose.models.Technology || mongoose.model('Technology', TechnologySchema);
