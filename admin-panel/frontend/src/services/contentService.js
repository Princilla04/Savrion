import { request } from './api';

export const contentService = {
  getContent: async () => {
    const res = await request('/website-content');
    return res.data;
  },

  updateContent: async (contentData) => {
    return await request('/website-content', {
      method: 'PUT',
      body: JSON.stringify(contentData)
    });
  }
};

export default contentService;
