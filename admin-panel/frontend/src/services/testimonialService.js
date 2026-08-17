import { request } from './api';

export const testimonialService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/testimonials${query ? `?${query}` : ''}`);
    return res.data || [];
  },

  create: async (itemData) => {
    return await request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  },

  update: async (id, itemData) => {
    return await request(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  },

  delete: async (id) => {
    return await request(`/testimonials/${id}`, {
      method: 'DELETE'
    });
  }
};

export default testimonialService;
