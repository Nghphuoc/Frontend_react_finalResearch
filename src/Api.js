import axios from "axios";
const csrfToken = "cc"
// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});


// Add a request interceptor to include JWT and CSRF tokens
api.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("Authorization");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // if (csrfToken) {
    //   config.headers["X-XSRF-TOKEN"] = csrfToken;
    // }
    //console.log("X-XSRF-TOKEN " + csrfToken);
    //console.log("Request Config:", config); // Logs all headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
