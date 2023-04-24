import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
    isLoading: false,
    isfailed: false,
    cashInHandList: [],
    totalcashInHand: 0,
    metadata: {
        totalcashInHand: 0,
        total: 0,
    },
    cashInHandStats: {},
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

export const expense = createSlice({
    name: 'cashInHand',
    initialState,
    reducers: {
        creationFailure: (state, action) => {
            state.isLoading = false;
            state.Loading = false
            showToastMessage(action.payload.message, 'error');
        },

        SuccessfulList: (state, action) => {
            state.cashInHandList = action.payload?.data?.data
            console.log(action.payload?.data?.data, "pay");
            state.metadata.totalcashInHand = action.payload.data?.meta?.total;
            state.Loading = false;

        },

        cashInHandListPending: (state) => {
            state.Loading = true;
        },

        cashInHandStatsSuccess: (state, action) => {
            state.cashInHandStats = action.payload.data;
        },

        Setloading: (state) => {
            state.Loading = true
        }
    },
});

export const {
    creationFailure,
    SuccessfulList,
    cashInHandListPending,
    cashInHandStatsSuccess,
    Setloading

} = expense.actions;
export default expense.reducer;

export const fetchcashInHandList = (page: any, type: any, search_key: any, start_date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/cash-in-hand?page=${page}&type=${type}&start_date=${start_date}&end_date=${end_date}&search_key=${search_key}`,
        method: 'GET',
        onStart: cashInHandListPending.type,
        onSuccess: SuccessfulList.type,
        onError: creationFailure.type,
    });



export const fetchcashInHandStats = (start_Date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/cash-in-hand/count?start_date=${start_Date}&end_date=${end_date}`,
        method: 'GET',
        onSuccess: cashInHandStatsSuccess.type,
        onError: creationFailure.type,
    });
