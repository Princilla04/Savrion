import { request } from './api';

export const uploadService = {
  /** Converts local upload paths to backend URLs while preserving Cloud Storage URLs. */
  resolveMediaUrl: (url) => {
    if (!url || /^https?:\/\//i.test(url)) return url;
    const serverUrl = (import.meta.env.VITE_SERVER_URL || 'http://localhost:5050').replace(/\/$/, '');
    return `${serverUrl}${url}`;
  },

  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await request('/upload', {
      method: 'POST',
      body: formData
    });
    return res;
  }
};

export default uploadService;
