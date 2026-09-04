// =========================================================
// RULEMYHOLIDAY — Centralized Backend API Client Service
// =========================================================

const API_BASE_URL = 'http://localhost:5000/api';

const ApiClient = {
  // Token management
  getToken() {
    return localStorage.getItem('rmh_token');
  },
  setToken(token) {
    localStorage.setItem('rmh_token', token);
  },
  removeToken() {
    localStorage.removeItem('rmh_token');
    localStorage.removeItem('rmh_user');
  },
  getUser() {
    const userStr = localStorage.getItem('rmh_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser(user) {
    localStorage.setItem('rmh_user', JSON.stringify(user));
  },
  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  // Helper request builder
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API Request failed');
      }
      return data;
    } catch (error) {
      console.warn(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  },

  // Auth Methods
  async register(name, email, password, phone) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
    if (data.token && data.user) {
      this.setToken(data.token);
      this.setUser(data.user);
    }
    return data;
  },

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token && data.user) {
      this.setToken(data.token);
      this.setUser(data.user);
    }
    return data;
  },

  logout() {
    this.removeToken();
    window.location.reload();
  },

  async getMe() {
    if (!this.getToken()) return null;
    try {
      const data = await this.request('/auth/me');
      if (data.user) {
        this.setUser(data.user);
      }
      return data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  // Packages Methods
  async getPackages(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return await this.request(`/packages?${query}`);
  },

  async getPackageById(id) {
    return await this.request(`/packages/${id}`);
  },

  // Bookings Methods
  async createBooking(bookingData) {
    return await this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  async getMyBookings() {
    return await this.request('/bookings/my-bookings');
  },

  async cancelBooking(bookingId) {
    return await this.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    });
  }
};

window.ApiClient = ApiClient;
