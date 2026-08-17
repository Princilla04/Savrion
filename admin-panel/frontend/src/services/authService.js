import { request } from './api';

export const authService = {
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('savrion_admin_token', data.token);
      localStorage.setItem('savrion_admin_user', JSON.stringify(data.admin));
    }
    return data;
  },

  getMe: async () => {
    return await request('/auth/me');
  },

  updateProfile: async (profileData) => {
    return await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  logout: () => {
    localStorage.removeItem('savrion_admin_token');
    localStorage.removeItem('savrion_admin_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('savrion_admin_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('savrion_admin_token');
  }
};

export default authService;
