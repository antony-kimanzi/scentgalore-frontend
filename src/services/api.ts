import axios, { type AxiosInstance, type AxiosResponse } from "axios";
const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request interceptor error, ", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          console.error("Bad request syntax from the user");
          break;

        case 401:
          console.log("Unauthorized access");
          break;

        case 403:
          console.error("Access forbidden");
          break;

        case 404:
          console.error("Resource not found");
          break;

        case 409:
          console.error("Conflict while processing request");
          break;

        case 500:
          console.error("Internal server error");
          break;

        default:
          console.error("Unhandled error status: ", error.response.status);
          break;
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - No response received");
    } else {
      console.error("Request configuration error: ", error.message);
    }
    return Promise.reject(error);
  },
);
