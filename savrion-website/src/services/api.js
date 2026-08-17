const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.warn(`[API Client] ${options.method || 'GET'} ${endpoint} failed:`, err.message);
    throw err;
  }
};

export default { request };
