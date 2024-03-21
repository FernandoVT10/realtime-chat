import axios from "axios";

const API_URL = "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

export default axiosInstance;
