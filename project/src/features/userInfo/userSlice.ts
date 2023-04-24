import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
  user: {},
  isLoading: false,
  apiSuccess: false,
  isfailed: false,
  updateSuccess: false,
  updateStatus: false,

  usersList: [],
  total_users: 0,
  meta: '',
  userInfo: {},
  userStatus: false
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

export const createUser = createSlice({
  name: 'user',
  initialState,
  reducers: {
    formReset: () => {},
    resetLoading: (state) => {
      state.isLoading = true;
    },
    creationSuccessful: (state) => {
      state.apiSuccess = true;
      state.isLoading = true;
    },

    creationFailure: (state, action) => {
      const message = action.payload || 'Fill All required Details';
      state.isLoading = false;
      state.apiSuccess = false;
      console.log(message,"mmm")
      showToastMessage(message, 'error');
    },
    setSuccessApiState: (state) => {
      state.apiSuccess = false;
    },

    setUpdateApiState: (state) => {
      state.updateSuccess = false;
    },

    setSuccessfulUpdateApi: (state) => {
      state.updateSuccess = true;
    },

    userListSuccess: (state, action) => {
      const response:any = action.payload.data;
      state.usersList = response.data;
      state.meta = response.meta;
      state.total_users = action.payload.total_users
      state.isLoading = false;
    },
    userListPending: (state) => {
      state.isLoading = true;
    },
    userListFailed: (state) => {
      state.isLoading = false;
      state.isfailed = true;
    },

    UserInfoSuccess: (state, action) => {
      state.userInfo = action.payload.data;
      state.isLoading = false;
    },
    UserInfoPending: (state) => {
      state.isLoading = true;
    },
    UserInfoFailed: (state) => {
      state.isLoading = false;
      state.isfailed = true;
    },
    UserStatusSuccess: (state, action) => {
      state.isLoading = false;
      state.updateStatus = true;
      showToastMessage(action.payload.data.message, 'success');
    },
    UserStatusState: (state) => {
      state.updateStatus = false;
    },
    UserStatusFailed: (state, action) => {
      state.isLoading = false;
      showToastMessage(action.payload.message, 'error');
    },
  },
});

export const {
  creationSuccessful,
  creationFailure,
  formReset,
  resetLoading,
  setSuccessApiState,
  setUpdateApiState,
  setSuccessfulUpdateApi,
  userListSuccess,
  userListFailed,
  userListPending,
  UserInfoSuccess,
  UserInfoFailed,
  UserInfoPending,
  UserStatusSuccess,
  UserStatusFailed,
  UserStatusState,
} = createUser.actions;
export default createUser.reducer;

export const userCreation = (data: any) =>
  apiCallBegan({
    url: '/admin/users',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: creationSuccessful.type,
    onError: creationFailure.type,
  });

export const userList = (page: any, status: any, searchText: any, userRoles: any) =>
  apiCallBegan({
    url: `/admin/users?status=${status}&search_key=${searchText}&role_id=${userRoles}&page=${page}`,
    method: 'GET',
    onStart: userListPending.type,
    onSuccess: userListSuccess.type,
    onError: userListFailed.type,
  });

export const userUpdation = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/users/${id}`,
    method: 'PUT',
    data,
    onStart: resetLoading.type,
    onSuccess: setSuccessfulUpdateApi.type,
    onError: creationFailure.type,
  });

export const ViewUser = (id: any) =>
  apiCallBegan({
    url: `/admin/users/${id}`,
    method: 'GET',
    onStart: userListPending.type,
    onSuccess: UserInfoSuccess.type,
    onError: UserInfoFailed.type,
  });

export const UserStatus = (id: any, data:any) =>
  apiCallBegan({
    url: `/admin/users/update-status/${id}`,
    method: 'PATCH',
    data,
    onSuccess: UserStatusSuccess.type,
    onError: UserStatusFailed.type,
  });
