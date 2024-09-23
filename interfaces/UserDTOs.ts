export interface OauthProviderLoginSessionDTO {
  username: string;
  email: string;
  avatarUrl: string;
}

export interface ResetPasswordDTO {
  email: string;
  code: string;
  newPassword: string;
}

export interface UserAvatarUpdateDto {
  imageFile: File;
}

export interface UserForgetPasswordRequestDTO {
  email: string;
}

export interface UserGetDto {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  point: number;
  avatarUrl: string;
  address: string;
}

export interface UserProfileUpdateDTO {
  username: string;
  firstname: string;
  lastname: string;
  address: string;
}

export interface UserSignUpRequestDTO {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface UserSignUpResponseDTO {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  createdTime: string;
  updatedTime: string;
}
