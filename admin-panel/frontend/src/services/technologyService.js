import { request } from './api';

export const technologyService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/technologies${query ? `?${query}` : ''}`);
    return res.data || [];
  },

  create: async (techData) => {
    return await request('/technologies', {
      method: 'POST',
      body: JSON.stringify(techData)
    });
  },

  update: async (id, techData) => {
    return await request(`/technologies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(techData)
    });
  },

  delete: async (id) => {
    return await request(`/technologies/${id}`, {
      method: 'DELETE'
    });
  }
};

export default technologyService;
