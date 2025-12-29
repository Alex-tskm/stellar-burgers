import { userSlice, userActions, userSelectors } from './userSlice';
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../thunks/userThunk';
import { TUser, TIngredient } from '../../utils/types';
import { RootState } from '../store';
import { IngredientsState } from './ingredientsSlice';
import { initialState as initialStateIngredients } from './ingredientsSlice';
import { initialState as initialStateBurger } from './constructorSlice';
import { initialState as initialStateUser } from './userSlice';
import { initialState as initialStateFeeds } from './feedsSlice';
import { initialState as initialStateOrder } from './orderSlice';

// Mock данных для тестов
const mockUser: TUser = {
  name: 'Иван',
  email: 'ivan@example.com'
};

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

const mockState: RootState = {
  user: {
    user: mockUser,
    userCheck: true,
    requestStatus: 'succeeded'
  },
  ingredients: initialStateIngredients,
  order: initialStateOrder,
  burgerConstructor: initialStateBurger,
  feeds: initialStateFeeds
};

// === Вынесенные селекторы (константы) ===
const selectUserState = (state: RootState) => state.user;
const selectUser = (state: RootState) => selectUserState(state).user;
const selectIsAuthChecked = (state: RootState) => selectUserState(state).userCheck;
const selectRequestStatus = (state: RootState) => selectUserState(state).requestStatus;
const makeUserIsLoading = (state: RootState) => selectRequestStatus(state) === 'loading';

describe('userSlice', () => {
  describe('начальное состояние', () => {
    it('должно иметь корректное начальное состояние', () => {
      const state = userSlice.reducer(undefined, { type: '' });

      expect(state).toEqual({
        user: null,
        userCheck: false,
        requestStatus: 'idle'
      });
    });
  });

  describe('редьюсеры', () => {
    it('setUserCheck должен обновить userCheck', () => {
      const initialState = { ...mockState.user };

      const state = userSlice.reducer(
        initialState,
        userActions.setUserCheck(true)
      );

      expect(selectIsAuthChecked({ user: state } as RootState)).toBe(true);
    });

    it('userLogout должен обнулить user и установить userCheck = true', () => {
      const initialState = { ...mockState.user };


      const state = userSlice.reducer(initialState, userActions.userLogout());


      expect(selectUser({ user: state } as RootState)).toBeNull();
      expect(selectIsAuthChecked({ user: state } as RootState)).toBe(true);
    });
  });

  describe('extraReducers (fetchUser)', () => {
    it('pending должен установить requestStatus = "loading"', () => {
      const initialState = { ...mockState.user };


      const state = userSlice.reducer(
        initialState,
        fetchUser.pending('request-id', undefined)
      );

      expect(selectRequestStatus({ user: state } as RootState)).toBe('loading');
    });

    it('fulfilled должен сохранить user и установить userCheck = true, requestStatus = "succeeded"', () => {
      const initialState = { ...mockState.user };


      const actionPayload = { user: mockUser };

      const state = userSlice.reducer(
        initialState,
        fetchUser.fulfilled(actionPayload as any, 'request-id', undefined)
      );

      expect(selectUser({ user: state } as RootState)).toEqual(mockUser);
      expect(selectIsAuthChecked({ user: state } as RootState)).toBe(true);
      expect(selectRequestStatus({ user: state } as RootState)).toBe('succeeded');
    });

    it('rejected должен установить requestStatus = "failed" и userCheck = true', () => {
      const initialState = { ...mockState.user };

      const state = userSlice.reducer(
        initialState,
        fetchUser.rejected('request-id' as any, null as any, undefined)
      );

      expect(selectRequestStatus({ user: state } as RootState)).toBe('failed');
      expect(selectIsAuthChecked({ user: state } as RootState)).toBe(true);
      // user остаётся прежним (не обнуляется)
      expect(selectUser({ user: state } as RootState)).toEqual(mockState.user.user);
    });
  });

  describe('extraReducers (loginUser)', () => {
    it('fulfilled должен обновить user и установить userCheck = true', () => {
      const initialState = { ...mockState.user };

      const actionPayload = { user: mockUser };

      const state = userSlice.reducer(
        initialState,
        loginUser.fulfilled(actionPayload as any, 'request-id', {
          email: 'a@b.com',
          password: 'pass'
        })
      );

      expect(selectUser({ user: state } as RootState)).toEqual(mockUser);
      expect(selectIsAuthChecked({ user: state } as RootState)).toBe(true);
    });
  });

  describe('extraReducers (registerUser)', () => {
    it('fulfilled должен сохранить нового пользователя и установить userCheck = true', () => {
      const initialState = { ...mockState.user };

      const actionPayload = { user: mockUser };

      const state = userSlice.reducer(
        initialState,
        registerUser.fulfilled(actionPayload as any, 'request-id', {
          email: 'a@b.com',
          password: 'pass',
          name: 'Иван'
        })
      );

      expect(selectUser({ user: state } as RootState)).toEqual(mockUser);
      expect(selectIsAuthChecked({ user: state } as RootState)).toBe(true);
    });
  });

  describe('extraReducers (updateUser)', () => {
    it('fulfilled должен обновить данные пользователя', () => {
      const initialState = { ...mockState.user };

      const updatedUser: TUser = { ...mockUser, name: 'Пётр' };
      const actionPayload = { user: updatedUser };

      const state = userSlice.reducer(
        initialState,
        updateUser.fulfilled(actionPayload as any, 'request-id', {
          name: 'Пётр'
        })
      );

      expect(selectUser({ user: state } as RootState)).toEqual(updatedUser);
    });
  });

  describe('extraReducers (logoutUser)', () => {
    it('fulfilled должен обнулить user и установить userCheck = true', () => {
      const initialState = { ...mockState.user };


      const state = userSlice.reducer(
        initialState,
        logoutUser.fulfilled(undefined, 'request-id', undefined)
      );

      expect(selectUser({ user: state } as RootState)).toBeNull();
      expect(selectIsAuthChecked({ user: state } as RootState)).toBe(true);
    });
  });

  describe('селекторы', () => {
    it('userSelect должен вернуть текущего пользователя', () => {
      const result = selectUser(mockState);
      expect(result).toEqual(mockUser);
    });

    it('isAuthCheckedSelect должен вернуть флаг проверки авторизации', () => {
      const result = selectIsAuthChecked(mockState);
      expect(result).toBe(true);
    });

    it('userIsLoadingSelect должен вернуть true при requestStatus = "loading"', () => {
      const loadingState: RootState = {
        ...mockState,
        user: {
          ...mockState.user,
          requestStatus: 'loading'
        }
      };

      const result = makeUserIsLoading(loadingState);
      expect(result).toBe(true);
    });

    it('userIsLoadingSelect должен вернуть false при других статусах', () => {
      const idleState: RootState = {
        ...mockState,
        user: {
          ...mockState.user,
          requestStatus: 'idle'
        }
      };
      const succeededState: RootState = {
        ...mockState,
        user: {
          ...mockState.user,
          requestStatus: 'succeeded'
        }
      };
      const failedState: RootState = {
        ...mockState,
        user: {
          ...mockState.user,
          requestStatus: 'failed'
        }
      };

      expect(makeUserIsLoading(idleState)).toBe(false);
      expect(makeUserIsLoading(succeededState)).toBe(false);
      expect(makeUserIsLoading(failedState)).toBe(false);
    });
  });
});
