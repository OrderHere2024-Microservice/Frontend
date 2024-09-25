import {
  ADD_DISH_SUCCESS,
  ADD_DISH_START,
  ADD_DISH_ERROR,
} from '@store/actionTypes';

export const addDishStart = () => ({
  type: ADD_DISH_START,
});

export const addDishSuccess = () => ({
  type: ADD_DISH_SUCCESS,
});

export const addDishError = (error: string) => ({
  type: ADD_DISH_ERROR,
  payload: error,
});
