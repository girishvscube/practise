import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'
import * as user from '../../utils/auth'
import { toast } from 'react-toastify'

const initialState = {
  user: {},
  isLoading: false,
  apiSuccess: false,
  access_token: '',
  errors: {
    login: {},
    forgotPassword: {},
    resetPassword: {},
    updatePassword: '',
  },
}

const showToastMessage = (message: string, type: string) => {
  if (type === 'error') {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    })
  } else {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    })
  }
}

export const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    formReset: (state) => {
      state.errors.login = {}
    },
    resetLoading: (state) => {
      state.isLoading = true
    },
    resetapiSuccess: (state) => {
      state.apiSuccess = false
    },
    loginSuccessful: (state, action) => {
      state.isLoading = false
      if (action.payload.status && !action.payload.data.new_user) {
        user.login(action.payload.data.token.token)
        localStorage.setItem('auth_user', JSON.stringify(action.payload.data))
        state.user = action.payload.data
      } else {
        state.access_token = action.payload.data.token.token
      }
    },

    authenticationSuccessful: (state, action) => {
      if (action.payload.email) {
        state.user = {
          email: action.payload.email,
        }
      }
    },

    loginFailure: (state, action) => {
      state.errors.login = action.payload
      state.isLoading = false
      showToastMessage(action.payload.message, 'error')
    },

    forgotPasswordSuccessful: (state, action) => {
      if (action.payload.status) {
        state.isLoading = false
        state.apiSuccess = true
      }
    },

    forgotPasswordFailure: (state, action) => {
      state.errors.forgotPassword = action.payload
      state.isLoading = false
      showToastMessage(action.payload.message, 'error')
    },

    resetPasswordSuccessful: (state, action) => {
      if (action.payload.status) {
        state.isLoading = false
        state.apiSuccess = true
        showToastMessage(action.payload.message, 'success')
      }
    },

    resetPasswordFailure: (state, action) => {
      state.errors.forgotPassword = action.payload
      state.isLoading = false
      showToastMessage(action.payload.message, 'error')
    },

    loggedOut: (state) => {
      state.user = {}
      user.logout()
    },

    clearAccessToken: (state) => {
      state.access_token = ''
    },

    updatedPasswordSuccessful: (state, action) => {
      console.log(action, 'action')
      if (action.payload.status) {
        state.user = action.payload.data
        state.isLoading = false
        localStorage.setItem('auth_user', JSON.stringify(state.user))
        user.login(action.payload.data.token.token)
      }
    },

    updatePasswordFailure: (state, action) => {
      state.errors.updatePassword = action.payload
      state.isLoading = false
      showToastMessage(action.payload.message, 'error')
    },
  },
})

export const {
  loginSuccessful,
  loginFailure,
  authenticationSuccessful,
  loggedOut,
  formReset,
  resetLoading,
  forgotPasswordFailure,
  forgotPasswordSuccessful,
  resetPasswordFailure,
  resetPasswordSuccessful,
  updatedPasswordSuccessful,
  updatePasswordFailure,
  clearAccessToken,
  resetapiSuccess,
} = loginSlice.actions
export default loginSlice.reducer
export const login = (data: any) =>
  apiCallBegan({
    url: '/login',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: loginSuccessful.type,
    onError: loginFailure.type,
  })

export const forgotPassword = (data: any) =>
  apiCallBegan({
    url: '/forgot-password',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: forgotPasswordSuccessful.type,
    onError: forgotPasswordFailure.type,
  })

export const resetPassword = (data: any) =>
  apiCallBegan({
    url: '/reset-password',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: resetPasswordSuccessful.type,
    onError: resetPasswordFailure.type,
  })

export const updatePassword = (data: any) =>
  apiCallBegan({
    url: '/update-password',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: updatedPasswordSuccessful.type,
    onError: updatePasswordFailure.type,
  })

export const authenticate = () =>
  apiCallBegan({
    url: '/authenticate',
    method: 'GET',
    onSuccess: authenticationSuccessful.type,
    onError: loggedOut.type,
  })

export const logout = () =>
  apiCallBegan({
    url: '/logout',
    method: 'POST',
    onSuccess: loggedOut.type,
  })
