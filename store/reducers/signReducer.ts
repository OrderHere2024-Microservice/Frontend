import * as Action from '../actionTypes';
import { SignState } from '@store/types';

export interface ActionType<T = never> {
  type: string;
  payload: T;
}

const initialState: SignState = {
  isOpen: false,
  content: 'login',
  isLogin: false,
  token: undefined,
};

const signReducer = (state = initialState, { type, payload }: ActionType) => {
  switch (type) {
    case Action.OPEN_SIGN_DIALOG:
      return {
        ...state,
        isOpen: true,
      };

    case Action.CLOSE_SIGN_DIALOG:
      return {
        ...state,
        isOpen: false,
      };

    case Action.LOGIN_SIGN_DIALOG:
      return {
        ...state,
        content: 'login',
      };

    case Action.REGISTER_SIGN_DIALOG:
      return {
        ...state,
        content: 'register',
      };

    case Action.FORGET_PASSWORD_SUCCESS:
      // Handle state update for a successful password reset request
      return {
        ...state,
        // other state updates
        passwordResetStatus: 'success', // example state field
        message: payload, // the success message from the backend
      };

    case Action.FORGET_PASSWORD_ERROR:
      // Handle state update for a failed password reset request
      return {
        ...state,
        // other state updates
        passwordResetStatus: 'error', // example state field
        error: payload, // the error message
      };

    case Action.LOGIN_SUCCESS:
      return {
        ...state,
        isOpen: false,
        isLogin: true,
        token: payload,
      };

    case Action.LOGIN_ERROR:
      return {
        ...state,
        isLogin: false,
        token: undefined,
      };

    case Action.LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default signReducer;
