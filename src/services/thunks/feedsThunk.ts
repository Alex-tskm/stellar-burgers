import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

/**
 * Загрузка ленты заказов (feed) из API
 * @returns Данные ленты заказов (включая total, totalToday и массив orders)
 */
export const fetchFeed = createAsyncThunk<
  Awaited<ReturnType<typeof getFeedsApi>>, // Тип результата getFeedsApi
  void, // Нет аргументов
  { rejectValue: unknown } // Тип ошибки при rejectWithValue
>('feeds/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

/**
 * Загрузка заказов пользователя из API
 * @returns Массив заказов пользователя (TOrder[])
 */
export const fetchProfileOrders = createAsyncThunk<
  TOrder[], // Тип результата: массив заказов
  void, // Нет аргументов
  { rejectValue: unknown } // Тип ошибки при rejectWithValue
>('feeds/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();

    // Дополнительная проверка: убедимся, что ответ — массив заказов
    if (!Array.isArray(response)) {
      throw new Error(
        'API вернул некорректный формат данных: ожидается массив заказов'
      );
    }

    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
