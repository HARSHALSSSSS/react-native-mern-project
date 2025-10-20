import apiClient from './api';

/**
 * User Authentication Service
 */
export const userAuthService = {
  register: (data) => apiClient.post('/user/auth/register', data),
  login: (email, password) => apiClient.post('/user/auth/login', { email, password }),
  getProfile: () => apiClient.get('/user/auth/profile'),
  updateProfile: (data) => apiClient.put('/user/auth/profile', data),
  updatePushToken: (token) => apiClient.post('/user/auth/push-token', { pushNotificationToken: token }),
};

/**
 * Event Service
 */
export const eventService = {
  getAll: (params) => apiClient.get('/events', { params }),
  getById: (id) => apiClient.get(`/events/${id}`),
  search: (params) => apiClient.get('/events', { params }),
};

/**
 * Booking Service
 */
export const bookingService = {
  create: (data) => apiClient.post('/bookings', data),
  getMyBookings: (params) => apiClient.get('/bookings/user/my-bookings', { params }),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  cancelBooking: (id) => apiClient.post(`/bookings/${id}/cancel`),
};

/**
 * Check-in Service
 */
export const checkinService = {
  checkIn: (data) => apiClient.post('/checkin/checkin', data),
};
