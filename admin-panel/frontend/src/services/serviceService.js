import { request } from './api';

export const serviceService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/services${query ? `?${query}` : ''}`);
    return res.data || [];
  },

  getById: async (id) => {
    const res = await request(`/services/${id}`);
    return res.data;
  },

  create: async (serviceData) => {
    return await request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  },

  update: async (id, serviceData) => {
    return await request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    });
  },

  delete: async (id) => {
    return await request(`/services/${id}`, {
      method: 'DELETE'
    });
  }
};

export default serviceService;
