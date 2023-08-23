import axios from "axios";

const apiProvider = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 55000,
});

// Add a request interceptor
apiProvider.interceptors.request.use(
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
apiProvider.interceptors.response.use(
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

// const apiProvider = {
//   instance
// }

export default apiProvider
