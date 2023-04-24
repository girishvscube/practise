import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
  trips: {},
  orders: {},
  allOrders:[],
  isLoading: false,
  apiSuccess: false,
  isfailed: false,
  orderListStatus: '',
  updateApiSuccess: false,
  tripsList: [],
  totaltrips: 0,
  metadata: {
    totaltrips: 0,
    total: 0,
  },
  tripsStats: {},
  scheduledTrip:[],
  type_PO:[] as any,
  type_SO:[] as any,
  fuelData: {},
  response:'' as any
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

export const trips = createSlice({
  name: 'trip',
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

    updateAssignExecutive: (state, action) => {
      state.updateApiSuccess = true;
      showToastMessage(action.payload.message, 'success');
    },

    fetchSuccessful: (state, action) => {
      let  trip= action.payload.data.trip
      let orders = action.payload.data.schedule_trip.orders;
      orders = orders.map(x=>{
        x['show_start_button'] = !x.actual_start_time && !x.actual_time_of_delivery ? true : false
        x['show_end_button'] = x.actual_start_time &&  !x.actual_time_of_delivery ? true : false
        return x
      })
      // console.log(trip, 'mm..mm')
      trip['orders_linked'] = action.payload.data.schedule_trip.orders.length
      trip['orders_delivered'] = 0
      state.trips = trip;
      // console.log(trips, '....')
      state.response = action.payload.data;
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
      // console.log(action.payload, 'mmmm');
      state.tripsList = action.payload.data;
      state.metadata.total = action.payload.meta.last_page;
      state.metadata.totaltrips = action.payload.meta.total;
      state.isLoading = false;
    },

    tripsListPending: (state) => {
      state.isLoading = true;
    },

    tripsStatsSuccess: (state, action) => {
      state.tripsStats = action.payload.data;
    },

    ordersListPending: (state) => {
      state.isLoading = true;
    },

    SuccessfulOrderList: (state, action) => {
      // console.log(action.payload.status, 'mmmm');
      state.allOrders = action?.payload?.data || [];
      // state.orderListStatus = action?.payload?.status;
      state.isLoading = false;
    },

    fetchScheduledTripSuccess: (state, action) => {
      state.scheduledTrip = action.payload.data.data;
      state.fuelData = action.payload.data.count;
      let x: any = action.payload.data.data;
      x.map(ele => {
        if(ele.type === 'po'){
          return state.type_PO.push(ele);
        } else{
          return state.type_SO.push(ele);
        }
      })
      // console.log(action.payload.data.count, 'mmmm');
    },
  },
});

export const {
  creationSuccessful,
  creationFailure,
  formReset,
  resetLoading,
  setApiSuccess,
  fetchSuccessful,
  updateSuccessful,
  updateApi,
  SuccessfulList,
  tripsListPending,
  updateAssignExecutive,
  tripsStatsSuccess,
  ordersListPending,
  SuccessfulOrderList,
  fetchScheduledTripSuccess
} = trips.actions;
export default trips.reducer;

export const addTrip = (id: any, data: any) =>
  apiCallBegan({
    url: `/admin/trip-orders/${id}`,
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: creationSuccessful.type,
    onError: creationFailure.type,
  });

export const updateTrip = (id: any, data: any) =>
  apiCallBegan({
    url: `/admin/trip-orders/${id}`,
    method: 'PUT',
    data,
    onStart: resetLoading.type,
    onSuccess: updateSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchTrip = (id: any) =>
  apiCallBegan({
    url: `/admin/trip-orders/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: fetchSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchTripsList = (page:any,bowserName:any,status:any,searchText:any,start_time:any,end_time:any) =>
  apiCallBegan({
    url: `/admin/trips?page=${page}&start_time=${start_time}&end_time=${end_time}&bowserName=${bowserName}&status=${status}&search_key=${searchText}`,
    method: 'GET',
    onStart: tripsListPending.type,
    onSuccess: SuccessfulList.type,
    onError: creationFailure.type,
  });

export const TripsStats = (start_Date:any,end_date:any) =>
  apiCallBegan({
    url: `/admin/trips/count?start_date=${start_Date}&end_date=${end_date}`,
    method: 'GET',
    // onStart: resetLoading.type,
    onSuccess: tripsStatsSuccess.type,
    onError: creationFailure.type,
  });

export const fetchOrdersInTrips = (params: any) =>
  apiCallBegan({
    url: `/admin/trips/orders/confirmed?order_type=${params.order_type}&time_slot=${params.time_slot}&order_date=${params.order_date}&search_key=${params.searchText}`,
    method: 'GET',
    onStart: ordersListPending.type,
    onSuccess: SuccessfulOrderList.type,
    onError: creationFailure.type,
  });

  export const fetchScheduledTrip = (id: any) =>
  apiCallBegan({
    url: `/admin/trips/schedule/${id}`,
    method: 'GET',
    // onStart: resetLoading.type,
    onSuccess: fetchScheduledTripSuccess.type,
    onError: creationFailure.type,
  });