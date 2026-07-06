import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) => state.ingredients.isLoading;


export const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'bun')
);
export const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'main')
);
export const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'sauce')
);

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;

export const selectConstructorItems = (state: RootState) => state.burgerConstructor;

export const selectOrderRequest = (state: RootState) => state.order.orderRequest;
export const selectOrderModalData = (state: RootState) => state.order.orderModalData;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;

export const selectUserOrders = (state: RootState) => state.userOrders.orders;