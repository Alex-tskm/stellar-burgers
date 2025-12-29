import {
  orderSlice,
  orderActions,
  orderSelectors,
  initialState as initialStateOrder
} from './orderSlice';
import { createOrder, fetchOrderByNumber } from '../thunks/orderThunk';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';
import { initialState as initialStateIngredients } from './ingredientsSlice';
import { initialState as initialStateBurger } from './constructorSlice';
import { initialState as initialStateUser } from './userSlice';
import { initialState as initialStateFeeds } from './feedsSlice';

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

// === Вынесенные селекторы (константы) ===
const selectOrderState = (state: RootState) => state.order;
const selectNewOrder = (state: RootState) => selectOrderState(state).newOrder;
const selectNewOrderRequest = (state: RootState) => selectOrderState(state).newOrderRequest;
const selectCurrentOrder = (state: RootState) => selectOrderState(state).currentOrder;
const selectCurrentOrderLoading = (state: RootState) => selectOrderState(state).currentOrderLoading;
const selectRequestStatus = (state: RootState) => selectOrderState(state).requestStatus;
const makeOrderIsLoading = (state: RootState) => selectRequestStatus(state) === 'loading';


// === Тестовые данные ===
const mockState: RootState = {
  order: {
    newOrder: mockOrder,
    newOrderRequest: false,
    currentOrder: mockOrder,
    currentOrderLoading: false,
    requestStatus: 'succeeded'
  },
  ingredients: initialStateIngredients,
  burgerConstructor: initialStateBurger,
  user: initialStateUser,
  feeds: initialStateFeeds
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

      expect(selectNewOrder({ order: state } as RootState)).toBeNull();
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

      expect(selectCurrentOrder({ order: state } as RootState)).toBeNull();
    });
  });

  describe('extraReducers (createOrder)', () => {
    it('pending должен установить newOrderRequest = true и requestStatus = "loading"', () => {
      const initialState = { ...mockState.order };


      const state = orderSlice.reducer(
        initialState,
        createOrder.pending('request-id', ['1', '2'])
      );

      expect(selectNewOrderRequest({ order: state } as RootState)).toBe(true);
      expect(selectRequestStatus({ order: state } as RootState)).toBe('loading');
    });

    it('fulfilled должен сохранить newOrder и установить requestStatus = "succeeded"', () => {
      const initialState = { ...mockState.order };


      const state = orderSlice.reducer(
        initialState,
        createOrder.fulfilled(mockOrder, 'request-id', ['1', '2'])
      );

      expect(selectNewOrder({ order: state } as RootState)).toEqual(mockOrder);
      expect(selectRequestStatus({ order: state } as RootState)).toBe('succeeded');
      expect(selectNewOrderRequest({ order: state } as RootState)).toBe(false);
    });

    it('rejected должен установить requestStatus = "failed" и newOrderRequest = false', () => {
      const initialState = { ...mockState.order };


      const state = orderSlice.reducer(
        initialState,
        createOrder.rejected('request-id' as any, null as any, ['1', '2'])
      );

      expect(selectRequestStatus({ order: state } as RootState)).toBe('failed');
      expect(selectNewOrderRequest({ order: state } as RootState)).toBe(false);
      expect(selectNewOrder({ order: state } as RootState)).toEqual(mockOrder);
    });
  });

  describe('extraReducers (fetchOrderByNumber)', () => {
    it('pending должен установить currentOrderLoading = true', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        fetchOrderByNumber.pending('request-id', 12345)
      );

      expect(selectCurrentOrderLoading({ order: state } as RootState)).toBe(true);
    });

    it('fulfilled должен сохранить currentOrder', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        fetchOrderByNumber.fulfilled(mockOrder, 'request-id', 12345)
      );

      expect(selectCurrentOrder({ order: state } as RootState)).toEqual(mockOrder);
      expect(selectCurrentOrderLoading({ order: state } as RootState)).toBe(false);
    });

    it('rejected должен установить currentOrderLoading = false', () => {
      const initialState = { ...mockState.order };

      const state = orderSlice.reducer(
        initialState,
        fetchOrderByNumber.rejected('request-id' as any, null as any, 12345)
      );

      expect(selectCurrentOrderLoading({ order: state } as RootState)).toBe(false);
      // currentOrder остаётся прежним (не обнуляется)
      expect(selectCurrentOrder({ order: state } as RootState)).toEqual(mockState.order.currentOrder);
    });
  });

  describe('селекторы', () => {
    it('newOrderSelect должен вернуть newOrder', () => {
      const result = selectNewOrder(mockState);
      expect(result).toEqual(mockOrder);
    });

    it('newOrderRequestSelect должен вернуть newOrderRequest', () => {
      const result = selectNewOrderRequest(mockState);
      expect(result).toBe(false);
    });

    it('currentOrderSelect должен вернуть currentOrder', () => {
      const result = selectCurrentOrder(mockState);
      expect(result).toEqual(mockOrder);
    });

    it('currentOrderLoadingSelect должен вернуть currentOrderLoading', () => {
      const result = selectCurrentOrderLoading(mockState);
      expect(result).toBe(false);
    });

    it('orderIsLoadingSelect должен вернуть true при requestStatus = "loading"', () => {
      const loadingState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'loading'
        },
        ingredients: initialStateIngredients,
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        feeds: initialStateFeeds
      };

      const result = makeOrderIsLoading(loadingState);
      expect(result).toBe(true);
    });

    it('orderIsLoadingSelect должен вернуть false при других статусах', () => {
      const idleState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'idle'
        },
        ingredients: initialStateIngredients,
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        feeds: initialStateFeeds
      };
      const succeededState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'succeeded'
        },
        ingredients: initialStateIngredients,
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        feeds: initialStateFeeds
      };
      const failedState: RootState = {
        order: {
          ...mockState.order,
          requestStatus: 'failed'
        },
        ingredients: initialStateIngredients,
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        feeds: initialStateFeeds
      };

      expect(makeOrderIsLoading(idleState)).toBe(false);
      expect(makeOrderIsLoading(succeededState)).toBe(false);
      expect(makeOrderIsLoading(failedState)).toBe(false);
    });
  });
});
