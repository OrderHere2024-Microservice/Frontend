import * as Action from '../actionTypes';
import { CartState } from '@store/types';

export interface AddToCartPayload {
  dishId: number;
  dishName: string;
  quantity: number;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface RemoveFromCartPayload {
  dishId: number;
}

type CartAction =
  | { type: typeof Action.ADD_TO_CART; payload: AddToCartPayload }
  | { type: typeof Action.REMOVE_FROM_CART; payload: RemoveFromCartPayload }
  | { type: typeof Action.SET_ORDER_TYPE; payload: string }
  | { type: typeof Action.CLEAR_CART }
  | { type: typeof Action.CART_OPERATION_START }
  | { type: typeof Action.CART_OPERATION_END }
  | { type: typeof Action.INCREASE_ITEM; payload: RemoveFromCartPayload }
  | { type: typeof Action.DECREASE_ITEM; payload: RemoveFromCartPayload }
  | { type: typeof Action.CALCULATE_TOTAL_PRICE };

const initialState: CartState = {
  items: [],
  isLoading: false,
  totalItems: 0,
  totalPrice: 0,
  orderType: 'delivery',
};

const cartReducer = (state = initialState, action: CartAction): CartState => {
  switch (action.type) {
    case Action.ADD_TO_CART:
      return {
        ...state,
        items: [
          ...state.items,
          {
            dishId: action.payload.dishId,
            dishName: action.payload.dishName,
            quantity: action.payload.quantity,
            price: action.payload.price,
            description: action.payload.description,
            imageUrl: action.payload.imageUrl,
          },
        ],
      };

    case Action.REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(
          (item) => item.dishId !== action.payload.dishId,
        ),
      };

    case Action.CLEAR_CART:
      return initialState;

    case Action.CART_OPERATION_START:
      return {
        ...state,
        isLoading: true,
      };

    case Action.CART_OPERATION_END:
      return {
        ...state,
        isLoading: false,
      };

    case Action.INCREASE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.dishId === action.payload.dishId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };

    case Action.DECREASE_ITEM:
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.dishId === action.payload.dishId && item.quantity > 0
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };

    case Action.CALCULATE_TOTAL_PRICE:
      return {
        ...state,
        totalItems: state.items.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        totalPrice: state.items.reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        ),
      };

    case Action.SET_ORDER_TYPE:
      return {
        ...state,
        orderType: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
