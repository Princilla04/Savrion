import { request } from './api';

export const dashboardService = {
  getStats: async () => {
    const res = await request('/dashboard/stats');
    return res.data;
  }
};

export default dashboardService;
