const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://savrion-website.onrender.com/api';
  }
  return envUrl || 'http://localhost:5050/api';
};

const API_BASE_URL = getApiBaseUrl();

export const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('savrion_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      // Auto-logout on unauthorized if token is present
      if (token && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('savrion_admin_token');
        localStorage.removeItem('savrion_admin_user');
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.warn(`[Admin API] ${options.method || 'GET'} ${endpoint} error:`, err.message);
    throw err;
  }
};

export default { request };
