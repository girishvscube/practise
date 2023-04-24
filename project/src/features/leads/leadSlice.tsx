import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
  leads: {},
  disable_actions: false,
  isLoading: false,
  apiSuccess: false,
  isfailed: false,
  updateApiSuccess: false,
  leadsList: [],
  totalleads: 0,
  metadata: {
    totalleads: 0,
    total: 0,
  },
  leadsStats: {},

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

export const leads = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    formReset: () => { },
    resetLoading: (state) => {
      state.isLoading = true;
    },
    disableActions: (state) => {
      state.disable_actions = true;
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
      state.disable_actions = false;
      showToastMessage(action.payload.data.message, 'success');
    },

    fetchSuccessful: (state, action) => {
      state.leads = action.payload;
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
      state.leadsList = action.payload.data.data;
      state.metadata.total = action.payload?.data?.meta?.total;
      state.metadata.totalleads = action.payload?.total_count;
      state.isLoading = false;
    },

    leadsListPending: (state) => {
      state.isLoading = true;
    },

    leadsStatsSuccess: (state, action) => {
      state.leadsStats = action.payload.data;
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
  leadsListPending,
  updateAssignExecutive,
  leadsStatsSuccess,
  disableActions

} = leads.actions;
export default leads.reducer;

export const leadCreation = (data: any) =>
  apiCallBegan({
    url: '/admin/leads',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: creationSuccessful.type,
    onError: creationFailure.type,
  });

export const leadUpdation = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/leads/${id}`,
    method: 'PUT',
    data,
    onStart: resetLoading.type,
    onSuccess: updateSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchLead = (id: any) =>
  apiCallBegan({
    url: `/admin/leads/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: fetchSuccessful.type,
    onError: creationFailure.type,
  });

export const fetchLeadsList = (page: any, status: any, source: any, searchText: any, salesExecutive: any, start_date: any, end_date: any) =>
  apiCallBegan({
    url: `/admin/leads?page=${page}&source=${source}&start_date=${start_date}&end_date=${end_date}&assigned_to=${salesExecutive}&status=${status}&search_key=${searchText}`,
    method: 'GET',
    onStart: leadsListPending.type,
    onSuccess: SuccessfulList.type,
    onError: creationFailure.type,
  });

export const AssignExecutiveToLead = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/leads/assign-lead/${id}`,
    method: 'PATCH',
    data,
    onStart: disableActions.type,
    onSuccess: updateAssignExecutive.type,
    onError: creationFailure.type,
  });

export const ReassignRequest = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/leads/reassign-lead/${id}`,
    method: 'PATCH',
    data,
    onStart: disableActions.type,
    onSuccess: updateAssignExecutive.type,
    onError: creationFailure.type,
  });

export const LeadsStats = (start_Date: any, end_date: any) =>
  apiCallBegan({
    url: `/admin/leads/count?start_date=${start_Date}&end_date=${end_date}`,
    method: 'GET',
    // onStart: resetLoading.type,
    onSuccess: leadsStatsSuccess.type,
    onError: creationFailure.type,
  });
