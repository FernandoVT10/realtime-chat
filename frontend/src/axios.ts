import axios from "axios";

const API_URL = "http://localhost:3001/api";

interface Headers {
  Authorization: string;
}

const getHeaders = (): Partial<Headers> => {
  const headers: Partial<Headers> = {};

  const token = window.localStorage.getItem("token");
  if(token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: getHeaders(),
  timeout: 1000,
});

axiosInstance.interceptors.response.use(
  response => {
    if(response.data.data) {
      response.data = response.data.data;
    }

    return response;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
