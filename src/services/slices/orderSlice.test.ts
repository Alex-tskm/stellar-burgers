import { orderSlice, orderActions, orderSelectors } from './orderSlice';
import { createOrder, fetchOrderByNumber } from '../thunks/orderThunk';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

// Mock данных для тестов
const mockOrder: TOrder = {
  _id: '654321',
  name: 'Филе-о-фиш',
  number: 12345,
  createdAt: '2023-10-10T12:00:00Z',
  updatedAt: '2023-10-10T12:05:00Z',
  status: 'done',
  ingredients: ['1', '2', '3']
};

const mockState: RootState = {
  order: {
    newOrder: mockOrder,
    newOrderRequest: false,
    currentOrder: mockOrder,
    currentOrderLoading: false,
    requestStatus: 'succeeded'
  }
};

describe('orderSlice', () => {
  describe('начальное состояние', () => {
    it('должно иметь корректное начальное состояние', () => {
      const state = orderSlice.reducer(undefined, { type: '' });

      expect(state).toEqual({
        newOrder: null,
        newOrderRequest: false,
        currentOrder: null,
        currentOrderLoading: false,
        requestStatus: 'idle'
      });
    });
  });

  describe('редьюсеры', () => {
    it('clearNewOrder должен обнулить newOrder', () => {
      const initialState = {
        ...mockState.order,
        newOrder: mockOrder
      };

      const state = orderSlice.reducer(
        initialState,
        orderActions.clearNewOrder()
      );

      expect(state.newOrder).toBeNull();
    });

    it('clearCurrentOrder должен обнулить currentOrder', () => {
      const initialState = {
        ...mockState.order,
        currentOrder: mockOrder
      };

      const state = orderSlice.reducer(
        initialState,
        orderActions.clearCurrentOrder()
      );

      expect(state.currentOrder).toBeNull();
    });
  });

  describe('extraReducers (createOrder)', () => {
    it('pending должен установить newOrderRequest = true и requestStatus = "loading"', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        createOrder.pending('request-id', ['1', '2'])
      );

      expect(state.newOrderRequest).toBe(true);
      expect(state.requestStatus).toBe('loading');
    });

    it('fulfilled должен сохранить newOrder и установить requestStatus = "succeeded"', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        createOrder.fulfilled(mockOrder, 'request-id', ['1', '2'])
      );

      expect(state.newOrder).toEqual(mockOrder);
      expect(state.requestStatus).toBe('succeeded');
      expect(state.newOrderRequest).toBe(false);
    });

    it('rejected должен установить requestStatus = "failed" и newOrderRequest = false', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        createOrder.rejected('request-id', null, ['1', '2'])
      );

      expect(state.requestStatus).toBe('failed');
      expect(state.newOrderRequest).toBe(false);
      expect(state.newOrder).toEqual(mockOrder);
    });
  });

  describe('extraReducers (fetchOrderByNumber)', () => {
    it('pending должен установить currentOrderLoading = true', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        fetchOrderByNumber.pending('request-id', 12345)
      );

      expect(state.currentOrderLoading).toBe(true);
    });

    it('fulfilled должен сохранить currentOrder', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        fetchOrderByNumber.fulfilled(mockOrder, 'request-id', 12345)
      );

      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.currentOrderLoading).toBe(false);
    });

    it('rejected должен установить currentOrderLoading = false', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        fetchOrderByNumber.rejected('request-id', null, 12345)
      );

      expect(state.currentOrderLoading).toBe(false);
      // currentOrder остаётся прежним (не обнуляется)
      expect(state.currentOrder).toEqual(mockState.order.currentOrder);
    });
  });

  describe('селекторы', () => {
    it('newOrderSelect должен вернуть newOrder', () => {
      const result = orderSelectors.newOrderSelect(mockState);
      expect(result).toEqual(mockOrder);
    });

    it('newOrderRequestSelect должен вернуть newOrderRequest', () => {
      const result = orderSelectors.newOrderRequestSelect(mockState);
      expect(result).toBe(false);
    });

    it('currentOrderSelect должен вернуть currentOrder', () => {
      const result = orderSelectors.currentOrderSelect(mockState);
      expect(result).toEqual(mockOrder);
    });

    it('currentOrderLoadingSelect должен вернуть currentOrderLoading', () => {
      const result = orderSelectors.currentOrderLoadingSelect(mockState);
      expect(result).toBe(false);
    });

    it('orderIsLoadingSelect должен вернуть true при requestStatus = "loading"', () => {
      const loadingState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'loading'
        }
      };

      const result = orderSelectors.orderIsLoadingSelect(loadingState);
      expect(result).toBe(true);
    });

    it('orderIsLoadingSelect должен вернуть false при других статусах', () => {
      const idleState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'idle'
        }
      };
      const succeededState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'succeeded'
        }
      };
      const failedState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'failed'
        }
      };

      expect(orderSelectors.orderIsLoadingSelect(idleState)).toBe(false);
      expect(orderSelectors.orderIsLoadingSelect(succeededState)).toBe(false);
      expect(orderSelectors.orderIsLoadingSelect(failedState)).toBe(false);
    });
  });
});
