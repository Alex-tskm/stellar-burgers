import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../thunks/userThunk';

// Тип статуса запроса для управления UI-состояниями
type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Основной тип состояния пользователя
type UserState = {
  user: TUser | null; // Данные пользователя или null (неавторизован)
  userCheck: boolean; // Флаг проверки авторизации
  requestStatus: RequestStatus; // Текущий статус асинхронной операции
};

// Начальное состояние slice
const initialState: UserState = {
  user: null,
  userCheck: false,
  requestStatus: 'idle'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Устанавливает флаг проверки пользователя
     * @param action.payload - новое значение флага (boolean)
     */
    setUserCheck: (state, action: PayloadAction<boolean>) => {
      state.userCheck = action.payload;
    },

    /**
     * Выполняет локальный logout (без запроса к API)
     * Очищает данные пользователя и устанавливает флаг проверки
     */
    userLogout: (state) => {
      state.user = null;
      state.userCheck = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.requestStatus = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.user = action.payload.user; // Сохраняем данные пользователя
        state.userCheck = true; // Отмечаем, что проверка пройдена
      })
      .addCase(fetchUser.rejected, (state) => {
        state.requestStatus = 'failed';
        state.userCheck = true; // Даже при ошибке считаем проверку завершённой
      })

      // Обработчики для loginUser
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Обновляем данные пользователя после входа
        state.userCheck = true; // Устанавливаем флаг проверки
      })

      // Обработчики для registerUser
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Сохраняем данные нового пользователя
        state.userCheck = true; // Устанавливаем флаг проверки
      })

      // Обработчики для updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Обновляем данные пользователя после редактирования
      })

      // Обработчики для logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Очищаем данные пользователя
        state.userCheck = true; // Устанавливаем флаг проверки (сессия завершена)
      });
  }
});

// Экспорт действий slice
export const userActions = userSlice.actions;

// Экспорт селекторов для удобного доступа к состоянию
export const userSelectors = {
  /**
   * Возвращает данные текущего пользователя
   */
  userSelect: (state: { user: UserState }) => state.user.user,

  /**
   * Возвращает флаг проверки авторизации пользователя
   */
  isAuthCheckedSelect: (state: { user: UserState }) => state.user.userCheck,

  /**
   * Проверяет, находится ли приложение в состоянии загрузки
   * @returns true, если идёт запрос к API
   */
  userIsLoadingSelect: (state: { user: UserState }) =>
    state.user.requestStatus === 'loading'
};

// Экспорт редуктора slice
export default userSlice.reducer;
