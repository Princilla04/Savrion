import { request } from './api';

export const contactService = {
  sendMessage: async (formData) => {
    return await request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }
};

export default contactService;
