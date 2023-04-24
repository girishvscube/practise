import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
  isLoading: false,
  apiSuccess: false,
  isfailed: false,
  updateApiSuccess: false,
  ticketsList: [],
  totalTickets: 0,
  metadata: {
    totalTickets: 0,
    totalPages: 0,
    totalOrders: 0,
    total: 0
  },
  ticketsStats: {},
  ordersList: [],
  ticketByid: {},
  statusList: [],
  isStatusUpdatePending: false,
  updateOrderStatusSuccessful: false,
  isStatusUpdateSuccess: false,
  isStatusUpdateFailed: false,
  updateTicketStatus: false,
  fetchTicketByIdStatus: false,
  statusUpdation: false,
  button: false
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

export const supportTicket = createSlice({
  name: 'support',
  initialState,
  reducers: {
    formReset: () => { },
    resetLoading: (state) => {
      state.isLoading = true;
      state.button = true
    },
    creationSuccessful: (state, action) => {
      state.apiSuccess = true;
      state.button = false
      showToastMessage(action.payload.message, 'success');
    },

    setApiSuccess: (state) => {
      state.apiSuccess = false;
    },

    creationFailure: (state, action) => {
      state.isLoading = false;
      state.apiSuccess = false;
      state.button = false;
      showToastMessage(action.payload.message, 'error');
    },

    supportListPending: (state) => {
      state.isLoading = true;
    },

    SuccessfulList: (state, action) => {
      state.ticketsList = action?.payload?.data?.data;
      state.metadata.total = action?.payload?.data?.meta?.total;
      state.metadata.totalTickets = action?.payload?.total_count;
      state.isLoading = false;
    },

    SuccessfulOrderList: (state, action) => {
      state.ordersList = action?.payload?.data || [];
      state.isLoading = false;
      state.metadata.totalOrders = action.payload?.data?.meta.total;
    },

    updateAssignTicket: (state, action) => {
      state.updateApiSuccess = true;
      state.isLoading = false;
      showToastMessage("Ticket assigned Successfully", 'success');
    },

    updateApi: (state) => {
      state.updateApiSuccess = false;
    },

    SuccessStats: (state, action) => {
      state.ticketsStats = action.payload.data;
    },

    ordersListPending: (state) => {
      state.isLoading = true;
    },
    TicketByIdPending: (state, action) => {
      console.log(action.payload, 'orderByid')

    },
    TicketByIdSuccess: (state, action) => {
      state.ticketByid = action?.payload;
    },
    TicketByIdFailed: (state, action) => {
      state.isLoading = false
    },
    TicketStatusSuccess: (state, action) => {
      state.statusList = action?.payload?.data;
    },

    updateOrderStatusPending: (state) => {
      state.isStatusUpdatePending = true;
      state.isLoading = true
      state.button = true
    },
    updateStatusSuccessful: (state) => {
      state.statusUpdation = true;
      state.isLoading = false
      showToastMessage("Ticket Status Changed Successfully", 'success');
    },
    updateStateStatus: (state) => {
      state.statusUpdation = false;
    },
    updateOrderStatusFailed: (state) => {
      state.isStatusUpdatePending = false;
      state.isStatusUpdateFailed = true;
      state.isLoading = false
      state.button = false
    },
    updateStatus: (state) => {
      state.isStatusUpdateFailed = false;
    },

    updateTicketSuccess: (state, action) => {
      state.updateTicketStatus = true;
      showToastMessage(action.payload.message, 'success');
      state.button = false;
    },

    fetchTicketSuccess: (state, action) => {
      state.ticketByid = action?.payload;
      state.fetchTicketByIdStatus = true;
      state.isLoading = false
    },
    setFetchTicketStatus: (state) => {
      state.fetchTicketByIdStatus = false;
    },

    updateTicketApi: (state) => {
      state.updateTicketStatus = false;
    },
  },
});

export const {
  creationSuccessful,
  creationFailure,
  formReset,
  resetLoading,
  setApiSuccess,
  supportListPending,
  SuccessfulList,
  updateAssignTicket,
  updateApi,
  SuccessStats,
  ordersListPending,
  SuccessfulOrderList,
  TicketByIdPending,
  TicketByIdSuccess,
  TicketByIdFailed,
  TicketStatusSuccess,
  updateOrderStatusPending,
  updateOrderStatusFailed,
  updateStatus,
  updateTicketSuccess,
  updateTicketApi,
  fetchTicketSuccess,
  setFetchTicketStatus,
  updateStatusSuccessful,
  updateStateStatus,
} = supportTicket.actions;
export default supportTicket.reducer;

export const ticketCreation = (data: any) =>
  apiCallBegan({
    url: '/admin/support-tickets/',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: creationSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchTicketList = (
  page: any,
  search_key: any,
  status,
  created_by,
  start_date,
  end_date,
) =>
  apiCallBegan({
    url: `/admin/support-tickets?page=${page}&start_date=${start_date}&end_date=${end_date}&status=${status}&created_by=${created_by}&search_key=${search_key}`,
    method: 'GET',
    onStart: supportListPending.type,
    onSuccess: SuccessfulList.type,
    onError: creationFailure.type,
  });

export const assignTicket = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/support-tickets/update-status/${id}`,
    method: 'PATCH',
    data,
    onStart: resetLoading.type,
    onSuccess: updateAssignTicket.type,
    onError: creationFailure.type,
  });

export const ticketStats = (start_date, end_date) =>
  apiCallBegan({
    url: `/admin/support-tickets/count/all?start_date=${start_date}&end_date=${end_date}`,
    method: 'GET',
    onSuccess: SuccessStats.type,
    onError: creationFailure.type,
  });

export const FetchOrderList = (page: any, searchText: any) =>
  apiCallBegan({
    url: `/admin/orders?page=${page}&search_key=${searchText}`,
    method: 'GET',
    onStart: ordersListPending.type,
    onSuccess: SuccessfulOrderList.type,
    onError: creationFailure.type,
  });

export const fetchTicketById = (id: any) =>
  apiCallBegan({
    url: `/admin/support-tickets/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: fetchTicketSuccess.type,
    onError: TicketByIdFailed.type,
  });

export const TicketStatusList = () =>
  apiCallBegan({
    url: '/admin/support-tickets/status/dropdown',
    method: 'GET',
    // onStart: TicketByIdPending.type,
    onSuccess: TicketStatusSuccess.type,
    // onError: TicketByIdFailed.type,
  });

export const ticketStatusUpdation = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/support-tickets/update-status/${id}`,
    method: 'PATCH',
    data,
    onStart: updateOrderStatusPending.type,
    onSuccess: updateStatusSuccessful.type,
    onError: updateOrderStatusFailed.type,
  });

export const ticketUpdate = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/support-tickets/${id}`,
    method: 'PUT',
    data,
    onStart: updateOrderStatusPending.type,
    onSuccess: updateTicketSuccess.type,
    onError: updateOrderStatusFailed.type,
  });
