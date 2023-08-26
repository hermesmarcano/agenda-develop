import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 55000,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
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

// const instance = {
//   instance
// }

export default instance;
