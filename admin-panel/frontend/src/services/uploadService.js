import { request } from './api';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await request('/upload', {
      method: 'POST',
      body: formData
    });
    return res;
  }
};

export default uploadService;
