const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic fetch wrapper with automatic JWT token attachment and JSON parsing
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('hotel_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

// --- AUTHENTICATION API ---
export const authAPI = {
  login: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getMe: async () => {
    return await apiRequest('/auth/me', {
      method: 'GET'
    });
  }
};

// --- ROOMS API ---
export const roomsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.type) query.append('type', params.type);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    const endpoint = queryString ? `/rooms?${queryString}` : '/rooms';
    return await apiRequest(endpoint, { method: 'GET' });
  },

  getById: async (id) => {
    return await apiRequest(`/rooms/${id}`, { method: 'GET' });
  },

  create: async (roomData) => {
    return await apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData)
    });
  },

  update: async (id, roomData) => {
    return await apiRequest(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData)
    });
  },

  delete: async (id) => {
    return await apiRequest(`/rooms/${id}`, {
      method: 'DELETE'
    });
  },

  resetCatalog: async () => {
    return await apiRequest('/rooms/reset/catalog', {
      method: 'POST'
    });
  }
};

// --- BOOKINGS API ---
export const bookingsAPI = {
  create: async (bookingData) => {
    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  getMyBookings: async () => {
    return await apiRequest('/bookings/my', {
      method: 'GET'
    });
  },

  cancel: async (id) => {
    return await apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH'
    });
  },

  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = queryString ? `/bookings/admin/all?${queryString}` : '/bookings/admin/all';
    return await apiRequest(endpoint, { method: 'GET' });
  },

  updateStatus: async (id, status) => {
    return await apiRequest(`/bookings/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

// --- CONTACT API ---
export const contactAPI = {
  submit: async (contactData) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }
};
