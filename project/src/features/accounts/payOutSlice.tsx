import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
    isLoading: false,
    isfailed: false,
    payoutList: [],
    invoiceList: [],
    totalPayout: 0,
    metadata: {
        totalPayout: 0,
        total: 0,
    },
    expenseStats: {},
    Loading: false,

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

export const payout = createSlice({
    name: 'payout',
    initialState,
    reducers: {
        creationFailure: (state, action) => {
            state.isLoading = false;
            showToastMessage(action.payload.message, 'error');
        },

        SuccessfulList: (state, action) => {
            state.payoutList = action.payload?.data?.data;
            console.log(action.payload?.data?.meta, "hhh")
            state.metadata.totalPayout = action.payload?.data?.meta?.total;
            state.Loading = false;

        },

        payinListPending: (state) => {
            state.Loading = true;
        },

        SuccessfulInvoiceList: (state, action) => {
            state.invoiceList = action.payload.data;
            state.Loading = false;

        },


    },
});

export const {
    creationFailure,
    SuccessfulList,
    payinListPending,
    SuccessfulInvoiceList


} = payout.actions;
export default payout.reducer;

export const fetchpayoutList = (page: any, start_date: any, end_date: any, search_key: any, bank_account_id: any) =>
    apiCallBegan({
        url: `/admin/pay-out?start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&bank_account_id=${bank_account_id}&page=${page}`,
        method: 'GET',
        onStart: payinListPending.type,
        onSuccess: SuccessfulList.type,
        onError: creationFailure.type,
    });

export const fetchPendingInvoiceList = () =>
    apiCallBegan({
        url: `/admin/pay-out/suppliers/pending-invoices/1`,
        method: 'GET',
        onStart: payinListPending.type,
        onSuccess: SuccessfulInvoiceList.type,
        onError: creationFailure.type,
    });


