import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true, 
});

export const user = {
    login: async (userdata) => {
        const response = await api.post('/users/login', userdata);
        return response.data;
    },
    register: async (userdata) => {
        const response = await api.post('/users/register', userdata);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },
    // --- FIX IS HERE ---
    update_avatar: async (formdata) => {
        // We pass the formData object. Axios automatically sets the multipart/form-data header.
        const response = await api.patch('/users/update-avatar', formdata);
        return response.data; // Return the full data (including new user object)
    },
    getdetail: async () => {
        const response = await api.get('/users/current-user');
        return response.data;
    }
};