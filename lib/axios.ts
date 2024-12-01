import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { store, RootState } from '@store/store';
import { logoutAction } from '../store/actions/signAction';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getSession } from 'next-auth/react';

const backendHttpInstance = async () => {
  const session = await getSession();

  const axiosInstance = axios.create();
  axiosInstance.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const token = session?.token?.accessToken;

  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

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
        (store.dispatch as ThunkDispatch<RootState, unknown, AnyAction>)(
          logoutAction(),
        );
        return '';
      }

      return Promise.reject(error);
    },
  );
  return axiosInstance;
};

const http = async (endpoint: string, config: AxiosRequestConfig) => {
  const axiosInstance = await backendHttpInstance();
  return axiosInstance(endpoint, { ...config });
};

export const nextapi = (endpoint: string, config: AxiosRequestConfig) => {
  const axiosInstance = axios.create();
  return axiosInstance(endpoint, { ...config });
};

export default http;
