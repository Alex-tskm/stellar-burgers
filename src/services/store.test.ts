import store from './store';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { constructorSlice } from './slices/constructorSlice';
import { orderSlice } from './slices/orderSlice';
import { userSlice } from './slices/userSlice';
import { feedsSlice } from './slices/feedsSlice';
import { combineReducers } from '@reduxjs/toolkit';

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
    expect(state.ingredients).toEqual({
      ingredients: [],
      requestStatus: 'idle'
    });

    // burgerConstructor
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    // order
    expect(state.order).toEqual({
      newOrder: null,
      newOrderRequest: false,
      currentOrder: null,
      currentOrderLoading: false,
      requestStatus: 'idle'
    });

    // user
    expect(state.user).toEqual({
      user: null,
      userCheck: false,
      requestStatus: 'idle'
    });

    // feeds
    expect(state.feeds).toEqual({
      feed: null,
      ordersAuth: [],
      requestStatus: 'idle'
    });
  });

  it('store.getState() совпадает с initialState', () => {
    const expectedState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const state = store.getState();

    expect(state).toEqual(expectedState);
  });
});
