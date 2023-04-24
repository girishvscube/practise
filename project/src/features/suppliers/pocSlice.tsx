import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

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
    supplier_id: '',
    poc_name: '',
    phone: '',
    email: '',
    designation: '',
    image: '',
  },
  pocList: [],
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

export const pocSlice = createSlice({
  name: 'supplierPoc',
  initialState,
  reducers: {
    PocPending: (state) => {
      state.isLoading = true;
    },

    PocFailed: (state) => {
      state.isFailed = true;
      state.isLoading = false;
    },

    // POC List

    PocListSuccess: (state, action) => {
      //   console.log(action.payload, 'poc list')
      state.pocList = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
    },
    PocSuccess: (state, action) => {
      //   console.log(action.payload, 'poc list')
      state.poc = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
    },

    // Create POCs
    CreatePocSuccess: (state, action) => {
      showToastMessage('POC Created Successfully', 'success');
      state.PocID = action.payload.customer_PocID;
      state.isLoading = false;
      state.createSuccess = true;

    },
    createPoSet: (state) => {
      state.createSuccess = false;
    },
    CreatePocPending: (state) => {
      state.createPending = true;
      state.isLoading = true
    },
    EditPocPending: (state) => {
      state.editPending = true;
      state.isLoading = true
    },

    EditPocSuccess: (state, action) => {
      showToastMessage('POC Updated Successfully', 'success');
      state.editSuccess = true;
      state.isLoading = false
    },

    EditPocSet: (state) => {
      state.editSuccess = false;
    },
    DeletePocSuccess: (state, action) => {
      state.pocList = action.payload;
      state.isdeletePending = false;
      state.isdeleteSuccess = true;
      showToastMessage(action.payload.message, 'success');
    },
    DeletePocPending: (state) => {
      state.isdeletePending = true;
    },
  },
});

export const {
  PocPending,
  PocFailed,
  PocSuccess,
  PocListSuccess,
  CreatePocSuccess,
  EditPocSuccess,
  DeletePocSuccess,
  CreatePocPending,
  EditPocPending,
  DeletePocPending,
  EditPocSet,
  createPoSet,
} = pocSlice.actions;

export default pocSlice.reducer;

export const getCustomerPocList = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/all/${id}`,
    method: 'GET',
    onSuccess: PocListSuccess.type,
    onStart: PocPending.type,
    onError: PocFailed.type,
  });

export const getPoc = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/${id}`,
    method: 'GET',
    onSuccess: PocSuccess.type,
    onStart: PocPending.type,
    onError: PocFailed.type,
  });
export const CreatePoc = (data: any) =>
  apiCallBegan({
    url: '/admin/supplier-poc',
    method: 'POST',
    data,
    onStart: CreatePocPending.type,
    onSuccess: CreatePocSuccess.type,
    onError: PocFailed.type,
  });
export const EditPoc = (data: any, id: any) =>
  apiCallBegan({
    url: `/admin/supplier-poc/${id}`,
    method: 'PUT',
    data,
    onStart: EditPocPending.type,
    onSuccess: EditPocSuccess.type,
    onError: PocFailed.type,
  });
export const DeletePoc = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/${id}`,
    method: 'DELETE',
    onSuccess: DeletePocSuccess.type,
    onStart: DeletePocPending.type,
    onError: PocFailed.type,
  });
