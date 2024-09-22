import { OrderDishDTO } from '@interfaces/OrderDishDTO';

export interface DeleteOrderDTO {
  orderId: number;
}

export interface OrderGetDTO {
  orderId: number;
  restaurantId: number;
  userId: number;
  dishes: OrderDishDTO[];
  username: string;
  orderStatus: string;
  orderType: string;
  tableNumber: number;
  pickupTime: string;
  address: string;
  totalPrice: number;
  note: string;
  updatedTime: string;
  phone: string;
  numberOfPeople: number;
}

export interface PlaceOrderDTO {
  restaurantId: number;
  tableNumber: number;
  orderType: string;
  orderStatus: string;
  discount: number;
  dishes: OrderDishDTO[];
  totalPrice: number;
  note: string;
  address: string;
  phone: string;
  numberOfPeople: number;
  pickupTime: string;
}

export interface UpdateOrderStatusDTO {
  orderId: number;
  orderStatus: string;
}
