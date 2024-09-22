import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import signReducer from './reducers/signReducer';
import cartReducer from './reducers/cartReducer';
import deliveryReducer from './reducers/deliveryReducer';
import filterReducer from './reducers/filterReducer';
import historyReducer from './reducers/historyReducer';
import ingredientReducer from './reducers/ingredientReducer';
import dineInReducer from './reducers/dineInReducer';
import pickupReducer from './reducers/pickupReducer';
import orderReducer from './reducers/orderReducer';
import dishesReducer from './reducers/dishReducer';

const signPersistConfig = {
  key: 'sign',
  storage,
  whitelist: ['isLogin', 'token'],
};

const persistedSignReducer = persistReducer(signPersistConfig, signReducer);

const rootReducer = combineReducers({
  sign: persistedSignReducer,
  cart: cartReducer,
  delivery: deliveryReducer,
  dinein: dineInReducer,
  pickup: pickupReducer,
  filter: filterReducer,
  history: historyReducer,
  ingredient: ingredientReducer,
  order: orderReducer,
  dish: dishesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as RootState;
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {}
};

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

const persistor = persistStore(store);

export { store, persistor };
