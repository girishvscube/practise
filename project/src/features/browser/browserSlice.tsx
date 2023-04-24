import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
  browsers: {},
  totalBrowsers: 0,
  isLoading: false,
  apiSuccess: false,
  browserList: [],
  metadata: {
    totalPages: 0,
    total: 0
  },
  updateApiSuccess: false,
  bowserStats: {},
  driverDetails: {},
  odometer: [],
  odo_details: {
    id: null,
    start: '',
    end: '',
    status: '',
  }
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

export const browsers = createSlice({
  name: 'browsers',
  initialState,
  reducers: {
    formReset: () => { },
    resetLoading: (state) => {
      state.isLoading = true;
    },
    creationSuccessful: (state) => {
      state.apiSuccess = true;
      state.isLoading = false;
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
      state.browsers = action.payload.data;
      state.isLoading = false
    },

    driverDetailsSuccess: (state, action) => {
      // console.log(action.payload, 'bnm,,,,');
      state.driverDetails = action.payload.data.data;
      state.metadata.totalPages = action.payload.data.meta.last_page;
      state.isLoading = false;
    },

    updateSuccessful: (state) => {
      state.isLoading = false;
      state.updateApiSuccess = true;
    },

    updateApi: (state) => {
      state.updateApiSuccess = false;
    },

    SuccessfulList: (state, action) => {
      // console.log(action.payload.total_count, 'mmmmmmx');
      state.browserList = action.payload.data.data;
      state.metadata.totalPages = action.payload.data.meta.last_page;
      state.totalBrowsers = action.payload.total_count;
      state.isLoading = false;
      // state.apiSuccess = true;
      state.metadata.total = action?.payload?.data?.meta?.total
    },

    BrowserListPending: (state) => {
      state.isLoading = true;
    },

    BowserStatsSuccess: (state, action) => {
      // console.log(action.payload.data.converted.count)
      state.bowserStats = action.payload.data;
    },

    updateAssignDriver: (state, action) => {
      state.updateApiSuccess = true;
      showToastMessage(action.payload.message, 'success');
    },

    OdometerDetailsSuccess: (state, action) => {
      // console.log(action.payload.data.odometer_start, 'odo....')
      state.odometer = action.payload.data;
      let x = action.payload.data;
      x.map(i => {
        state.odo_details.id = i.trip_id;
        state.odo_details.start = i.odometer_start;
        state.odo_details.end = i.odometer_end;
        state.odo_details.status = i.status;
      })
    }
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
  BrowserListPending,
  fetchSuccessful,
  BowserStatsSuccess,
  driverDetailsSuccess,
  updateAssignDriver,
  OdometerDetailsSuccess,
} = browsers.actions;
export default browsers.reducer;

export const createBrowser = (data: any) =>
  apiCallBegan({
    url: '/admin/bowser',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: creationSuccessful.type,
    onError: creationFailure.type,
  });

export const updateBowser = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/bowser/${id}`,
    method: 'PUT',
    data,
    onStart: resetLoading.type,
    onSuccess: updateSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchBrowser = (id: any) =>
  apiCallBegan({
    url: `/admin/bowser/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: fetchSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchDriverDetails = (page: any, id: any, start_date: any, end_date: any) =>
  apiCallBegan({
    url: `/admin/bowser/view/driver-detail/${id}?page=${page}&start_date=${start_date}&end_date=${end_date}`,
    method: 'GET',
    // onStart: resetLoading.type,
    onSuccess: driverDetailsSuccess.type,
    onError: creationFailure.type,
  });

export const fetchBrowsersList = (page: any, driver: any, status: any, searchText: any) =>
  apiCallBegan({
    url: `/admin/bowser?page=${page}&driver=${driver}&status=${status}&search_key=${searchText}`,
    // url: `/admin/bowser?search_key=${params.searchText}`,
    method: 'GET',
    onStart: BrowserListPending.type,
    onSuccess: SuccessfulList.type,
    onError: creationFailure.type,
  });

export const BowsersStats = () =>
  apiCallBegan({
    url: '/admin/bowser/count/all',
    method: 'GET',
    // onStart: resetLoading.type,
    onSuccess: BowserStatsSuccess.type,
    onError: creationFailure.type,
  });

export const AssignDriver = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/bowser/view/assign-driver/${id}`,
    method: 'PUT',
    data,
    // onStart: resetLoading.type,
    onSuccess: updateAssignDriver.type,
    onError: creationFailure.type,
  });

export const odometerDetails = (id: any) =>
  apiCallBegan({
    url: `/admin/bowser/trip/details/${id}`,
    method: 'GET',
    // onStart: BrowserListPending.type,
    onSuccess: OdometerDetailsSuccess.type,
    onError: creationFailure.type,
  });
