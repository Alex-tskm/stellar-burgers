import {
  constructorSlice,
  constructorActions,
  constructorSelectors
} from './constructorSlice';
import {
  TConstructorIngredient,
  TIngredient,
  TConstructorFields
} from '../../utils/types';
import { RootState } from '../store';

// Тестовые данные
const testBun: TIngredient = {
  _id: '2',
  name: 'Булка розовая',
  type: 'bun',
  proteins: 10,
  fat: 26,
  carbohydrates: 57,
  calories: 270,
  price: 120,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const testIngredient1: TIngredient = {
  _id: '3',
  name: 'Начинка 1',
  type: 'main',
  proteins: 12,
  fat: 30,
  carbohydrates: 63,
  calories: 500,
  price: 270,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

const testIngredient2: TIngredient = {
  _id: '4',
  name: 'Начинка 2',
  type: 'main',
  proteins: 15,
  fat: 28,
  carbohydrates: 75,
  calories: 570,
  price: 310,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/meat/main-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/meat/main-02-large.png'
};

const initialState: RootState['burgerConstructor'] = {
  bun: null,
  ingredients: []
};

describe('constructorSlice', () => {
  describe('addIngredient', () => {
    it('добавляет булку, заменяя существующую', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient({ ingredient: testBun })
      );
      expect(state.bun).not.toBeNull();
      expect(state.bun?._id).toBe('2');
      expect(state.ingredients.length).toBe(0);
    });

    it('добавляет ингредиент в массив ingredients', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient({ ingredient: testIngredient1 })
      );
      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]._id).toBe('3');
      expect(state.bun).toBeNull();
    });

    it('при добавлении булки заменяет предыдущую', () => {
      let state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient({ ingredient: testBun })
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient({
          ingredient: { ...testBun, _id: '5' }
        })
      );
      expect(state.bun?._id).toBe('5');
    });

    it('генерирует уникальный id для ингредиента', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient({ ingredient: testIngredient1 })
      );
      expect(state.ingredients[0].id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент по id', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.removeIngredient({ id: 'i1' })
      );
      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0].id).toBe('i2');
    });

    it('не изменяет состояние, если id не найден', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.removeIngredient({ id: 'not-exists' })
      );
      expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
    });

    it('очищает массив, если удалить все ингредиенты', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      let state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.removeIngredient({ id: 'i1' })
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.removeIngredient({ id: 'i2' })
      );
      expect(state.ingredients.length).toBe(0);
    });
  });

  describe('moveIngredient', () => {
    it('перемещает ингредиент с from на to', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: 0, to: 1 })
      );
      expect(state.ingredients[0].id).toBe('i2');
      expect(state.ingredients[1].id).toBe('i1');
    });

    it('не изменяет массив, если from === to', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: 1, to: 1 })
      );
      expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
    });

    it('корректно обрабатывает перемещение в начало массива', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' },
          { ...testIngredient1, id: 'i3' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: 2, to: 0 })
      );
      expect(state.ingredients[0].id).toBe('i3');
      expect(state.ingredients[1].id).toBe('i1');
      expect(state.ingredients[2].id).toBe('i2');
    });

    it('корректно обрабатывает перемещение в конец массива', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: 0, to: 1 })
      );
      expect(state.ingredients[0].id).toBe('i2');
      expect(state.ingredients[1].id).toBe('i1');
    });

    it('обрабатывает перемещение с отрицательным from (должно игнорировать)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: -1, to: 0 })
      );
      // При некорректных индексах состояние не должно меняться
      expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
    });

    it('обрабатывает перемещение с from больше длины массива (должно игнорировать)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: 10, to: 0 })
      );
      expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
    });

    it('обрабатывает перемещение с отрицательным to (должно игнорировать)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: 0, to: -1 })
      );
      expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
    });

    it('обрабатывает перемещение с to больше длины массива (должно добавлять в конец)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient1, id: 'i1' },
          { ...testIngredient2, id: 'i2' }
        ] as TConstructorIngredient[]
      };
      const state = constructorSlice.reducer(
        stateWithIngredients,
        constructorActions.moveIngredient({ from: 0, to: 5 })
      );

      expect(state.ingredients[0].id).toBe('i2');
      expect(state.ingredients[1].id).toBe('i1');
    });
  });

  describe('clearConstructor', () => {
    it('очищает bun и ingredients', () => {
      // Создаём корректные TConstructorIngredient с id
      const bunWithId: TConstructorIngredient = {
        ...testBun,
        id: 'bun-123' // Добавляем обязательный id
      };

      const ingredient1WithId: TConstructorIngredient = {
        ...testIngredient1,
        id: 'i1'
      };

      const ingredient2WithId: TConstructorIngredient = {
        ...testIngredient2,
        id: 'i2'
      };

      const stateWithData: TConstructorFields = {
        bun: bunWithId,
        ingredients: [ingredient1WithId, ingredient2WithId]
      };

      const state = constructorSlice.reducer(
        stateWithData,
        constructorActions.clearConstructor()
      );

      expect(state.bun).toBeNull();
      expect(state.ingredients.length).toBe(0);
    });

    it('работает с пустым состоянием (не вызывает ошибок)', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorActions.clearConstructor()
      );
      expect(state.bun).toBeNull();
      expect(state.ingredients.length).toBe(0);
    });
  });

  describe('селекторы', () => {
    // Подготовка тестовых данных
    const bunWithId: TConstructorIngredient = { ...testBun, id: 'bun-123' };
    const ingredient1WithId: TConstructorIngredient = {
      ...testIngredient1,
      id: 'i1'
    };
    const ingredient2WithId: TConstructorIngredient = {
      ...testIngredient2,
      id: 'i2'
    };

    // Частичный макет состояния (только нужный слайс)
    const mockState: Partial<RootState> = {
      burgerConstructor: {
        bun: bunWithId,
        ingredients: [ingredient1WithId, ingredient2WithId]
      }
    };

    it('constructorBurgerElement возвращает полное состояние', () => {
      const result = constructorSelectors.constructorBurgerElement(
        mockState as RootState
      );
      expect(result).toEqual(mockState.burgerConstructor);
    });

    it('constructorBurgerIsBun возвращает текущую булочку', () => {
      const result = constructorSelectors.constructorBurgerIsBun(
        mockState as RootState
      );
      expect(result).toEqual(bunWithId);
    });

    it('constructorBurgerIsIngredients возвращает массив ингредиентов', () => {
      const result = constructorSelectors.constructorBurgerIsIngredients(
        mockState as RootState
      );
      expect(result).toEqual(mockState.burgerConstructor?.ingredients);
    });

    it('селекторы корректно работают с пустым состоянием', () => {
      const emptyState: Partial<RootState> = {
        burgerConstructor: initialState
      };

      expect(
        constructorSelectors.constructorBurgerElement(emptyState as RootState)
      ).toEqual(initialState);
      expect(
        constructorSelectors.constructorBurgerIsBun(emptyState as RootState)
      ).toBeNull();
      expect(
        constructorSelectors.constructorBurgerIsIngredients(
          emptyState as RootState
        ).length
      ).toBe(0);
    });
  });
});
