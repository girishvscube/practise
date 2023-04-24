import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import * as user from '../../utils/auth';
import { toast } from 'react-toastify';

const initialState = {
  user: {},
  isLoading: false,
  forgotPasswordSuccess: false,
  errors: {
    login: {},
  },
};

const showToastMessage = (message: string, type: string) => {
  if (type === 'error') {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } else {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};

export const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    formReset: (state) => {
      state.errors.login = {};
    },
    resetLoading: (state) => {
      state.isLoading = true;
    },
    loginSuccessful: (state, action) => {
      if (action.payload.email) {
        state.user = action.payload;
        state.isLoading = false;
        user.login(action.payload.token.token);
      }
    },

    authenticationSuccessful: (state, action) => {
      if (action.payload.email) {
        state.user = {
          email: action.payload.email,
        };
      }
    },

    loginFailure: (state, action) => {
      state.errors.login = action.payload;
      state.isLoading = false;
      showToastMessage(action.payload.message, 'error');
    },

    loggedOut: (state) => {
      state.user = {};
      user.logout();
    },
  },
});

export const {
  loginSuccessful,
  loginFailure,
  authenticationSuccessful,
  loggedOut,
  formReset,
  resetLoading,
} = loginSlice.actions;
export default loginSlice.reducer;

export const login = (data: any) =>
  apiCallBegan({
    url: '/login',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: loginSuccessful.type,
    onError: loginFailure.type,
  });

export const authenticate = () =>
  apiCallBegan({
    url: '/authenticate',
    method: 'GET',
    onSuccess: authenticationSuccessful.type,
    onError: loggedOut.type,
  });

export const logout = () =>
  apiCallBegan({
    url: '/logout',
    method: 'POST',
    onSuccess: loggedOut.type,
  });
