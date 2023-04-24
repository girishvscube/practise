import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
    isLoading: false,
    isfailed: false,
    purchaseBillsList: [],
    totalBills: 0,
    metadata: {
        totalBills: 0,
        total: 0,
    },
    purchaseBillStats: {},
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

export const purchaseBills = createSlice({
    name: 'purchaseBills',
    initialState,
    reducers: {
        creationFailure: (state, action) => {
            state.isLoading = false;
            showToastMessage(action.payload.message, 'error');
        },

        SuccessfulList: (state, action) => {
            state.purchaseBillsList = action.payload.data?.data;
            state.metadata.totalBills = action.payload.data?.meta?.total;
            state.metadata.total = action?.payload?.total_count
            state.Loading = false;

        },

        purchaseBillsListPending: (state) => {
            state.Loading = true;
        },
        purchaseBillStatsSuccess: (state, action) => {
            state.purchaseBillStats = action.payload.data;
        },


    },
});

export const {
    creationFailure,
    SuccessfulList,
    purchaseBillsListPending,
    purchaseBillStatsSuccess

} = purchaseBills.actions;
export default purchaseBills.reducer;

export const fetchpurchaseBillsList = (page: any, start_date: any, end_date: any, search_key: any, status: any) =>
    apiCallBegan({
        url: `/admin/purchase-bill?start_date=${start_date}&end_date=${end_date}&search_key=${search_key}&status=${status}&page=${page}`,
        method: 'GET',
        onStart: purchaseBillsListPending.type,
        onSuccess: SuccessfulList.type,
        onError: creationFailure.type,
    });

export const fetchpurchaseBillsStats = (start_Date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/purchase-bill/count?start_date=${start_Date}&end_date=${end_date}`,
        method: 'GET',
        // onStart: resetLoading.type,
        onSuccess: purchaseBillStatsSuccess.type,
        onError: creationFailure.type,
    });



