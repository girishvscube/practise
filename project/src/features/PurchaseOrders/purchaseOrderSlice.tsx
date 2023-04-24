import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'
import { toast } from 'react-toastify'

const initialState = {
  isLoading: false,
  apiSuccess: false,
  isfailed: false,
  updateApiSuccess: false,
  isPOstatusChanged: false,
  list: [],
  metadata: {
    totalorders: 0,
    totalPages: 0,
  },

  orderStats: {
    total_fuel_qty: 0,
    fuel_delivered: 0,
    po_raised: 0,
    po_done: 0,
  },

  PoById: {},

  confirmedOrders: [],
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

export const orders = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    formReset: () => {},
    resetLoading: (state) => {
      state.isLoading = true
    },
    resetPOstatus: (state) => {
      state.isPOstatusChanged = false
    },
    creationSuccessful: (state) => {
      state.apiSuccess = true
    },

    setApiSuccess: (state) => {
      state.apiSuccess = false
    },

    creationFailure: (state, action) => {
      state.isLoading = false
      state.apiSuccess = false
      showToastMessage(action?.payload?.message, 'error')
    },

    updateApi: (state) => {
      state.updateApiSuccess = false
    },

    SuccessfulList: (state, action) => {
      state.list = action?.payload?.data.data
      state.isLoading = false
      state.metadata.totalPages = action?.payload?.data?.meta?.last_page
      state.metadata.totalorders = action?.payload?.total_count
    },

    showLoader: (state) => {
      state.isLoading = true
    },
    analyticsSuccess: (state, action) => {
      state.orderStats = action?.payload?.data
    },

    fetchPoByIdSuccess: (state, action) => {
      state.PoById = action?.payload?.data
      // console.log('action?.payload:', action?.payload?.data)
      state.isLoading = false
    },

    ChangePoStatusLoading: (state, action) => {
      console.log('ChangePoStatusLoading:')
    },
    ChangePoStatusFailed: (state, action) => {
      console.log('ChangePoStatusFailed:')
    },
    ChangePoStatusSuccess: (state, action) => {
      console.log('ChangePoStatusSuccess:', action.payload.data.message)
      state.isPOstatusChanged = true
      showToastMessage(action?.payload.data.message, 'success')
    },

    ConfirmedOrdersListSuccess: (state, action) => {
      state.confirmedOrders = action.payload.data
    },
    ConfirmedOrdersListLoading: (state, action) => {},
    ConfirmedOrdersListFailed: (state, action) => {},
  },
})

export const {
  resetPOstatus,
  creationSuccessful,
  creationFailure,
  formReset,
  resetLoading,
  setApiSuccess,
  updateApi,
  SuccessfulList,
  showLoader,
  analyticsSuccess,
  fetchPoByIdSuccess,
  ChangePoStatusLoading,
  ChangePoStatusFailed,
  ChangePoStatusSuccess,
  ConfirmedOrdersListSuccess,
  ConfirmedOrdersListLoading,
  ConfirmedOrdersListFailed,
} = orders.actions
export default orders.reducer

export const orderCreation = (data: any) =>
  apiCallBegan({
    url: '/admin/orders',
    method: 'POST',
    data,
    onStart: resetLoading.type,
    onSuccess: creationSuccessful.type,
    onError: creationFailure.type,
  })

export const fetchPurchaseOrdersList = (page: any, params: any) =>
  apiCallBegan({
    url: `/admin/purchase-order?page=${page}&start_date=${params.start_date}&end_date=${params.end_date}&status=${params.status}&search_key=${params.searchText}`,
    method: 'GET',
    onStart: showLoader.type,
    onSuccess: SuccessfulList.type,
    onError: creationFailure.type,
  })

export const purchaseOrderAnalytics = (start_date: any, end_date: any) =>
  apiCallBegan({
    url: `/admin/purchase-order/dashboard/count?start_date=${start_date}&end_date=${end_date}`,
    method: 'GET',
    onSuccess: analyticsSuccess.type,
  })
export const fetchPoById = (id: any) =>
  apiCallBegan({
    url: `/admin/purchase-order/${id}`,
    method: 'GET',
    onStart: showLoader.type,
    onSuccess: fetchPoByIdSuccess.type,
    onError: creationFailure.type,
  })

export const ChangePoStatus = (id: any, data: any) =>
  apiCallBegan({
    url: `/admin/purchase-order/update-status/${id}`,
    method: 'PATCH',
    data,
    onStart: ChangePoStatusLoading.type,
    onSuccess: ChangePoStatusSuccess.type,
    onError: ChangePoStatusFailed.type,
  })

export const fetchConfirmedOrders = () =>
  apiCallBegan({
    url: `/admin/purchase-sales-order/orders/confirmed`,
    method: 'GET',
    onStart: ConfirmedOrdersListLoading.type,
    onSuccess: ConfirmedOrdersListSuccess.type,
    onError: ConfirmedOrdersListFailed.type,
  })
