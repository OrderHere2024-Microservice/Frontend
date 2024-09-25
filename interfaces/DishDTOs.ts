export interface DishCreateDto {
  dishName: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageFile?: File;
  restaurantId: number;
  availability: boolean;
  categoryId: number;
}

export interface DishGetDto {
  dishId: number;
  dishName: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  restaurantId: number;
  availability: boolean;
  createdTime: string;
  updatedTime: string;
  categoryId: number;
  categoryName: string;
}

export interface DishUpdateDto {
  dishId: number;
  dishName: string;
  description: string;
  price: number;
  imageUrl: string;
  imageFile: File;
  restaurantId: number;
  availability: boolean;
}
