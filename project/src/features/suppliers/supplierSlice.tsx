import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
  isLoading: false,
  apiSuccess: false,
  isfailed: false,
  updateApiSuccess: false,
  suppliersList: [],
  totalSuppliers: 0,
  metadata: {
    totalSuppliers: 0,
    total: 0,
  },
  supplierStats: {},
  supplier: {},
  purchaseOrderStats: {},
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
  name: 'supplier',
  initialState,
  reducers: {
    formReset: () => { },
    resetLoading: (state) => {
      state.isLoading = true;
    },
    creationSuccessful: (state, action) => {
      state.apiSuccess = true;
      showToastMessage(action.payload.message, 'success');
    },

    setApiSuccess: (state) => {
      state.apiSuccess = false;
    },

    creationFailure: (state, action) => {
      state.isLoading = false;
      state.apiSuccess = false;
      showToastMessage(action.payload.message, 'error');
    },

    supportListPending: (state) => {
      state.isLoading = true;
    },

    SuccessfulList: (state, action) => {
      state.suppliersList = action?.payload?.data?.data;
      state.metadata.total = action?.payload?.data?.meta?.total;
      state.metadata.totalSuppliers = action?.payload?.total_count;
      state.isLoading = false;
    },

    updateAssignTicket: (state, action) => {
      state.updateApiSuccess = true;
      showToastMessage(action.payload.message, 'success');
    },

    updateApi: (state) => {
      state.updateApiSuccess = false;
    },

    SuccessStats: (state, action) => {
      state.supplierStats = action.payload.data;
    },

    SuccessSupplier: (state, action) => {
      state.supplier = action.payload.data;
      state.isLoading = false;
    },

    POstats: (state, action) => {
      state.purchaseOrderStats = action.payload.data[0];
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
  SuccessSupplier,
  POstats,
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

export const fetchSupplierList = (page, search_key) =>
  apiCallBegan({
    url: `/admin/supplier?search_key=${search_key}&page=${page}`,
    method: 'GET',
    onStart: supportListPending.type,
    onSuccess: SuccessfulList.type,
    onError: creationFailure.type,
  });

export const fetchSupplier = (id: any) =>
  apiCallBegan({
    url: `/admin/supplier/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: SuccessSupplier.type,
    onError: creationFailure.type,
  });

export const fetchSupplierStats = () =>
  apiCallBegan({
    url: '/admin/supplier/count ',
    method: 'GET',
    onSuccess: SuccessStats.type,
    onError: creationFailure.type,
  });

export const purchaseOrdersStats = (supplierId: any) => {
  apiCallBegan({
    url: `{{url}}/admin/supplier/view/purchase/count/${supplierId}?start_date=2022-10-1&end_date=2022-10-17`,
    method: 'GET',
    onSuccess: POstats.type,
    onError: creationFailure.type,
  });
};
