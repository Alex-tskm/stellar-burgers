import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData,
  logoutApi
} from '../../utils/burger-api';

export const fetchUser = createAsyncThunk<
  Awaited<ReturnType<typeof getUserApi>>,
  void,
  { rejectValue: unknown } // тип ошибки
>('user/fetchUser', async (_, { rejectWithValue }) => {
  try {
    return await getUserApi();
  } catch (error) {
    return rejectWithValue(error); // Тип выведен автоматически
  }
});

export const loginUser = createAsyncThunk<
  Awaited<ReturnType<typeof loginUserApi>>,
  TLoginData,
  { rejectValue: unknown }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await loginUserApi({ email, password });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const registerUser = createAsyncThunk<
  Awaited<ReturnType<typeof registerUserApi>>,
  TRegisterData,
  { rejectValue: unknown }
>('user/register', async ({ email, password, name }, { rejectWithValue }) => {
  try {
    return await registerUserApi({ email, password, name });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateUser = createAsyncThunk<
  Awaited<ReturnType<typeof updateUserApi>>,
  Partial<TRegisterData>,
  { rejectValue: unknown }
>('user/update', async (user, { rejectWithValue }) => {
  try {
    return await updateUserApi(user);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: unknown }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
  } catch (error) {
    return rejectWithValue(error);
  }
});
