import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
  stations: {},
  isLoading: false,
  apiSuccess: false,
  parkingList: [],
  metadata: {
    totalParking: 0,
    totalPages: 0,
  },
  updateApiSuccess: false,
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

export const stations = createSlice({
  name: 'station',
  initialState,
  reducers: {
    formReset: () => { },
    resetLoading: (state) => {
      state.isLoading = true;
    },
    creationSuccessful: (state) => {
      state.apiSuccess = true;
    },

    setApiSuccess: (state) => {
      state.apiSuccess = false;
    },

    creationFailure: (state, action) => {
      state.isLoading = false;
      state.apiSuccess = false;
      showToastMessage(action.payload.message, 'error');
    },

    fetchSuccessful: (state, action) => {
      state.stations = action.payload;
    },

    updateSuccessful: (state) => {
      state.isLoading = false;
      state.updateApiSuccess = true;
    },

    updateApi: (state) => {
      state.updateApiSuccess = false;
    },

    SuccessfulList: (state, action) => {
      // console.log(action.payload.data.meta.last_page);
      state.parkingList = action.payload.data.data;
      state.metadata.totalPages = action.payload.data.meta.last_page;
      state.metadata.totalParking = action.payload.data.meta.total;
      state.isLoading = false;
      state.apiSuccess = true;
    },

    ParkingListPending: (state) => {
      state.isLoading = true;
    },

  },
});

export const {
  creationSuccessful,
  creationFailure,
  formReset,
  resetLoading,
  setApiSuccess,
  updateSuccessful,
  updateApi,
  SuccessfulList,
  ParkingListPending,
  fetchSuccessful,

} = stations.actions;
export default stations.reducer;

export const createParkingStation = (data: any) =>
  apiCallBegan({
    url: '/admin/parking-station',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: creationSuccessful.type,
    onError: creationFailure.type,
  });

export const updateParkingStation = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/parking-station/${id}`,
    method: 'PUT',
    data,
    onStart: resetLoading.type,
    onSuccess: updateSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchParkingStation = (id: any) =>
  apiCallBegan({
    url: `/admin/parking-station/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: fetchSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchParkingList = (page: any,searchText:any) =>
  apiCallBegan({
    url: `/admin/parking-station?search_key=${searchText}&page=${page}`,
    method: 'GET',
    onStart: ParkingListPending.type,
    onSuccess: SuccessfulList.type,
    onError: creationFailure.type,
  });
