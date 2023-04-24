import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import userReducer from './userInfo/userSlice'
import leadsReducer from './leads/leadSlice'
import customerReducer from './customer/customerSlice'
import dropdownReducer from './dropdowns/dropdownSlice'
import parkingReducer from './parking/parkingSlice'
import pocReducer from './customer/pocSlice'
import deliveryReducer from './customer/deliverySlice'
import ordersReducer from './orders/orderSlice'
import browserReducer from './browser/browserSlice'
import supportReducer from './support/supportSlice'
import supplierReducer from './suppliers/supplierSlice'
import supplierPocReducer from './suppliers/pocSlice'
import bankAccountReducer from './settings/bankAccounts'
import purchaseOrderSlice from './PurchaseOrders/purchaseOrderSlice'
import expenseReducer from './accounts/expenseSlice'
import cashInHandReducer from './accounts/cashInHandSlice'
import payinReducer from './accounts/payInSlice'
import tripsReducer from './trips/tripsSlice'
import payoutReducer from './accounts/payOutSlice'
import purchaseBillReducer from './accounts/purchaseBillsSlice'
import invoiceReducer from './accounts/invoiceSlice'
import userProfileReducer from './user-profile/userProfileSlice'
export default combineReducers({
    auth: authReducer,
    user: userReducer,
    user_profile: userProfileReducer,
    dropdown: dropdownReducer,
    lead: leadsReducer,
    order: ordersReducer,
    parking: parkingReducer,
    customer: customerReducer,
    poc: pocReducer,
    delivery: deliveryReducer,
    browser: browserReducer,
    support: supportReducer,
    supplier: supplierReducer,
    supplierPoc: supplierPocReducer,
    bankAccount: bankAccountReducer,
    purchaseOrder: purchaseOrderSlice,
    expense: expenseReducer,
    cashInHand: cashInHandReducer,
    payin: payinReducer,
    trip: tripsReducer,
    payout: payoutReducer,
    purchaseBill: purchaseBillReducer,
    invoice: invoiceReducer,
})
