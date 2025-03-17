import { create } from "zustand";
import axios from "../../lib/axios.lib.js";

export const useAuthStore = create((set, get) => ({
    user: null,
    account: null, // Add account state
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signUp: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/auth/signup", { email, password, name });
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
            const response = await axios.post("/auth/login", { email, password });
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
            const response = await axios.post("/auth/verify-email", { code });
            const { user, account } = response.data;
    
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("account", JSON.stringify(account));
    
            set({ user, account, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },
    
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get("/auth/me");
            const { user, account } = response.data;

            if (!user) {
                throw new Error("User data is missing from response");
            }

            set({
                user,
                account: account,
                isAuthenticated: true,
                isCheckingAuth: false
            });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post("/auth/logout");
            localStorage.removeItem("user");
            localStorage.removeItem("account");
            set({ user: null, account: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.error || "Error logging out", isLoading: false });
            throw error;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/auth/forgot-password", { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.error || "Error sending email", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/auth/reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.error || "Error resetting password", isLoading: false });
            throw error;
        }
    },
    
    resendVerificationEmail: async (email) => {
        set({ isLoading: true, error: null, message: null });
        try {
            const response = await axios.post("/auth/resend-verification", { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.error || "Error resending email", isLoading: false });
            throw error;
        }
    },

    refreshToken: async () => {
        console.log("🚀 Calling refresh API...", get().isCheckingAuth);
    
        if (get().isCheckingAuth) return;
    
        set({ isCheckingAuth: true });
    
        try {
            const response = await axios.post("/auth/refresh-token");
            console.log("✅ Refresh successful:", response.data);
    
            set({ isCheckingAuth: false }); // Reset after success
            return response.data;
        } catch (error) {
            console.error("❌ Refresh failed:", error);
    
            // ✅ Ensure isCheckingAuth is reset
            set({ isCheckingAuth: false, user: null });
    
            throw error;
        }
    }    
}));


    // TODO: Implement the axios interceptors for refreshing access token

    let refreshPromise = null;

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            console.log("🚨 Interceptor triggered:", error.response?.status);
    
            if (error.response?.status === 401 && !originalRequest._retry) {
                console.log("🔄 401 detected, attempting refresh...");
                originalRequest._retry = true;
    
                try {
                    if (refreshPromise) {
                        console.log("🔄 Waiting for ongoing refresh...");
                        await refreshPromise;
                    } else {
                        console.log("🔄 Starting new refresh...");
                        useAuthStore.setState({ isCheckingAuth: false, user: null });

                        refreshPromise = useAuthStore.getState().refreshToken();
                        await refreshPromise;
                        refreshPromise = null;
                    }
    
                    return axios(originalRequest); // Retry request with new token
                } catch (refreshError) {
                    console.error("❌ Refresh token failed, logging out...");

                    useAuthStore.getState().logout();
                    return Promise.reject(refreshError);
                }
            }
    
            return Promise.reject(error);
        }
    );
    
    