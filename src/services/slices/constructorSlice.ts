import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TConstructorFields
} from '../../utils/types';
import { RootState } from '../store';

// Начальное состояние конструктора бургера
const initialState: TConstructorFields = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    /**
     * Добавляет ингредиент в конструктор бургера
     * Для булочек заменяет текущую булочку
     * Для остальных ингредиентов добавляет в массив
     */
    addIngredient: {
      reducer: (
        state,
        action: PayloadAction<{ ingredient: TConstructorIngredient }>
      ) => {
        const { ingredient } = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: ({ ingredient }: { ingredient: TIngredient }) => {
        // Генерируем уникальный ID для ингредиента в конструкторе
        const uuid = crypto.randomUUID();
        return {
          payload: {
            ingredient: {
              ...ingredient,
              id: uuid
            } as TConstructorIngredient
          }
        };
      }
    },

    /**
     * Удаляет ингредиент из конструктора по ID
     * @param id - уникальный идентификатор ингредиента (поле id)
     */
    removeIngredient: (state, action: PayloadAction<{ id: string }>) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload.id
      );
    },

    /**
     * Перемещает ингредиент в массиве ингредиентов
     * Используется для изменения порядка ингредиентов в бургере
     * @param from - индекс исходного положения
     * @param to - индекс целевого положения
     */
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const [movedIngredient] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, movedIngredient);
    },

    /**
     * Очищает конструктор бургера полностью
     * Сбрасывает булочку и все ингредиенты
     */
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Экспорт действий slice для использования в компонентах
export const constructorActions = constructorSlice.actions;

// Экспорт селекторов для удобного доступа к состоянию
export const constructorSelectors = {
  /**
   * Возвращает полное состояние конструктора бургера
   * @returns TConstructorFields
   */
  constructorBurgerElement: (state: RootState) => state.burgerConstructor,

  /**
   * Возвращает текущую булочку в конструкторе
   * @returns TConstructorIngredient | null
   */
  constructorBurgerIsBun: (state: RootState) => state.burgerConstructor.bun,

  /**
   * Возвращает массив добавленных ингредиентов (без булочки)
   * @returns TConstructorIngredient[]
   */
  constructorBurgerIsIngredients: (state: RootState) =>
    state.burgerConstructor.ingredients
};

// Экспорт редуктора slice для подключения к store
export default constructorSlice.reducer;
