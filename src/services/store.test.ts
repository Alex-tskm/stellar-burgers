import store from './store';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { constructorSlice } from './slices/constructorSlice';
import { orderSlice } from './slices/orderSlice';
import { userSlice } from './slices/userSlice';
import { feedsSlice } from './slices/feedsSlice';
import { combineReducers } from '@reduxjs/toolkit';
import { initialState as initialStateIngredients } from './slices/ingredientsSlice';
import { initialState as initialStateBurger } from './slices/constructorSlice';
import { initialState as initialStateUser } from './slices/userSlice';
import { initialState as initialStateFeeds } from './slices/feedsSlice';
import { initialState as initialStateOrder } from './slices/orderSlice';

describe('root store', () => {
  const rootReducer = combineReducers({
    ingredients: ingredientsSlice.reducer,
    burgerConstructor: constructorSlice.reducer,
    order: orderSlice.reducer,
    user: userSlice.reducer,
    feeds: feedsSlice.reducer
  });

  it('rootReducer возвращает начальное состояние', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // ingredients
    expect(state.ingredients).toEqual(initialStateIngredients);

    // burgerConstructor
    expect(state.burgerConstructor).toEqual(initialStateBurger);

    // order
    expect(state.order).toEqual(initialStateOrder);

    // user
    expect(state.user).toEqual(initialStateUser);

    // feeds
    expect(state.feeds).toEqual(initialStateFeeds);
  });

  it('store.getState() совпадает с initialState', () => {
    const expectedState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const state = store.getState();

    expect(state).toEqual(expectedState);
  });
});
