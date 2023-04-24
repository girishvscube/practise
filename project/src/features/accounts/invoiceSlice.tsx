import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
    isfailed: false,
    invoiceList: [],
    metadata: {
        totalInvoice: 0,
        total: 0,
    },
    invoiceStats: {},
    isLoading: false,

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

export const payin = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        creationFailure: (state, action) => {
            state.isLoading = false;
            showToastMessage(action.payload.message, 'error');
        },

        SuccessfulList: (state, action) => {
            state.invoiceList = action.payload.data?.data;
            console.log(action?.payload.total_count)
            state.metadata.totalInvoice = action?.payload.total_count;
            state.metadata.total = action?.payload.total_count
            state.isLoading = false;

        },
        fetchInvoiceStatusSuccess: (state, action) => {
            state.invoiceStats = action.payload.data;
        },

        invoiceListPending: (state) => {
            state.isLoading = true;
        },


    },
});

export const {
    creationFailure,
    SuccessfulList,
    invoiceListPending,
    fetchInvoiceStatusSuccess
} = payin.actions;
export default payin.reducer;

export const fetchInvoiceList = (page: any, search_key: any, status: any, start_date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/orders/invoices?page=${page}&search_key=${search_key}&status=${status}&start_date=${start_date}&end_date=${end_date}`,
        method: 'GET',
        onStart: invoiceListPending.type,
        onSuccess: SuccessfulList.type,
        onError: creationFailure.type,
    });


export const fetchInvoiceListStats = (start_Date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/orders/invoices/count?start_date=${start_Date}&end_date=${end_date}`,
        method: 'GET',
        onSuccess: fetchInvoiceStatusSuccess.type,
        onError: creationFailure.type,
    });



