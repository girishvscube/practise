import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'
// import { toast } from 'react-toastify';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFailed: false,
  customerId: null,
  pocId: null,

  customerList: [],
  customerDetails: {},
  orders: [],
  payments: [],

  totalOrders: 0,
  totalAmount: 0,

  metadata: {
    totalCustomers: 0,
    totalPages: 0,
    total: 0,
  },
}

// const showToastMessage = (message: string, type: string) => {
//   if (type === 'error') {
//     toast.error(message, {
//       position: toast.POSITION.TOP_RIGHT,
//     });
//   } else {
//     toast.success(message, {
//       position: toast.POSITION.TOP_RIGHT,
//     });
//   }
// };

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    customerListPending: (state) => {
      state.isLoading = true
    },

    customerListFailed: (state) => {
      state.isLoading = false
    },

    customerPending: (state) => {
      state.isLoading = true
    },

    customerFailed: (state) => {
      state.isFailed = true
      state.isLoading = false
    },

    // Customer List

    customerListSuccess: (state, action) => {
      state.customerList = action?.payload?.data
      state.metadata.totalPages = action.payload.meta.last_page
      state.metadata.total = action.payload.meta.total
      state.metadata.totalCustomers = action?.payload?.total_count

      state.isLoading = false
    },

    // Customer View

    customerViewSuccess: (state, action) => {
      console.log(action.payload, 'customer')
      state.customerDetails = action.payload.data
      state.isLoading = false
    },

    // Create and Update
    customerCreateSuccess: () => {
      // state.isSuccess = true
    },

    customerUpdateSuccess: () => {},

    ordersListSuccess: (state, action) => {
      state.orders = action?.payload?.data?.data
      state.totalOrders = action?.payload?.total_orders
      state.totalAmount = action?.payload?.total_order_amount
    },
    ordersListPending: () => {},
    ordersListFailed: () => {},

    paymentsSuccess: (state, action) => {
      // console.log(action?.payload, 'payments')
      // state.payments = action?.payload?.data?.data
    },
    paymentsPending: (state, action) => {},
    paymentsFailed: (state, action) => {},
  },
})

export const {
  customerPending,
  customerFailed,
  customerListFailed,
  customerListPending,
  customerListSuccess,
  customerViewSuccess,
  customerCreateSuccess,
  customerUpdateSuccess,
  ordersListSuccess,
  ordersListPending,
  ordersListFailed,
  paymentsSuccess,
  paymentsPending,
  paymentsFailed,
} = customerSlice.actions
export default customerSlice.reducer

export const getCustomerList = (formdata: any) =>
  apiCallBegan({
    url: `/admin/customers?page=${formdata.page}&search_key=${formdata.search_key}&customer_type=${formdata.customer_type}&sales_executive_id=${formdata.sales_executive_id}`,
    method: 'GET',
    onStart: customerListPending.type,
    onSuccess: customerListSuccess.type,
    onError: customerListFailed.type,
  })

export const createCusomer = (data: any) =>
  apiCallBegan({
    url: '/forgot-password',
    method: 'POST',
    data,
    onSuccess: customerCreateSuccess.type,
    onStart: customerPending.type,
    onError: customerFailed.type,
  })

export const UpdateCustomer = (data: any) =>
  apiCallBegan({
    url: '/reset-password',
    method: 'PUT',
    data,
    onSuccess: customerUpdateSuccess.type,
    onStart: customerPending.type,
    onError: customerFailed.type,
  })

export const ViewCustomer = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/${id}`,
    method: 'GET',
    onSuccess: customerViewSuccess.type,
    onStart: customerPending.type,
    onError: customerFailed.type,
  })
export const getCustomerOrders = (id: any, page: any, startdate: any, enddate: any) =>
  apiCallBegan({
    url: `/admin/customers/orders/${id}?page=${page}&start_date=${startdate}&end_date=${enddate}`,
    method: 'GET',
    onSuccess: ordersListSuccess.type,
    onStart: ordersListPending.type,
    onError: ordersListFailed.type,
  })
export const getCustomerPayments = (id: any, page: any) =>
  apiCallBegan({
    url: `/admin/orders/payment/${id}?page=${page}`,
    method: 'GET',
    onSuccess: paymentsPending.type,
    onStart: paymentsSuccess.type,
    onError: paymentsFailed.type,
  })
