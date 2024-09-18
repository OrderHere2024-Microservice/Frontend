import http from '../utils/axios';
import { gql } from '@apollo/client';

const placeOrder = (orderData) =>
  http(`/v1/public/orders`, {
    method: 'POST',
    data: orderData,
  });

const getUserOrder = () => http(`/v1/public/orders/user`, { method: 'GET' });

const getAllOrders = () => http(`/v1/public/orders`, { method: 'GET' });

export const getOrderInfo = (orderId) => {
  return http(`/v1/public/orders/${orderId}`, { method: 'GET' });
};

export const deleteOrder = (orderData) =>
  http(`/v1/public/orders/delete`, {
    method: 'DELETE',
    data: orderData,
  });

export const updateOrderStatus = (statusInfo) =>
  http(`/v1/public/orders/status`, {
    method: 'PATCH',
    data: statusInfo,
  });

export const PLACE_ORDER = gql`
  mutation PlaceOrder($placeOrderDTO: PlaceOrderInput!) {
    placeOrder(placeOrderDTO: $placeOrderDTO)
  }
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders {
    getUserOrders {
      orderId
      restaurantId
      userId
      dishes {
        dishId
        dishName
        dishQuantity
        dishPrice
      }
      username
      orderStatus
      orderType
      tableNumber
      pickupTime
      address
      totalPrice
      note
      updatedTime
      phone
      numberOfPeople
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    getAllOrders {
      orderId
      restaurantId
      userId
      dishes {
        dishId
        dishName
        dishQuantity
        dishPrice
      }
      username
      orderStatus
      orderType
      tableNumber
      pickupTime
      address
      totalPrice
      note
      updatedTime
      phone
      numberOfPeople
    }
  }
`;
