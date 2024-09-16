import http from '../utils/axios';
import { gql } from '@apollo/client';

const getCategoriesByRestaurant = () =>
  http(`/v1/public/category/1`, { method: 'GET' });

export const GET_CATEGORIES_BY_RESTAURANT = gql`
  query GetCategoriesByRestaurant($restaurantId: Int!) {
    getCategories(restaurantId: $restaurantId) {
      categoryId
      restaurantId
      categoryName
      createdTime
      updatedTime
    }
  }
`;
