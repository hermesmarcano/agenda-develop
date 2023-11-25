import axios from "axios";

const baseURL = process.env.REACT_APP_DEVELOPMENT === "true"
  ? process.env.REACT_APP_API_DEV
  : process.env.REACT_APP_API;

const instance = axios.create({
  baseURL,
  timeout: 55000,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error.response);
  }
);


export default instance;
