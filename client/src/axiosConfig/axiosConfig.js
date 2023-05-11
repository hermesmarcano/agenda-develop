import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4040",
  timeout: 10000, // timeout after 10 seconds
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add any request headers here
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.error(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    console.error(error);
    return Promise.reject(error.response);
  }
);

export default instance;
