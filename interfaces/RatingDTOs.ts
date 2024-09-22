export interface RatingGetDto {
  ratingId: number;
  userId: number;
  dishId: number;
  ratingValue: number;
  comments: string;
  createdTime: string;
  updatedTime: string;
}

export interface RatingPostDto {
  userId: number;
  dishId: number;
  ratingValue: number;
  comments: string;
}
