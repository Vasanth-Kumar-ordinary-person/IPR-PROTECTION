import api from './api';

export const patentService = {
  // File a new patent
  filePatent: async (formData) => {
    try {
      const response = await api.post('/patents/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all patents
  getAllPatents: async () => {
    try {
      const response = await api.get('/patents/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's patents
  getMyPatents: async () => {
    try {
      const response = await api.get('/patents/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single patent
  getPatentById: async (id) => {
    try {
      const response = await api.get(`/patents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};