import http from '@utils/axios';
import { gql } from '@apollo/client';
import { DishCreateDto, DishUpdateDto } from '@interfaces/DishDTOs';

export const postDishes = (dishData: DishCreateDto) => {
  const formData = new FormData();
  formData.append('dishName', dishData.dishName);
  formData.append('description', dishData.description);
  formData.append('price', dishData.price.toString());
  formData.append('restaurantId', dishData.restaurantId.toString());
  formData.append('availability', dishData.availability.toString());
  formData.append('categoryId', dishData.categoryId.toString());

  if (dishData.imageFile) {
    formData.append('imageFile', dishData.imageFile, dishData.imageFile.name);
  }

  return http(`/v1/public/dish`, {
    method: 'POST',
    data: formData,
  });
};

export const updateDishes = (dishData: DishUpdateDto) => {
  const formData = new FormData();

  formData.append('dishId', dishData.dishId.toString());
  formData.append('dishName', dishData.dishName);
  formData.append('description', dishData.description);
  formData.append('price', dishData.price.toString());
  formData.append('restaurantId', dishData.restaurantId.toString());
  formData.append('availability', dishData.availability.toString());

  if (dishData.imageFile) {
    formData.append('imageFile', dishData.imageFile, dishData.imageFile.name);
  }

  return http(`/v1/public/dish`, {
    method: 'PUT',
    data: formData,
  });
};

export const GET_DISHES_PRICE_FILTER = gql`
  query GetDishes($restaurantId: Int!) {
    getDishes(restaurantId: $restaurantId) {
      data {
        price
      }
    }
  }
`;

export const GET_DISHES = gql`
  query GetDishes(
    $restaurantId: Int!
    $page: Int
    $size: Int
    $sort: String
    $order: String
  ) {
    getDishes(
      restaurantId: $restaurantId
      page: $page
      size: $size
      sort: $sort
      order: $order
    ) {
      data {
        dishId
        dishName
        description
        price
        imageUrl
        rating
        restaurantId
        availability
        categoryId
        categoryName
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const CREATE_DISH = gql`
  mutation CreateDish($dishCreateDto: DishCreateInput!) {
    createDish(dishCreateDto: $dishCreateDto)
  }
`;

export const UPDATE_DISH = gql`
  mutation UpdateDish($dishUpdateDto: DishUpdateInput!) {
    updateDish(dishUpdateDto: $dishUpdateDto) {
      dishId
      dishName
      description
      price
      imageUrl
      rating
      availability
      categoryId
      categoryName
    }
  }
`;

export const DELETE_DISH = gql`
  mutation DeleteDish($dishId: Int!) {
    deleteDish(dishId: $dishId)
  }
`;
