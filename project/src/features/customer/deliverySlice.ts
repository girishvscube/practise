import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'
import { toast } from 'react-toastify'

const initialState = {
  isdeliveryListSucccess: false,
  isdeliveryListPending: false,
  isdeliveryListFailed: false,

  iscreatePending: false,
  iscreateFailed: false,
  iscreateSuccess: false,

  iseditPending: false,
  iseditFailed: false,
  iseditSuccess: false,

  isdeleteDelSuccess: false,
  isdeleteDelPending: false,
  isdeleteDelFailed: false,

  isdeliverySuccess: false,
  isdeliveryPending: false,
  isdeliveryFailed: false,

  delivery: {
    address_1: '',
    address_2: '',
    pincode: '',
    address_type: '',
    city: '',
    state: '',
    phone: '',
    landmark: '',
    location: '',
    customer_poc_id: '',
    fuel_price: '',
    is_fuel_price_checked: false,
  },
  deliveryList: [],
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

export const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    resetCreateProgress: (state: any) => {
      state.iscreatePending = false
      state.iscreateSuccess = false
      state.iscreateFailed = false
    },

    resetDelivery: (state) => {
      state.iscreatePending = false
      state.iscreateFailed = false
      state.iscreateSuccess = false

      state.iseditPending = false
      state.iseditFailed = false
      state.iseditSuccess = false
    },

    resetDelete: (state) => {
      state.isdeleteDelSuccess = false
      state.isdeleteDelPending = false
      state.isdeleteDelFailed = false
    },
    resetdeliveryform: (state) => {
      state.delivery = {
        address_1: '',
        address_2: '',
        pincode: '',
        address_type: '',
        city: '',
        state: '',
        phone: '',
        landmark: '',
        location: '',
        customer_poc_id: '',
        fuel_price: '',
        is_fuel_price_checked: false,
      }
    },
    // specific delivery
    DeliveryPending: (state) => {
      state.isdeliveryPending = true
    },
    DeliverySuccess: (state, action) => {
      state.delivery = action.payload.data
      state.isdeliverySuccess = true
    },
    DeliveryFailed: (state) => {
      state.isdeliveryFailed = true
    },

    // Delivery List
    DeliveryListSuccess: (state, action) => {
      state.deliveryList = action.payload.data
      state.isdeliveryListPending = false
      state.isdeliveryListSucccess = true
    },
    DeliveryListPending: (state) => {
      state.isdeliveryListPending = true
    },
    DeliveryListFailed: (state) => {
      state.isdeliveryListPending = false
      state.isdeliveryListSucccess = false
    },

    // Create and Update
    CreateDeliverySuccess: (state, action) => {
      // console.log('CreateDeliverySuccess', action.payload);
      state.iscreatePending = false
      state.iscreateSuccess = true
      showToastMessage(action.payload.data.message, 'success')
    },

    CreateDeliveryPending: (state) => {
      state.iscreatePending = true
    },
    CreateDeliveryFailed: (state, action) => {
      state.iscreatePending = false
      state.iscreateSuccess = false

      if (action.payload.message) {
        showToastMessage(action.payload.message, 'error')
      } else {
        for (let key in action.payload) {
          showToastMessage(action.payload[key][0], 'error')
        }
      }
    },

    UpdateDeliverySuccess: (state, action) => {
      showToastMessage(action.payload.data.message, 'success')

      // console.log('UpdateDeliverySuccess', action.payload);
      state.iseditPending = false
      state.iseditSuccess = true
    },
    UpdateDeliveryPending: (state) => {
      state.iseditPending = true
    },
    UpdateDeliveryFailed: (state, action) => {
      state.iseditPending = false
      state.iseditSuccess = false
      if (action.payload.message) {
        showToastMessage(action.payload.message, 'error')
      } else {
        for (let key in action.payload) {
          showToastMessage(action.payload[key][0], 'error')
        }
      }
    },

    // Delete
    DeleteDeliverySuccess: (state, action) => {
      state.isdeleteDelSuccess = true
      state.isdeleteDelPending = false
      showToastMessage(action.payload.data.message, 'success')
    },
    DeleteDeliveryPending: (state) => {
      state.isdeleteDelPending = true
    },
    DeleteDeliveryFailed: (state) => {
      state.isdeleteDelSuccess = false
      state.isdeleteDelPending = false
    },
  },
})

export const {
  resetCreateProgress,

  DeliverySuccess,
  DeliveryPending,
  DeliveryFailed,

  DeliveryListSuccess,
  DeliveryListPending,
  DeliveryListFailed,

  CreateDeliverySuccess,
  CreateDeliveryPending,
  CreateDeliveryFailed,

  UpdateDeliverySuccess,
  UpdateDeliveryPending,
  UpdateDeliveryFailed,

  DeleteDeliverySuccess,
  DeleteDeliveryPending,
  DeleteDeliveryFailed,

  resetDelivery,
  resetdeliveryform,
  resetDelete,
} = deliverySlice.actions

export default deliverySlice.reducer

export const getDelivery = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/delivery-address/${id}`,
    method: 'GET',
    onSuccess: DeliverySuccess.type,
    onStart: DeliveryPending.type,
    onError: DeliveryFailed.type,
  })
export const getDeliveryList = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/delivery-address/all/${id}`,
    method: 'GET',
    onSuccess: DeliveryListSuccess.type,
    onStart: DeliveryListPending.type,
    onError: DeliveryListFailed.type,
  })
export const CreateDelivery = (data: any) =>
  apiCallBegan({
    url: '/admin/customers/delivery-address',
    method: 'POST',
    data,
    onSuccess: CreateDeliverySuccess.type,
    onStart: CreateDeliveryPending.type,
    onError: CreateDeliveryFailed.type,
  })
export const UpdateDelivery = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/customers/delivery-address/${id}`,
    method: 'PUT',
    data,
    onSuccess: UpdateDeliverySuccess.type,
    onStart: UpdateDeliveryPending.type,
    onError: UpdateDeliveryFailed.type,
  })
export const DeleteDelivery = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/delivery-address/${id}`,
    method: 'DELETE',
    onSuccess: DeleteDeliverySuccess.type,
    onStart: DeleteDeliveryPending.type,
    onError: DeleteDeliveryFailed.type,
  })
