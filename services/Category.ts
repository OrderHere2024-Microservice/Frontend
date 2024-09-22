import { gql } from '@apollo/client';

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
