import { request } from './api';

export const contactService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/contact${query ? `?${query}` : ''}`);
    return res.data || [];
  },

  getById: async (id) => {
    const res = await request(`/contact/${id}`);
    return res.data;
  },

  updateStatus: async (id, status, notes) => {
    return await request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },

  delete: async (id) => {
    return await request(`/contact/${id}`, {
      method: 'DELETE'
    });
  }
};

export default contactService;
