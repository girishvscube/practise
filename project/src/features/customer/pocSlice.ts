import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'
import { toast } from 'react-toastify'

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFailed: false,
  customerId: null,
  PocID: null,

  createPending: false,
  createFailed: false,
  createSuccess: false,

  editPending: false,
  editFailed: false,
  editSuccess: false,

  isdeleteSuccess: false,
  isdeletePending: false,
  isdeleteFailed: false,

  poc: {
    customer_id: '',
    poc_name: '',
    phone: '',
    email: '',
    designation: '',
    image: '',
  },
  pocList: [],
  islistPending: false,
  islistFailed: false,
  islistSuccess: false,

  ispocSuccess: false,
  ispocPending: false,
  ispocFailed: false,
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

export const pocSlice = createSlice({
  name: 'poc',
  initialState,
  reducers: {
    resetPoc: (state) => {
      state.poc = {
        customer_id: '',
        poc_name: '',
        phone: '',
        email: '',
        designation: '',
        image: '',
      }
    },
    resetProgress: (state) => {
      state.editSuccess = false
      state.createSuccess = false
    },

    resetDeleteProgress: (state) => {
      state.isdeleteSuccess = false
      state.isdeletePending = false
      state.isdeleteFailed = false
    },

    PocPending: (state) => {
      state.isLoading = true
    },

    PocFailed: (state) => {
      state.isFailed = true
      state.isLoading = false
    },

    ResetPocDelete: (state) => {
      state.isdeleteSuccess = false
      state.isdeletePending = false
      state.isdeleteFailed = false
    },
    ResetPocCreate: (state) => {
      state.createSuccess = false
      state.createPending = false
      state.createFailed = false
    },

    // POC List

    PocListSuccess: (state, action) => {
      //   console.log(action.payload, 'poc list')
      state.pocList = action.payload.data
      state.isLoading = false
      state.isSuccess = true
    },
    PocSuccess: (state, action) => {
      //   console.log(action.payload, 'poc list')
      state.poc = action.payload
      state.ispocPending = false
      state.ispocSuccess = true
    },

    // Create POCs
    CreatePocSuccess: (state, action) => {
      console.log(action.payload, 'poc list')
      state.PocID = action.payload.data.customer_poc_id
      state.isLoading = false
      state.createSuccess = true
      showToastMessage(action.payload.data.message, 'success')
    },
    CreatePocPending: (state) => {
      state.createPending = true
    },

    EditPocPending: (state) => {
      state.editPending = true
    },

    EditPocSuccess: (state, action) => {
      //   console.log(action.payload, 'pocEdited')
      showToastMessage(action.payload.data.message, 'success')
      state.editSuccess = true
    },
    DeletePocSuccess: (state, action) => {
      // console.log(action.payload, 'poc list')

      state.isdeletePending = false
      state.isdeleteSuccess = true
      showToastMessage(action.payload.data.message, 'success')
    },
    DeletePocPending: (state) => {
      state.isdeletePending = true
    },

    // dsadsadas

    // POC List

    PocListFailed: (state) => {
      state.islistPending = false
      state.islistSuccess = false
      state.islistFailed = true
    },
    PocListPending: (state, action) => {
      //   console.log(action.payload, 'poc list')
      state.pocList = action.payload.data
      state.islistPending = true
    },

    CreatePocFailed: (state, action) => {
      console.log('action:', action.payload)
      state.createPending = false
      state.createSuccess = false
      state.createFailed = true
      if (action.payload.message) {
        showToastMessage(action.payload.message, 'error')
      } else {
        for (let key in action.payload) {
          showToastMessage(action.payload[key][0], 'error')
        }
      }
    },

    EditPocFailed: (state, action) => {
      state.editFailed = true
      if (action.payload.message) {
        showToastMessage(action.payload.message, 'error')
      } else {
        for (let key in action.payload) {
          showToastMessage(action.payload[key][0], 'error')
        }
      }
    },

    DeletePocFailed: (state) => {
      state.isdeleteFailed = true
    },
  },
})

export const {
  ResetPocCreate,
  ResetPocDelete,
  PocPending,
  PocFailed,
  PocSuccess,
  PocListSuccess,
  CreatePocSuccess,
  CreatePocFailed,
  EditPocSuccess,
  EditPocFailed,
  DeletePocSuccess,
  CreatePocPending,
  EditPocPending,
  DeletePocPending,
  resetDeleteProgress,
  resetPoc,
  resetProgress,
} = pocSlice.actions

export default pocSlice.reducer

export const getCustomerPocList = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/all/${id}`,
    method: 'GET',
    onSuccess: PocListSuccess.type,
    onStart: PocPending.type,
    onError: PocFailed.type,
  })

export const getPoc = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/${id}`,
    method: 'GET',
    onSuccess: PocSuccess.type,
    onStart: PocPending.type,
    onError: PocFailed.type,
  })
export const CreatePoc = (data: any) =>
  apiCallBegan({
    url: '/admin/customers/poc',
    method: 'POST',
    data,
    onStart: CreatePocPending.type,
    onSuccess: CreatePocSuccess.type,
    onError: CreatePocFailed.type,
  })
export const EditPoc = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/${id}`,
    method: 'PUT',
    data,
    onSuccess: EditPocSuccess.type,
    onStart: EditPocPending.type,
    onError: EditPocFailed.type,
  })
export const DeletePoc = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/${id}`,
    method: 'DELETE',
    onSuccess: DeletePocSuccess.type,
    onStart: DeletePocPending.type,
    onError: PocFailed.type,
  })
