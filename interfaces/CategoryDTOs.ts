export interface CategoryGetDto {
  categoryId: number;
  restaurantId: number;
  categoryName: string;
  createdTime: string;
  updatedTime: string;
}

export interface CategoryPostDto {
  restaurantId: number;
  categoryName: string;
}
