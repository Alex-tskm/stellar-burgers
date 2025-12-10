import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

/**
 * Загрузка списка ингредиентов из API
 * @returns Массив ингредиентов (TIngredient[])
 */
export const fetchIngredients = createAsyncThunk<
  TIngredient[], // Успешный результат: массив ингредиентов
  void, // Аргументы отсутствуют
  { rejectValue: unknown } // Тип ошибки при rejectWithValue
>('ingredients/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();

    // Дополнительная проверка типа данных
    if (!Array.isArray(response)) {
      throw new Error(
        'API вернул некорректный формат данных: ожидается массив'
      );
    }

    return response; // Возвращаем полученный массив ингредиентов
  } catch (error) {
    // Передаём ошибку в rejected action для обработки в reducers
    return rejectWithValue(error);
  }
});
