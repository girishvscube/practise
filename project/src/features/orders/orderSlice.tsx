import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'
import { toast } from 'react-toastify'

const initialState = {
  order: {},
  nextOrderId: 0,
  fuel_price: 0,

  listSuccess: false,
  listPending: true,
  listFailed: false,

  isLoading: false,
  apiSuccess: false,
  isfailed: false,
  updateApiSuccess: false,
  ordersList: [],
  pocListByOrder: [],
  orderByid: [],
  totalorders: 0,
  metadata: {
    totalorders: 0,
    totalPages: 0,
    total: 0,
  },

  isorderCountSuccess: false,
  isorderCountPending: false,
  isorderCountFailed: false,

  isStatusUpdateSuccess: false,
  isStatusUpdatePending: false,
  isStatusUpdateFailed: false,

  orderCount: {
    total: {
      count: 0,
    },
    delivered: {
      count: 0,
    },
    in_progress: {
      count: 0,
    },
    fuel_qty: 0,
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

export const orders = createSlice({
  name: 'order',
  initialState,
  reducers: {
    formReset: () => {},
    resetLoading: (state) => {
      state.isLoading = true
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

    fetchSuccessful: (state, action) => {
      // console.log(action.payload, 'orders');
      state.order = action?.payload?.data[0]
    },

    updateSuccessful: (state) => {
      state.isLoading = false
      state.updateApiSuccess = true
    },

    updateOrderStatusSuccessful: (state) => {
      // console.log(action.payload, 'orders');
      state.isStatusUpdatePending = false
      state.isStatusUpdateSuccess = true
    },

    updateOrderStatusPending: (state) => {
      state.isStatusUpdatePending = true
    },

    updateOrderStatusFailed: (state) => {
      state.isStatusUpdatePending = false
      state.isStatusUpdateFailed = true
    },

    updateApi: (state) => {
      state.updateApiSuccess = false
    },

    SuccessfulList: (state, action) => {
      state.listSuccess = true
      state.listPending = false
      state.listFailed = false

      state.ordersList = action?.payload?.data.data || []
      state.metadata.totalPages = action?.payload?.data.meta?.last_page
      state.metadata.total = action?.payload?.data.meta?.total
      state.metadata.totalorders = action?.payload?.total_count
    },

    ListFailed: (state, action) => {
      console.log('action:', action)
      state.listSuccess = false
      state.listPending = false
      state.listFailed = true
    },
    ListPending: (state, action) => {
      state.listSuccess = false
      state.listPending = true
      state.listFailed = false
    },

    ordersListPending: (state) => {
      state.isLoading = true
    },

    OrderCountSuccess: (state, action) => {
      // console.log(action?.payload?.data);
      state.orderCount = action?.payload?.data
      state.isorderCountSuccess = true
      state.isorderCountPending = false
    },
    OrderCountPending: (state) => {
      state.isorderCountPending = true
    },
    OrderCountFailed: (state) => {
      state.isorderCountFailed = true
      state.isorderCountPending = false
    },

    PocByOrderPending: () => {},
    PocByOrderSuccess: (state, action) => {
      // console.log(action.payload)
      state.pocListByOrder = action?.payload?.data
    },
    PocByOrderFailed: () => {},

    OrderByIdSuccess: (state, action) => {
      console.table(action.payload?.data)
      state.orderByid = action?.payload?.data
      state.isLoading = false
    },
    OrderByIdPending: (state, action) => {
      // console.log(action.payload, 'orderByid')
      state.orderByid = action?.payload?.data
      state.isLoading = false
    },
    OrderByIdFailed: (state, action) => {
      // console.log(action.payload, 'orderByid')
      state.orderByid = action?.payload?.data
    },

    HardReset: (state) => {
      state.isStatusUpdateSuccess = false
      state.isStatusUpdatePending = false
      state.isStatusUpdateFailed = false
    },

    FuelPriceSuccess: (state, action) => {
      console.log('action:', action.payload.data)

      const active_item = action.payload.data.filter((item: any) => item.is_active)
      console.log('active_price:', active_item)

      state.fuel_price = active_item[0]?.price
    },
    FuelPricePending: (state, action) => {},
    FuelPriceFailed: (state, action) => {},
  },
})

export const {
  HardReset,
  creationSuccessful,
  creationFailure,
  formReset,
  resetLoading,
  setApiSuccess,
  fetchSuccessful,
  updateSuccessful,
  updateApi,
  ordersListPending,
  OrderCountSuccess,
  OrderCountFailed,
  OrderCountPending,
  updateOrderStatusPending,
  updateOrderStatusFailed,
  updateOrderStatusSuccessful,
  PocByOrderPending,
  PocByOrderSuccess,
  PocByOrderFailed,
  OrderByIdSuccess,
  OrderByIdPending,
  OrderByIdFailed,
  FuelPriceSuccess,
  FuelPricePending,
  FuelPriceFailed,
  ListPending,
  ListFailed,
  SuccessfulList,
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

export const orderUpdation = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/orders/${id}`,
    method: 'PUT',
    data,
    onStart: resetLoading.type,
    onSuccess: updateSuccessful.type,
    onError: creationFailure.type,
  })
export const orderStatusUpdation = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/orders/update-status/${id}`,
    method: 'PATCH',
    data,
    onStart: updateOrderStatusPending.type,
    onSuccess: updateOrderStatusSuccessful.type,
    onError: updateOrderStatusFailed.type,
  })

export const fetchOrders = (id: any) =>
  apiCallBegan({
    url: `/admin/orders/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: fetchSuccessful.type,
    onError: creationFailure.type,
  })

export const fetchOrdersList = (page: any, params: any) =>
  apiCallBegan({
    url: `/admin/orders?page=${page}&start_date=${params.start_date}&end_date=${params.end_date}&status=${params.status}&sales_executive_id=${params.salesExecutive}&search_key=${params.searchText}`,
    method: 'GET',
    onStart: ListPending.type,
    onSuccess: SuccessfulList.type,
    onError: ListFailed.type,
  })
export const fetchOrderCount = (start_date: any, end_date: any) =>
  apiCallBegan({
    url: `/admin/orders/count/all?start_date=${start_date}&end_date=${end_date}`,
    method: 'GET',
    onStart: OrderCountPending.type,
    onSuccess: OrderCountSuccess.type,
    onError: OrderCountFailed.type,
  })

export const fetchPocByOrder = (id: any) =>
  apiCallBegan({
    url: `/admin/orders/poc/${id}`,
    method: 'GET',
    onStart: PocByOrderPending.type,
    onSuccess: PocByOrderSuccess.type,
    onError: PocByOrderFailed.type,
  })
export const fetchOrderById = (id: any) =>
  apiCallBegan({
    url: `/admin/orders/${id}`,
    method: 'GET',
    onStart: resetLoading.type,
    onSuccess: OrderByIdSuccess.type,
    onError: OrderByIdFailed.type,
  })
export const fetchFuelPrice = () =>
  apiCallBegan({
    url: '/admin/values-charges/selling-price',
    method: 'GET',
    onStart: FuelPricePending.type,
    onSuccess: FuelPriceSuccess.type,
    onError: FuelPriceFailed.type,
  })
