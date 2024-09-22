export interface UserAddressGetDto {
  userAddressId: number;
  userId: number;
  address: string;
  isDefault: boolean;
  createdTime: string;
  updatedTime: string;
}

export interface UserAddressPostDto {
  userId: number;
  address: string;
  isDefault: boolean;
}

export interface UserAddressPutDto {
  address: string;
  isDefault: boolean;
}
