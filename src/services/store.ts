import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import userOrdersReducer from './slices/userOrdersSlice';
import orderReducer from './slices/orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer,
  order: orderReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;