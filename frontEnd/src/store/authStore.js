import {create} from "zustand";
 import axios from "axios";


const API_URL = "http://localhost:5002/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    account: null,  // Add account state
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signUp: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            const user = response.data;
            
            localStorage.setItem("user", JSON.stringify(user)); // Persist user
            set({ user: user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.error || "Error signing up", isLoading: false });
			throw error;
		}
	},

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
    
            console.log("Login Response:", response.data); // Debugging
    
            if (!response.data.user || !response.data.account) {
                throw new Error("Invalid response structure");
            }
    
            // Persist user & account in local storage
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("account", JSON.stringify(response.data.account));
    
            set({ 
                user: response.data.user,  
                account: response.data.account,  
                isAuthenticated: true, 
                isLoading: false 
            });
        } catch (error) {
            set({ error: error.response?.data?.error || "Error logging in", isLoading: false });
            throw error;
        }
    },
    
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            const user = response.data;
            set({ user: user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/me`);
    
            const { user, account } = response.data; 
    
            if (!user) { 
                throw new Error("User data is missing from response");
            }
    
            set({ 
                user, 
                account: account || null,  
                isAuthenticated: true, 
                isCheckingAuth: false 
            });
        } catch (error) {
            console.error("Auth Check Failed:", error);
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },
    
    
            
}));