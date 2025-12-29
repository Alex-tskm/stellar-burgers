import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { createOrder, fetchOrderByNumber } from '../thunks/orderThunk';

// Тип статуса запроса для отображения состояний загрузки/ошибок в UI
type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Основное состояние модуля заказов
type OrderState = {
  // Состояние для создания нового заказа
  newOrder: TOrder | null; // Данные созданного заказа или null
  newOrderRequest: boolean; // Флаг отправки запроса на создание заказа

  // Состояние для просмотра конкретного заказа
  currentOrder: TOrder | null; // Текущий просматриваемый заказ или null
  currentOrderLoading: boolean; // Флаг загрузки заказа по номеру

  requestStatus: RequestStatus; // Общий статус асинхронных операций
};

// Начальное состояние slice
const initialState: OrderState = {
  newOrder: null,
  newOrderRequest: false,
  currentOrder: null,
  currentOrderLoading: false,
  requestStatus: 'idle'
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    /**
     * Очищает данные созданного заказа
     * Используется, например, после успешного оформления или отмены
     */
    clearNewOrder: (state) => {
      state.newOrder = null;
    },

    /**
     * Очищает текущий просматриваемый заказ
     * Используется при закрытии модального окна заказа
     */
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для createOrder (создание нового заказа)
      .addCase(createOrder.pending, (state) => {
        state.newOrderRequest = true;
        state.requestStatus = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.newOrderRequest = false;
        state.requestStatus = 'succeeded';
        state.newOrder = action.payload; // Сохраняем данные созданного заказа
      })
      .addCase(createOrder.rejected, (state) => {
        state.newOrderRequest = false;
        state.requestStatus = 'failed';
      })

      // Обработчики для fetchOrderByNumber (получение заказа по номеру)
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true; // Устанавливаем флаг загрузки
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false; // Снимаем флаг загрузки
        state.currentOrder = action.payload; // Сохраняем полученный заказ
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.currentOrderLoading = false; // Снимаем флаг загрузки при ошибке
        // currentOrder остаётся null (предыдущее значение сохраняется)
      });
  }
});

// Экспорт действий slice для использования в компонентах
export const orderActions = orderSlice.actions;

// Экспорт селекторов для удобного доступа к состоянию
export const orderSelectors = {
  /**
   * Возвращает данные последнего созданного заказа
   * @returns TOrder | null
   */
  newOrderSelect: (state: { order: OrderState }) => state.order.newOrder,

  /**
   * Проверяет, идёт ли отправка запроса на создание заказа
   * @returns boolean
   */
  newOrderRequestSelect: (state: { order: OrderState }) =>
    state.order.newOrderRequest,

  /**
   * Возвращает текущий просматриваемый заказ
   * @returns TOrder | null
   */
  currentOrderSelect: (state: { order: OrderState }) =>
    state.order.currentOrder,

  /**
   * Проверяет, загружается ли текущий заказ
   * @returns boolean
   */
  currentOrderLoadingSelect: (state: { order: OrderState }) =>
    state.order.currentOrderLoading,

  /**
   * Проверяет, находится ли приложение в состоянии загрузки
   * (относится к операциям createOrder)
   * @returns boolean
   */
  orderIsLoadingSelect: (state: { order: OrderState }) =>
    state.order.requestStatus === 'loading'
};

// Экспорт редуктора slice для подключения к store
export default orderSlice.reducer;

export { orderSlice };

export { initialState };
