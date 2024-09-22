export interface DeleteIngredientDTO {
  dishId: number;
  ingredientId: number;
}

export interface GetIngredientDTO {
  linkIngredientDishId: number;
  dishId: number;
  ingredientId: number;
  quantityValue: number;
  quantityUnit: string;
}

export interface PostIngredientDTO {
  dishId: number;
  name: string;
  unit: string;
  quantityValue: number;
}

export interface UpdateIngredientDTO {
  ingredientId: number;
  name: string;
}
