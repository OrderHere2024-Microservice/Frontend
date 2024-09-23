import * as Action from '../actionTypes';
import { UpdateOrderStatusDTO, OrderGetDTO } from '@interfaces/OrderDTOs';

interface OrderOptions {
  delivery: boolean;
  dine_in: boolean;
  pickup: boolean;
}

interface OrderStatus {
  pending: boolean;
  preparing: boolean;
  finished: boolean;
  in_transit: boolean;
  delayed: boolean;
  delivered: boolean;
  cancelled: boolean;
}

interface OrderState {
  orders: OrderGetDTO[];
  options: OrderOptions;
  status: OrderStatus;
  sortedOrder: string;
  searchText: string;
}

const initialState: OrderState = {
  orders: [],
  options: {
    delivery: true,
    dine_in: true,
    pickup: true,
  },
  status: {
    pending: true,
    preparing: true,
    finished: true,
    in_transit: true,
    delayed: true,
    delivered: true,
    cancelled: true,
  },
  sortedOrder: '',
  searchText: '',
};

type OrderAction =
  | { type: typeof Action.DELETE_ORDER; payload: number }
  | { type: typeof Action.FETCH_ORDERS; payload: OrderGetDTO[] }
  | { type: typeof Action.SET_ORDER_OPTION; payload: OrderOptions }
  | { type: typeof Action.SET_ORDER_STATUS; payload: OrderStatus }
  | { type: typeof Action.SET_SORTED_ORDER; payload: string }
  | { type: typeof Action.SET_SEARCH_TEXT; payload: string }
  | { type: typeof Action.UPDATE_ORDER_STATUS; payload: UpdateOrderStatusDTO };

const orderReducer = (
  state: OrderState = initialState,
  action: OrderAction,
): OrderState => {
  switch (action.type) {
    case Action.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(
          (order) => order.orderId !== action.payload,
        ),
      };
    case Action.FETCH_ORDERS:
      return {
        ...state,
        orders: Array.isArray(action.payload) ? action.payload : [],
      };
    case Action.SET_ORDER_OPTION:
      return {
        ...state,
        options: action.payload,
      };
    case Action.SET_ORDER_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case Action.SET_SORTED_ORDER:
      return {
        ...state,
        sortedOrder: action.payload,
      };
    case Action.SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };
    case Action.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.orderId === action.payload.orderId) {
            return { ...order, orderStatus: action.payload.orderStatus };
          }
          return order;
        }),
      };
    default:
      return state;
  }
};

export default orderReducer;
