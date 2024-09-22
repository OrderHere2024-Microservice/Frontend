import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { store, RootState } from '@store/store';
import { logoutAction } from '../store/actions/signAction';

const backendHttpInstance = () => {
  const axiosInstance = axios.create();
  axiosInstance.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const state: RootState = store.getState();
  axiosInstance.defaults.headers.common.Authorization = state.sign.token
    ? state.sign.token
    : '';

  axiosInstance.interceptors.response.use(
    (config) => config,
    (error: AxiosError) => {
      error && console.log(error.response);

      // jwt expired or invalid
      if (
        error &&
        error.response &&
        (error.response.status === 401 ||
          error.response.status === 405 ||
          error.response.status === 403)
      ) {
        store.dispatch(logoutAction());
        return '';
      }

      return Promise.reject(error);
    },
  );
  return axiosInstance;
};

const http = (endpoint: string, config: AxiosRequestConfig) => {
  const axiosInstance = backendHttpInstance();
  return axiosInstance(endpoint, { ...config });
};

export const nextapi = (endpoint: string, config: AxiosRequestConfig) => {
  const axiosInstance = axios.create();
  return axiosInstance(endpoint, { ...config });
};

export default http;
