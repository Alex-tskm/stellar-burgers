import { createSlice } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '../../utils/types';
import { fetchFeed, fetchProfileOrders } from '../thunks/feedsThunk';

// Тип статуса запроса для отображения состояний загрузки/ошибок в UI
type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Основное состояние модуля feeds (лента заказов и заказы пользователя)
type FeedsState = {
  feed: TOrdersData | null; // Лента заказов (общая) или null до загрузки
  ordersAuth: TOrder[]; // Заказы авторизованного пользователя
  requestStatus: RequestStatus; // Общий статус асинхронных операций
};

// Начальное состояние slice
const initialState: FeedsState = {
  feed: null,
  ordersAuth: [],
  requestStatus: 'idle'
};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    /**
     * Очищает ленту заказов (feed)
     * Может использоваться при выходе из профиля или сбросе состояния
     */
    clearFeed: (state) => {
      state.feed = null;
    },

    /**
     * Очищает список заказов пользователя
     * Полезно при logout или обновлении данных
     */
    clearProfileOrders: (state) => {
      state.ordersAuth = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для fetchFeed (загрузка общей ленты заказов)
      .addCase(fetchFeed.pending, (state) => {
        state.requestStatus = 'loading';
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.feed = action.payload; // Сохраняем полученные данные ленты
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.requestStatus = 'failed';
        // feed остаётся null или сохраняет предыдущее значение
      })

      // Обработчики для fetchProfileOrders (загрузка заказов пользователя)
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.ordersAuth = action.payload; // Обновляем список заказов пользователя
        // requestStatus не меняем — это отдельная операция
      });
  }
});

// Экспорт действий slice для использования в компонентах
export const feedsActions = feedsSlice.actions;

// Экспорт селекторов для удобного доступа к состоянию
export const feedsSelectors = {
  /**
   * Возвращает данные ленты заказов (общей)
   * @returns TOrdersData | null
   */
  feedSelect: (state: { feeds: FeedsState }) => state.feeds.feed,

  /**
   * Возвращает список заказов авторизованного пользователя
   * @returns TOrder[]
   */
  feedOrdersSelect: (state: { feeds: FeedsState }) => state.feeds.ordersAuth,

  /**
   * Проверяет, идёт ли загрузка данных (относится к fetchFeed)
   * @returns boolean
   */
  feedIsLoadingSelect: (state: { feeds: FeedsState }) =>
    state.feeds.requestStatus === 'loading'
};

// Экспорт редуктора slice для подключения к store
export default feedsSlice.reducer;

// Экспорт типа состояния
export type { FeedsState };
export { feedsSlice }; // Экспорт полного объекта slice
