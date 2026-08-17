import { request } from './api';

export const contentService = {
  // Website global content (hero, about, stats, socials)
  getWebsiteContent: async () => {
    try {
      const res = await request('/website-content');
      return res.data;
    } catch (err) {
      console.warn('Using fallback website content');
      return null;
    }
  },

  // Services
  getServices: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/services${query ? `?${query}` : ''}`);
      return res.data || [];
    } catch (err) {
      console.warn('Using fallback services');
      return [];
    }
  },

  getServiceBySlug: async (slug) => {
    try {
      const res = await request(`/services/${slug}`);
      return res.data;
    } catch (err) {
      console.warn(`Failed to fetch service ${slug}`);
      return null;
    }
  },

  // Projects
  getProjects: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/projects${query ? `?${query}` : ''}`);
      return res.data || [];
    } catch (err) {
      console.warn('Using fallback projects');
      return [];
    }
  },

  getProjectBySlug: async (slug) => {
    try {
      const res = await request(`/projects/${slug}`);
      return res.data;
    } catch (err) {
      console.warn(`Failed to fetch project ${slug}`);
      return null;
    }
  },

  // Technologies
  getTechnologies: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/technologies${query ? `?${query}` : ''}`);
      return res.data || [];
    } catch (err) {
      console.warn('Using fallback technologies');
      return [];
    }
  },

  // Testimonials
  getTestimonials: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/testimonials${query ? `?${query}` : ''}`);
      return res.data || [];
    } catch (err) {
      console.warn('Using fallback testimonials');
      return [];
    }
  }
};

export default contentService;
