import api from './api';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error.response?.data || { message: 'Network error' };
    }
};

export const updateProfile = async (userData) => {
    try {
        const response = await api.put('/auth/profile', userData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error.response?.data || { message: 'Error updating profile' };
    }
};

export const authService = {
    login: async (credentials) => {
        return loginUser(credentials);
    },

    register: async (userData) => {
        return registerUser(userData);
    },

    updateProfile: async (userData) => {
        return updateProfile(userData);
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};