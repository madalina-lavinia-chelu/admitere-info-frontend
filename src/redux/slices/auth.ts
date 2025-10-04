"use client";

import persistReducer from "redux-persist/es/persistReducer";
import { UserType, RoleType } from "@/types/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserRequest,
  logoutUserRequest,
} from "@/requests/auth/auth.requests";

import { createConfig } from "@/utils/redux.utils";
import { setSession } from "@/auth/utils";

type InitialState = {
  user: UserType | null;
  roles: RoleType;
  token: string;
  isLoading: boolean;
};

const initialState: InitialState = {
  user: null,
  roles: "",
  token: "",
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType | null>) {
      // if payload is same as current user.requests.ts, do nothing
      if (JSON.stringify(state.user) === JSON.stringify(action.payload)) {
        return;
      }
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      // if payload is same as current token, do nothing
      if (state.token === action.payload) {
        return;
      }

      state.token = action.payload;
    },
  },
});

const persistedAuthReducer = persistReducer(
  createConfig({
    key: "auth",
    blacklist: ["isLoading"],
  }),
  authSlice.reducer
);

export const { setUser, setToken } = authSlice.actions;
export default persistedAuthReducer;

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  const result = await logoutUserRequest();
  setSession(null);

  // await persistor.purge()
  localStorage.clear();
  window.location.reload();
  // Clear all store data from all reducers persist
  return result;
});

// loginAsync
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    thunkAPI
  ) => {
    const response = await loginUserRequest({
      email,
      password,
    });

    if (response.error) {
      return thunkAPI.rejectWithValue(response);
    }

    // setUser
    thunkAPI.dispatch(setUser(response.user));
    setSession(response.token);

    return thunkAPI.fulfillWithValue(response);
  }
);
