import {
  ingredientsSlice,
  ingredientsActions,
  ingredientsSelectors,
  IngredientsState,
  initialState as initialStateIngredients
} from './ingredientsSlice';
import { initialState as initialStateBurger } from './constructorSlice';
import { initialState as initialStateUser } from './userSlice';
import { initialState as initialStateOrder } from './orderSlice';
import { initialState as initialStateFeeds } from './feedsSlice';
import { fetchIngredients } from '../thunks/ingredientsThunk';
import { TIngredient } from '../../utils/types';
import { RootState } from '../store';

import { PayloadAction } from '@reduxjs/toolkit';

// Тип для rejected action
type FetchIngredientsRejected = PayloadAction<
  unknown,
  string,
  {
    arg: void;
    requestId: string;
    requestStatus: 'rejected';
    aborted: boolean;
    condition: boolean;
  } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
  Error | null
>;

// Mock данных для тестов
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Базилик',
    type: 'vegetable',
    proteins: 3,
    fat: 0.5,
    carbohydrates: 2,
    calories: 25,
    image: 'https://example.com/basil.png',
    image_mobile: 'https://example.com/basil-mobile.png',
    image_large: 'https://example.com/basil-large.png',
    price: 50
  },
  {
    _id: '2',
    name: 'Сыр',
    type: 'dairy',
    proteins: 20,
    fat: 25,
    carbohydrates: 1,
    calories: 300,
    image: 'https://example.com/cheese.png',
    image_mobile: 'https://example.com/cheese-mobile.png',
    image_large: 'https://example.com/cheese-large.png',
    price: 150
  }
];

describe('ingredientsSlice', () => {
  describe('начальное состояние', () => {
    it('должно иметь корректное начальное состояние', () => {
      const state = ingredientsSlice.reducer(undefined, { type: '' });

      expect(state).toEqual({
        ingredients: [],
        requestStatus: 'idle'
      });
    });
  });

  describe('reducers', () => {
    it('clearIngredients должен очистить массив ингредиентов', () => {
      const initialState: IngredientsState = {
        ingredients: mockIngredients,
        requestStatus: 'succeeded'
      };

      const state = ingredientsSlice.reducer(
        initialState,
        ingredientsActions.clearIngredients()
      );

      expect(state.ingredients).toEqual([]);
      expect(state.requestStatus).toBe('succeeded');
    });
  });

  describe('extraReducers (fetchIngredients)', () => {
    it('pending должен установить requestStatus = "loading"', () => {
      const initialState: IngredientsState = {
        ingredients: mockIngredients,
        requestStatus: 'idle'
      };

      const state = ingredientsSlice.reducer(
        initialState,
        fetchIngredients.pending('request-id', undefined)
      );

      expect(state.requestStatus).toBe('loading');
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('fulfilled должен сохранить ингредиенты и установить requestStatus = "succeeded"', () => {
      const state = ingredientsSlice.reducer(
        initialStateIngredients,
        fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
      );

      expect(state.requestStatus).toBe('succeeded');
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('rejected должен установить requestStatus = "failed"', () => {
      const initialState: IngredientsState = {
        ingredients: mockIngredients,
        requestStatus: 'loading'
      };

      const action = fetchIngredients.rejected(
        'request-id' as any,
        null as any
      ) as FetchIngredientsRejected;

      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.requestStatus).toBe('failed');
      expect(state.ingredients).toEqual(mockIngredients);
    });

    // Дополнительный тест: обработка ошибки с конкретным Error
    it('rejected с ошибкой должен установить requestStatus = "failed" и сохранить ошибку', () => {
      const initialState: IngredientsState = {
        ingredients: mockIngredients,
        requestStatus: 'loading'
      };

      const error = new Error('Test error');

      const state = ingredientsSlice.reducer(
        initialState,
        fetchIngredients.rejected('request-id' as any, error as any, undefined)
      );

      expect(state.requestStatus).toBe('failed');
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  describe('селекторы', () => {
    const mockState: RootState = {
      ingredients: {
        ingredients: mockIngredients,
        requestStatus: 'succeeded'
      },
      burgerConstructor: initialStateBurger,
      user: initialStateUser,
      order: initialStateOrder,
      feeds: initialStateFeeds
    };

    it('ingredientsSelect должен вернуть массив ингредиентов', () => {
      const result = ingredientsSelectors.ingredientsSelect(mockState);
      expect(result).toEqual(mockIngredients);
    });

    it('ingredientsIsLoadingSelect должен вернуть true при "loading"', () => {
      const loadingState: RootState = {
        ingredients: {
          ingredients: [],
          requestStatus: 'loading'
        },
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        order: initialStateOrder,
        feeds: initialStateFeeds
      };

      const result =
        ingredientsSelectors.ingredientsIsLoadingSelect(loadingState);
      expect(result).toBe(true);
    });

    it('ingredientsIsLoadingSelect должен вернуть false при других статусах', () => {
      const idleState: RootState = {
        ingredients: {
          ingredients: [],
          requestStatus: 'idle'
        },
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        order: initialStateOrder,
        feeds: initialStateFeeds
      };
      const succeededState: RootState = {
        ingredients: {
          ingredients: [],
          requestStatus: 'succeeded'
        },
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        order: initialStateOrder,
        feeds: initialStateFeeds
      };
      const failedState: RootState = {
        ingredients: {
          ingredients: [],
          requestStatus: 'failed'
        },
        burgerConstructor: initialStateBurger,
        user: initialStateUser,
        order: initialStateOrder,
        feeds: initialStateFeeds
      };

      expect(ingredientsSelectors.ingredientsIsLoadingSelect(idleState)).toBe(
        false
      );
      expect(
        ingredientsSelectors.ingredientsIsLoadingSelect(succeededState)
      ).toBe(false);
      expect(ingredientsSelectors.ingredientsIsLoadingSelect(failedState)).toBe(
        false
      );
    });

    it('ingredientByIdSelect должен найти ингредиент по _id', () => {
      const result = ingredientsSelectors.ingredientByIdSelect(mockState, '1');
      expect(result).toEqual(mockIngredients[0]);
    });

    it('ingredientByIdSelect должен вернуть undefined для несуществующего id', () => {
      const result = ingredientsSelectors.ingredientByIdSelect(
        mockState,
        '999'
      );
      expect(result).toBeUndefined();
    });
  });
});
