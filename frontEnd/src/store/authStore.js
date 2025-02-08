import {create} from "zustand";
 import axios from "axios";
// import { verify } from "crypto";

const API_URL = "http://localhost:5002/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signUp: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            const user = response.data.user;
            
            localStorage.setItem("user", JSON.stringify(user)); // Persist user
            set({ user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.error || "Error signing up", isLoading: false });
			throw error;
		}
	},

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const user = response.data.user;

            localStorage.setItem("user", JSON.stringify(user)); // Persist user
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
           set({ error: error.response.data.error || "Error logging in", isLoading: false });
           
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    }
}));