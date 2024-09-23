import * as Action from '../actionTypes';

// Define the state interface
interface DishesState {
  isLoading: boolean;
  error: string | null | undefined;
  searchTerm: string;
  category: number | null | undefined;
}

// Initial state with the defined types
const initialState: DishesState = {
  isLoading: false,
  error: null,
  searchTerm: '',
  category: null,
};

// Define action types with payloads
type DishesAction =
  | { type: typeof Action.ADD_DISH_START }
  | { type: typeof Action.ADD_DISH_SUCCESS }
  | { type: typeof Action.ADD_DISH_ERROR; payload: string | null | undefined }
  | { type: typeof Action.SET_SEARCH_TERM; payload: string }
  | { type: typeof Action.SET_CATEGORY; payload: number | null | undefined };

const dishesReducer = (
  state: DishesState = initialState,
  action: DishesAction,
): DishesState => {
  switch (action.type) {
    case Action.ADD_DISH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case Action.ADD_DISH_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case Action.ADD_DISH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case Action.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case Action.SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };

    default:
      return state;
  }
};

export default dishesReducer;
