import http from '../utils/axios';
import { gql } from '@apollo/client';

export const getRestaurantInfo = (restaurantId) => {
    return http(`/v1/public/restaurants/${restaurantId}`, { method: 'GET' });
};

export const updateRestaurant = (restaurantId, restaurantData) => http(`/v1/public/restaurants/${restaurantId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    data: JSON.stringify(restaurantData)
});

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

