import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "production" ? "https://jennyfairy-1a.onrender.com/api": "/api",
    withCredentials: true,
})

export default axiosInstance;
