import { gql } from '@apollo/client';

export const GET_RESTAURANT_ADDRESS = gql`
  query GetRestaurantInfo($restaurantId: Int!) {
    getRestaurantById(restaurantId: $restaurantId) {
      address
    }
  }
`;

export const GET_RESTAURANT_INFO = gql`
  query GetRestaurantInfo($restaurantId: Int!) {
    getRestaurantById(restaurantId: $restaurantId) {
      restaurantId
      name
      description
      address
      contactNumber
      abn
      ownerName
      ownerMobile
      ownerAddress
      ownerEmail
      ownerCrn
      openingHours {
        dayOfWeek
        openingTime
        closingTime
      }
    }
  }
`;

export const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurantById(
    $restaurantId: Int!
    $restaurantUpdateDTO: RestaurantInput!
  ) {
    updateRestaurantById(
      restaurantId: $restaurantId
      restaurantUpdateDTO: $restaurantUpdateDTO
    ) {
      restaurantId
      name
      description
      address
      contactNumber
      abn
      ownerName
      ownerMobile
      ownerAddress
      ownerEmail
      ownerCrn
      openingHours {
        dayOfWeek
        openingTime
        closingTime
      }
    }
  }
`;
