import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'
import { toast } from 'react-toastify'

const initialState = {
    isLoading: false,
    isfailed: false,
    bankAccountList: [],
    totalcashInHand: 0,
    metadata: {
        totalcashInHand: 0,
        total: 0,
    },
    cashInHandStats: {},
    Loading: false,
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

export const bankAccount = createSlice({
    name: 'bankAccount',
    initialState,
    reducers: {
        creationFailure: (state, action) => {
            state.isLoading = false
            state.Loading = false
            showToastMessage(action.payload.message, 'error')
        },

        SuccessfulList: (state, action) => {
            state.bankAccountList = action.payload?.data
            state.metadata.totalcashInHand = action.payload.data?.meta?.total
            state.Loading = false
        },

        fetchListPending: (state) => {
            state.Loading = true
        },

        cashInHandStatsSuccess: (state, action) => {
            state.cashInHandStats = action.payload.data
        },

        Setloading: (state) => {
            state.Loading = true
        },
    },
})

export const {
    creationFailure,
    SuccessfulList,
    fetchListPending,
    cashInHandStatsSuccess,
    Setloading,
} = bankAccount.actions
export default bankAccount.reducer

export const fetchBankAccountList = () =>
    apiCallBegan({
        url: `/admin/settings/bank-account/`,
        method: 'GET',
        onStart: fetchListPending.type,
        onSuccess: SuccessfulList.type,
        onError: creationFailure.type,
    })

export const fetchcashInHandStats = (start_Date: any, end_date: any) =>
    apiCallBegan({
        url: `/admin/cash-in-hand/count?start_date=${start_Date}&end_date=${end_date}`,
        method: 'GET',
        onStart: Setloading.type,
        onSuccess: cashInHandStatsSuccess.type,
        onError: creationFailure.type,
    })
