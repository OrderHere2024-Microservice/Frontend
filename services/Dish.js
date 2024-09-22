import http from '../utils/axios';
import { gql } from '@apollo/client';

export const postDishes = (dishData) => {
  const formData = new FormData();
  for (const key in dishData) {
    if (key === 'imageFile' && dishData[key]) {
      formData.append(key, dishData[key], dishData[key].name);
    } else {
      formData.append(key, dishData[key]);
    }
  }

  return http(`/v1/public/dish`, {
    method: 'POST',
    data: formData
  });
};

export const updateDishes = (dishData) => {
  const formData = new FormData();
  for (const key in dishData) {
    if (key === 'imageFile') {
      if (dishData[key] && dishData[key] instanceof File) {
        formData.append(key, dishData[key], dishData[key].name);
      }
    } else {
      formData.append(key, dishData[key]);
    }
  }

  return http(`/v1/public/dish`, {
    method: 'PUT',
    data: formData
  });
};

const deleteDish = (dishId) => {
  return http(`/v1/public/dish/1/${dishId}`, {
    method: 'DELETE'
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
  query GetDishes($restaurantId: Int!, $page: Int, $size: Int, $sort: String, $order: String) {
    getDishes(restaurantId: $restaurantId, page: $page, size: $size, sort: $sort, order: $order) {
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