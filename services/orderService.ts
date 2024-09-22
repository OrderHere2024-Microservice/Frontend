import { gql } from '@apollo/client';

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

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($orderId: Int!) {
    getOrderById(orderId: $orderId) {
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

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($updateOrderStatusDTO: UpdateOrderStatusInput!) {
    updateOrderStatus(updateOrderStatusDTO: $updateOrderStatusDTO) {
      orderId
      orderStatus
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($deleteOrderDTO: DeleteOrderInput!) {
    deleteOrder(deleteOrderDTO: $deleteOrderDTO)
  }
`;