import * as Action from '../actionTypes';
import { saveState, store } from '../store';
import { ThunkAction } from 'redux-thunk';
import { Action as ReduxAction } from 'redux';
import { RootState } from '../store';

export const openSignDialog = () => ({
  type: Action.OPEN_SIGN_DIALOG,
});

export const closeSignDialog = () => ({
  type: Action.CLOSE_SIGN_DIALOG,
});

export const loginSignDialog = () => ({
  type: Action.LOGIN_SIGN_DIALOG,
});

export const registerSignDialog = () => ({
  type: Action.REGISTER_SIGN_DIALOG,
});

export const logoutAction =
  (): ThunkAction<void, RootState, unknown, ReduxAction<string>> =>
  (dispatch) => {
    dispatch({
      type: Action.LOGOUT,
    });
    saveState(store.getState());
  };
