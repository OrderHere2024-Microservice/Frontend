import * as Action from '../actionTypes';
import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { Action as ReduxAction } from 'redux';
import { saveState, store } from '../store';
import { login, loginByOathProvider } from '@services/Public';
import { RootState } from '../store';

export const loginSuccess = (token: string) => ({
  type: Action.LOGIN_SUCCESS,
  payload: token,
});

const loginError = () => ({
  type: Action.LOGIN_ERROR,
});

const forgetPasswordSuccess = (message: string) => ({
  type: Action.FORGET_PASSWORD_SUCCESS,
  payload: message,
});

const forgetPasswordError = (error: string) => ({
  type: Action.FORGET_PASSWORD_ERROR,
  payload: error,
});

type ThunkResult<R> = ThunkAction<R, RootState, unknown, ReduxAction<string>>;

export const loginAction =
  (
    email: string,
    password: string,
    success: (response: { data: { token: string } }) => void,
    fail: (error: unknown) => void,
  ): ThunkResult<void> =>
  (dispatch) => {
    login(email, password)
      .then((response: { data: { token: string } }) => {
        dispatch(loginSuccess(response.data.token));
        success(response);
      })
      .catch((error) => {
        dispatch(loginError());
        fail(error);
      })
      .finally(() => saveState(store.getState()));
  };

export const forgetPasswordAction =
  (
    email: string,
    onSuccess: (message: string) => void,
    onError: (error: string) => void,
  ): ThunkResult<void> =>
  (dispatch) => {
    axios
      .post('/forget-password', { email })
      .then((response: { data: { message: string } }) => {
        dispatch(forgetPasswordSuccess(response.data.message));
        onSuccess(response.data.message);
      })
      .catch((error: { response: { data: { error: string } } }) => {
        dispatch(forgetPasswordError(error.response.data.error));
        onError(error.response.data.error);
      });
  };

export const loginWithOauthProviderAction =
  (
    provider: string,
    openId: string,
    email: string,
    username: string,
    avatarUrl: string,
    success: () => void,
    fail: () => void,
  ): ThunkResult<void> =>
  (dispatch) => {
    loginByOathProvider(provider, openId, email, username, avatarUrl)
      .then((response: { data: string }) => {
        dispatch(loginSuccess(response.data));
        success();
      })
      .catch(() => {
        dispatch(loginError());
        fail();
      })
      .finally(() => saveState(store.getState()));
  };

export default loginAction;
