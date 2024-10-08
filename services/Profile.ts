import { UserProfileUpdateDTO } from '@interfaces/UserDTOs';
import http from '@utils/axios';

export const updateUserProfile = (userData: UserProfileUpdateDTO) =>
  http(`/v1/public/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(userData),
  });

export const getUserProfile = () =>
  http(`/v1/public/users/profile`, {
    method: 'GET',
  });

export const updateUserAvatar = (userAvatar: FormData) =>
  http('v1/public/users/profile/avatar', {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: userAvatar,
  });
