import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "production" ? "https://api.jennyfairy.store/api": "/api",
    withCredentials: true,
})

export default axiosInstance;
