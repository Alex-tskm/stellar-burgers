import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types'; // Импортируем тип заказа

/**
 * Создание заказа через API
 * @param ingredientIds - массив ID ингредиентов для заказа
 * @returns Объект заказа (TOrder)
 */
export const createOrder = createAsyncThunk<
  TOrder, // Тип успешного результата: объект заказа
  string[], // Тип аргумента: массив ID ингредиентов
  { rejectValue: unknown } // Тип ошибки при rejectWithValue
>('order/create', async (ingredientIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    return response.order; // Возвращаем объект заказа
  } catch (error) {
    // Передаём ошибку в rejected action для обработки в reducers
    return rejectWithValue(error);
  }
});

/**
 * Получение заказа по номеру через API
 * @param number - номер заказа (числовой идентификатор)
 * @returns Найденный заказ (TOrder) или ошибка
 */
export const fetchOrderByNumber = createAsyncThunk<
  TOrder, // Тип успешного результата: объект заказа
  number, // Тип аргумента: номер заказа
  { rejectValue: unknown } // Тип ошибки при rejectWithValue
>('order/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);

    // Проверяем, что заказы существуют и массив не пуст
    if (!response.orders || response.orders.length === 0) {
      throw new Error(`Заказ с номером ${number} не найден`);
    }

    // Возвращаем первый (и единственный) заказ из массива
    return response.orders[0];
  } catch (error) {
    // Передаём ошибку в rejected action для обработки в reducers
    return rejectWithValue(error);
  }
});
