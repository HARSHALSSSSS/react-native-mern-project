import apiClient from './api';

/**
 * Admin Authentication Service
 */

export const adminAuthService = {
  register: (data) => apiClient.post('/admin/auth/register', data),
  login: (email, password) => apiClient.post('/admin/auth/login', { email, password }),
  getProfile: () => apiClient.get('/admin/auth/profile'),
  updateProfile: (data) => apiClient.put('/admin/auth/profile', data),
  changePassword: (data) => apiClient.post('/admin/auth/change-password', data),
};

/**
 * Category Service
 */
export const categoryService = {
  create: (data) => apiClient.post('/categories', data),
  getAll: (params) => apiClient.get('/categories', { params }),
  getById: (id) => apiClient.get(`/categories/${id}`),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

/**
 * Venue Service
 */
export const venueService = {
  create: (data) => apiClient.post('/venues', data),
  getAll: (params) => apiClient.get('/venues', { params }),
  getById: (id) => apiClient.get(`/venues/${id}`),
  update: (id, data) => apiClient.put(`/venues/${id}`, data),
  delete: (id) => apiClient.delete(`/venues/${id}`),
};

/**
 * Event Service
 */
export const eventService = {
  create: (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('venue', data.venue);
    formData.append('startDate', data.startDate);
    formData.append('startTime', data.startTime || '');
    formData.append('endDate', data.endDate || data.startDate);
    formData.append('endTime', data.endTime || '');
    formData.append('totalCapacity', data.totalCapacity);
    formData.append('ticketPrice', data.ticketPrice);
    formData.append('tags', JSON.stringify(data.tags || []));
    formData.append('featured', data.featured || false);
    if (data.poster) formData.append('poster', data.poster);
    return apiClient.post('/events', formData);
  },
  getAll: (params) => apiClient.get('/events', { params }),
  getById: (id) => apiClient.get(`/events/${id}`),
  update: (id, data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('venue', data.venue);
    formData.append('startDate', data.startDate);
    formData.append('startTime', data.startTime || '');
    formData.append('endDate', data.endDate || data.startDate);
    formData.append('endTime', data.endTime || '');
    formData.append('totalCapacity', data.totalCapacity);
    formData.append('ticketPrice', data.ticketPrice);
    formData.append('tags', JSON.stringify(data.tags || []));
    formData.append('featured', data.featured || false);
    if (data.poster) formData.append('poster', data.poster);
    return apiClient.put(`/events/${id}`, formData);
  },
  delete: (id) => apiClient.delete(`/events/${id}`),
  getByOrganizer: (params) => apiClient.get('/events/organizer/events', { params }),
  getParticipants: (eventId) => apiClient.get(`/events/${eventId}/participants`),
};

/**
 * Booking Service
 */
export const bookingService = {
  getEventBookings: (eventId, params) => apiClient.get(`/bookings/event/${eventId}`, { params }),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  exportCSV: (eventId) => apiClient.get(`/bookings/event/${eventId}/export-csv`),
};

/**
 * Check-in Service
 */
export const checkinService = {
  checkIn: (data) => apiClient.post('/checkin/checkin', data),
  getStats: (eventId) => apiClient.get(`/checkin/stats/${eventId}`),
};

/**
 * Dashboard Service
 */
export const dashboardService = {
  getAdminDashboard: () => apiClient.get('/dashboard/admin'),
};
