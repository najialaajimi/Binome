import api from './api';

export const listingService = {
  async getListings(params = {}) {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  async getListing(id) {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  async getFeaturedListings() {
    const response = await api.get('/listings/featured');
    return response.data;
  },

  async createListing(listingData) {
    const response = await api.post('/listings', listingData);
    return response.data;
  },

  async updateListing(id, listingData) {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },

  async deleteListing(id) {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  async getMyListings() {
    const response = await api.get('/listings/user/my-listings');
    return response.data;
  },

  async toggleFavorite(id) {
    const response = await api.post(`/listings/${id}/favorite`);
    return response.data;
  },

  async searchListings(searchParams) {
    const response = await api.get('/listings', { params: searchParams });
    return response.data;
  }
};

export default listingService;
