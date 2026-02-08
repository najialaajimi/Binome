import api from './api';

export const bookingService = {
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  async getBookingRequests(status = '') {
    const response = await api.get('/bookings/requests', { params: { status } });
    return response.data;
  },

  async getBooking(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async updateBookingStatus(id, status) {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  async cancelBooking(id, reason) {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  }
};

export default bookingService;
