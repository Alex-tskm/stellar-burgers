import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { fetchIngredients } from '../thunks/ingredientsThunk';
import { RootState } from '../store';

// Тип статуса запроса для управления UI-состояниями (загрузка, успех, ошибка)
type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Основное состояние модуля ингредиентов
type IngredientsState = {
  ingredients: TIngredient[]; // Массив загруженных ингредиентов
  requestStatus: RequestStatus; // Текущий статус асинхронной операции
};

// Начальное состояние slice
const initialState: IngredientsState = {
  ingredients: [],
  requestStatus: 'idle'
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    /**
     * Дополнительный reducer для ручной очистки ингредиентов (опционально)
     * Может быть полезен при сбросе состояния приложения
     */
    clearIngredients: (state) => {
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчик начала загрузки ингредиентов
      .addCase(fetchIngredients.pending, (state) => {
        state.requestStatus = 'loading';
      })

      // Обработчик успешного получения ингредиентов
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.ingredients = action.payload; // Сохраняем полученные данные
      })

      // Обработчик ошибки при загрузке ингредиентов
      .addCase(fetchIngredients.rejected, (state) => {
        state.requestStatus = 'failed';
        // Не меняем ingredients — оставляем предыдущее состояние или пустой массив
      });
  }
});

// Экспорт действий slice (включая опциональный clearIngredients)
export const ingredientsActions = ingredientsSlice.actions;

// Экспорт селекторов для удобного доступа к состоянию
export const ingredientsSelectors = {
  /**
   * Возвращает полный массив ингредиентов
   * @returns TIngredient[]
   */
  ingredientsSelect: (state: RootState) => state.ingredients.ingredients,

  /**
   * Проверяет, идёт ли загрузка ингредиентов
   * @returns boolean
   */
  ingredientsIsLoadingSelect: (state: RootState) =>
    state.ingredients.requestStatus === 'loading',

  /**
   * Находит ингредиент по его ID
   * @param id - уникальный идентификатор ингредиента (_id)
   * @returns TIngredient | undefined - найденный ингредиент или undefined
   */
  ingredientByIdSelect: (state: RootState, id: string) =>
    state.ingredients.ingredients.find((ingredient) => ingredient._id === id)
};

// Экспорт редуктора slice для подключения к store
export default ingredientsSlice.reducer;
