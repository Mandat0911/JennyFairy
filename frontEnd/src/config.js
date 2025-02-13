const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api/auth"
    : "/api/auth";

export default API_URL;


