import { userSlice, userActions, userSelectors } from './userSlice';
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../thunks/userThunk';
import { TUser } from '../../utils/types';
import { RootState } from '../store';

// Mock данных для тестов
const mockUser: TUser = {
  name: 'Иван',
  email: 'ivan@example.com',
  _id: '123'
};

const mockState: RootState = {
  user: {
    user: mockUser,
    userCheck: true,
    requestStatus: 'succeeded'
  }
};

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

      expect(state.userCheck).toBe(true);
    });

    it('userLogout должен обнулить user и установить userCheck = true', () => {
      const initialState = { ...mockState.user };

      const state = userSlice.reducer(initialState, userActions.userLogout());

      expect(state.user).toBeNull();
      expect(state.userCheck).toBe(true);
    });
  });

  describe('extraReducers (fetchUser)', () => {
    it('pending должен установить requestStatus = "loading"', () => {
      const initialState = { ...mockState.user };

      const state = userSlice.reducer(
        initialState,
        fetchUser.pending('request-id', undefined)
      );

      expect(state.requestStatus).toBe('loading');
    });

    it('fulfilled должен сохранить user и установить userCheck = true, requestStatus = "succeeded"', () => {
      const initialState = { ...mockState.user };

      const actionPayload = { user: mockUser };

      const state = userSlice.reducer(
        initialState,
        fetchUser.fulfilled(actionPayload, 'request-id', undefined)
      );

      expect(state.user).toEqual(mockUser);
      expect(state.userCheck).toBe(true);
      expect(state.requestStatus).toBe('succeeded');
    });

    it('rejected должен установить requestStatus = "failed" и userCheck = true', () => {
      const initialState = { ...mockState.user };

      const state = userSlice.reducer(
        initialState,
        fetchUser.rejected('request-id', null, undefined)
      );

      expect(state.requestStatus).toBe('failed');
      expect(state.userCheck).toBe(true);
      // user остаётся прежним (не обнуляется)
      expect(state.user).toEqual(mockState.user.user);
    });
  });

  describe('extraReducers (loginUser)', () => {
    it('fulfilled должен обновить user и установить userCheck = true', () => {
      const initialState = { ...mockState.user };

      const actionPayload = { user: mockUser };

      const state = userSlice.reducer(
        initialState,
        loginUser.fulfilled(actionPayload, 'request-id', {
          email: 'a@b.com',
          password: 'pass'
        })
      );

      expect(state.user).toEqual(mockUser);
      expect(state.userCheck).toBe(true);
    });
  });

  describe('extraReducers (registerUser)', () => {
    it('fulfilled должен сохранить нового пользователя и установить userCheck = true', () => {
      const initialState = { ...mockState.user };

      const actionPayload = { user: mockUser };

      const state = userSlice.reducer(
        initialState,
        registerUser.fulfilled(actionPayload, 'request-id', {
          email: 'a@b.com',
          password: 'pass',
          name: 'Иван'
        })
      );

      expect(state.user).toEqual(mockUser);
      expect(state.userCheck).toBe(true);
    });
  });

  describe('extraReducers (updateUser)', () => {
    it('fulfilled должен обновить данные пользователя', () => {
      const initialState = { ...mockState.user };

      const updatedUser: TUser = { ...mockUser, name: 'Пётр' };
      const actionPayload = { user: updatedUser };

      const state = userSlice.reducer(
        initialState,
        updateUser.fulfilled(actionPayload, 'request-id', { name: 'Пётр' })
      );

      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('extraReducers (logoutUser)', () => {
    it('fulfilled должен обнулить user и установить userCheck = true', () => {
      const initialState = { ...mockState.user };

      const state = userSlice.reducer(
        initialState,
        logoutUser.fulfilled(undefined, 'request-id', undefined)
      );

      expect(state.user).toBeNull();
      expect(state.userCheck).toBe(true);
    });
  });

  describe('селекторы', () => {
    it('userSelect должен вернуть текущего пользователя', () => {
      const result = userSelectors.userSelect(mockState);
      expect(result).toEqual(mockUser);
    });

    it('isAuthCheckedSelect должен вернуть флаг проверки авторизации', () => {
      const result = userSelectors.isAuthCheckedSelect(mockState);
      expect(result).toBe(true);
    });

    it('userIsLoadingSelect должен вернуть true при requestStatus = "loading"', () => {
      const loadingState: RootState = {
        user: {
          ...mockState.user,
          requestStatus: 'loading'
        }
      };

      const result = userSelectors.userIsLoadingSelect(loadingState);
      expect(result).toBe(true);
    });

    it('userIsLoadingSelect должен вернуть false при других статусах', () => {
      const idleState: RootState = {
        user: {
          ...mockState.user,
          requestStatus: 'idle'
        }
      };
      const succeededState: RootState = {
        user: {
          ...mockState.user,
          requestStatus: 'succeeded'
        }
      };
      const failedState: RootState = {
        user: {
          ...mockState.user,
          requestStatus: 'failed'
        }
      };

      expect(userSelectors.userIsLoadingSelect(idleState)).toBe(false);
      expect(userSelectors.userIsLoadingSelect(succeededState)).toBe(false);
      expect(userSelectors.userIsLoadingSelect(failedState)).toBe(false);
    });
  });
});
