import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../middleware/api-creators';
import { toast } from 'react-toastify';

const initialState = {
    isLoading: false,
    isfailed: false,
    expenseList: [],
    totalexpense: 0,
    metadata: {
        totalexpense: 0,
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

export const expense = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        creationFailure: (state, action) => {
            state.isLoading = false;
            showToastMessage(action.payload.message, 'error');
        },

        SuccessfulList: (state, action) => {
            state.expenseList = action.payload.data?.data;
            state.metadata.totalexpense = action.payload.data?.meta?.total;
            state.Loading = false;

        },

        expenseListPending: (state) => {
            state.Loading = true;
        },

        expenseStatsSuccess: (state, action) => {
            state.expenseStats = action.payload.data;
        },
    },
});

export const {
    creationFailure,
    SuccessfulList,
    expenseListPending,
    expenseStatsSuccess,

} = expense.actions;
export default expense.reducer;

export const fetchexpenseList = (page: any, expense_type: any, account_id: any, search_key: any, start_date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/expense?page=${page}&expense_type=${expense_type}&start_date=${start_date}&end_date=${end_date}&account_id=${account_id}&search_key=${search_key}`,
        method: 'GET',
        onStart: expenseListPending.type,
        onSuccess: SuccessfulList.type,
        onError: creationFailure.type,
    });



export const fetchexpenseStats = (start_Date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/expense/count?start_date=${start_Date}&end_date=${end_date}`,
        method: 'GET',
        // onStart: resetLoading.type,
        onSuccess: expenseStatsSuccess.type,
        onError: creationFailure.type,
    });
