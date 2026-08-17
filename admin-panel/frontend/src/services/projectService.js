import { request } from './api';

export const projectService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/projects${query ? `?${query}` : ''}`);
    return res.data || [];
  },

  getById: async (id) => {
    const res = await request(`/projects/${id}`);
    return res.data;
  },

  create: async (projectData) => {
    return await request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  update: async (id, projectData) => {
    return await request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  },

  delete: async (id) => {
    return await request(`/projects/${id}`, {
      method: 'DELETE'
    });
  }
};

export default projectService;
