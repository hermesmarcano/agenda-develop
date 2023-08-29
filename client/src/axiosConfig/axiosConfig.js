import axios from "axios";

const baseURL = process.env.REACT_APP_DEVELOPMENT === "true"
  ? process.env.REACT_APP_API_DEV
  : process.env.REACT_APP_API;

const instance = axios.create({
  baseURL,
  timeout: 55000,
});
// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add any request headers here

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
