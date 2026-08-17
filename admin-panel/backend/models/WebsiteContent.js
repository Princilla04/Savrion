const mongoose = require('mongoose');

const WebsiteContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global_content'
  },
  hero: {
    badge: { type: String, default: 'Next-Generation Software Engineering' },
    title: { type: String, default: 'Architecting Intelligent Software Solutions for Global Enterprises' },
    subtitle: { type: String, default: 'Savrion empowers market leaders with high-performance web applications, scalable cloud infrastructure, custom software engineering, and intelligent digital systems.' },
    primaryCtaText: { type: String, default: 'Get In Touch' },
    primaryCtaLink: { type: String, default: '/contact' },
    secondaryCtaText: { type: String, default: 'Explore Services' },
    secondaryCtaLink: { type: String, default: '/services' }
  },
  about: {
    title: { type: String, default: 'Engineering the Future of Digital Innovation' },
    description: { type: String, default: 'Savrion is a premier software solutions and technology services firm dedicated to transforming ambitious ideas into secure, scalable, and high-impact digital products.' },
    mission: { type: String, default: 'To empower organizations worldwide with state-of-the-art software systems, cloud technologies, and exceptional engineering expertise.' },
    vision: { type: String, default: 'To be the most trusted technology innovation partner for businesses navigating the digital era.' },
    coreValues: [{
      title: { type: String },
      description: { type: String }
    }]
  },
  company: {
    name: { type: String, default: 'Savrion' },
    tagline: { type: String, default: 'Empowering Businesses Through Advanced Software Solutions' },
    email: { type: String, default: 'contact@savrion.com' },
    phone: { type: String, default: '+1 (800) 555-0199' },
    address: { type: String, default: '100 Cyber Tower, Innovation Boulevard, Suite 500, Tech City' },
    socials: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' }
    }
  },
  stats: [{
    label: { type: String },
    value: { type: String },
    description: { type: String }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.models.WebsiteContent || mongoose.model('WebsiteContent', WebsiteContentSchema);
