import http from '@utils/axios';

export const login = (email: string, password: string) =>
  http(`/login`, {
    method: 'POST',
    data: { email, password },
  });

export const signup = (
  userName: string,
  firstName: string,
  lastName: string,
  password: string,
  email: string,
) =>
  http(`/v1/public/users/signup`, {
    method: 'POST',
    data: {
      userName,
      firstName,
      lastName,
      password,
      email,
    },
  });

export const forgetpassword = (email: string) =>
  http(`/v1/public/users/forget-password`, {
    method: 'POST',
    data: { email },
  });

export const resetpassword = (
  email: string,
  code: string,
  newPassword: string,
) =>
  http(`/v1/public/users/reset`, {
    method: 'POST',
    data: {
      email,
      code,
      newPassword,
    },
  });

export const loginByOathProvider = (
  provider: string,
  openId: string,
  email: string,
  username: string,
  avatarUrl: string,
) =>
  http(`/v1/public/users/login/${provider}/${openId}`, {
    method: 'POST',
    data: {
      username,
      email,
      avatarUrl,
    },
  });
