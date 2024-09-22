import { FilterState } from '@store/types';
import * as Action from '../actionTypes';

const initialState: FilterState = {
  priceRange: { min: 0, max: 100 },
};

interface SetPriceRangeAction {
  type: typeof Action.SET_PRICE_RANGE;
  payload: {
    min: number;
    max: number;
  };
}

const filterReducer = (
  state = initialState,
  { type, payload }: SetPriceRangeAction,
) => {
  switch (type) {
    case Action.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: payload,
      };
    default:
      return state;
  }
};

export default filterReducer;
