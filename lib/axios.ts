import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

const backendHttpInstance = async (overrideUrl?: string) => {
  const session = await getSession();

  const axiosInstance = axios.create();
  axiosInstance.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (overrideUrl) {
    axiosInstance.defaults.baseURL = overrideUrl;
  }
  const token = session?.token?.accessToken;

  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

  axiosInstance.interceptors.response.use(
    (config) => config,
    (error: AxiosError) => {
      error && console.log(error.response);

      return Promise.reject(error);
    },
  );
  return axiosInstance;
};

const http = async (
  endpoint: string,
  config: AxiosRequestConfig,
  overrideUrl?: string,
) => {
  const axiosInstance = await backendHttpInstance(overrideUrl);
  return axiosInstance(endpoint, { ...config });
};

export const nextapi = (endpoint: string, config: AxiosRequestConfig) => {
  const axiosInstance = axios.create();
  return axiosInstance(endpoint, { ...config });
};

export default http;
