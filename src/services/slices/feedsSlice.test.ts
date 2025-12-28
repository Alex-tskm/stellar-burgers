import { TOrder, TOrdersData } from '@utils-types';
import { fetchFeed, fetchProfileOrders } from '../thunks/feedsThunk';
import { feedsSlice, feedsActions, FeedsState } from './feedsSlice';

// Копируем определение из API (без экспорта)
type TServerResponse<T> = { success: boolean } & T;
type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

describe('feedsSlice', () => {
  // Начальное состояние — ТОЛЬКО поля из реального FeedsState
  const initialState: FeedsState = {
    feed: null,
    ordersAuth: [],
    requestStatus: 'idle' // единственное допустимое поле!
  };

  // Mock-данные для тестов
  const testOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Test order',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 1234,
    ingredients: ['id1', 'id2']
  };

  const feedData: TFeedsResponse = {
    success: true,
    orders: [testOrder],
    total: 1,
    totalToday: 1
  };

  const ordersAuthData: TOrder[] = [testOrder];

  // Тесты для fetchFeed
  it('requestStatus = "loading" при fetchFeed.pending', () => {
    const state = feedsSlice.reducer(
      initialState,
      fetchFeed.pending('', undefined)
    );
    expect(state.requestStatus).toBe('loading');
  });

  it('feed обновляется и requestStatus = "succeeded" при fetchFeed.fulfilled', () => {
    const state = feedsSlice.reducer(
      initialState,
      fetchFeed.fulfilled(feedData, '', undefined) // <-- Только feedData
    );
    expect(state.feed).toEqual(feedData);
    expect(state.requestStatus).toBe('succeeded');
  });

  it('requestStatus = "failed" при fetchFeed.rejected', () => {
    const testError = new Error('Ошибка загрузки ленты');

    const state = feedsSlice.reducer(
      initialState,
      fetchFeed.rejected(testError, '', undefined)
    );

    expect(state.requestStatus).toBe('failed');
  });

  // Тесты для fetchProfileOrders
  it('ordersAuth обновляется при fetchProfileOrders.fulfilled', () => {
    const state = feedsSlice.reducer(
      initialState,
      fetchProfileOrders.fulfilled(ordersAuthData, '', undefined)
    );

    expect(state.ordersAuth).toEqual(ordersAuthData);
  });

  // Дополнительные тесты для редьюсеров
  it('clearFeed устанавливает feed в null', () => {
    const stateWithFeed = { ...initialState, feed: feedData };
    const state = feedsSlice.reducer(stateWithFeed, feedsActions.clearFeed());
    expect(state.feed).toBeNull();
  });

  it('clearProfileOrders очищает ordersAuth', () => {
    const stateWithOrders = { ...initialState, ordersAuth: ordersAuthData };
    const state = feedsSlice.reducer(
      stateWithOrders,
      feedsActions.clearProfileOrders()
    );
    expect(state.ordersAuth).toEqual([]);
  });
});
