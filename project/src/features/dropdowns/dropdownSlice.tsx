import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from '../middleware/api-creators'

const initialState = {
  roles: [],
  states: [],
  industry: [],
  salesExecutives: [],
  orderStatusList: [],
  customersdropdown: [],
  pocDropdown: [],
  deliveryDropdown: [],
  TimeSlots: [],
  orderTypeDropdown: [],
  paymentTypeDropdown: [],
  customerTypeDropdown: [],
  paymentTermsDropdown: [],
  paymentType: [],
  accountsDropdown: [],
  categoryDropdown: [],
  cashTypeDropdown: [],
  suppliersList: [],
  bowserdropdown: [],
  PoStatusDropdown: [],
  equipments: [],
  netDueOptions: [],

  isLoading: false,
  isSuccess: false,
  isFailed: false,
}

export const dropdown = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    getListSuccessful: (state, action) => {
      state.states = action.payload.data
    },

    getRoleSuccessful: (state, action) => {
      state.roles = action.payload.data
    },
    salesExecutivesSuccessful: (state, action) => {
      state.salesExecutives = action.payload.data
    },

    orderStatusListSuccess: (state, action) => {
      // console.log(action.payload);
      state.orderStatusList = action.payload.data
      state.salesExecutives = action.payload.data
    },
    industrySuccessful: (state, action) => {
      state.industry = action.payload.data
    },
    timeSlotSuccessful: (state, action) => {
      state.TimeSlots = action.payload.data
    },
    customersListSuccessful: (state, action) => {
      state.customersdropdown = action.payload.data
    },
    pocDropdownSuccessful: (state, action) => {
      console.log(action.payload, 'poc')
      state.pocDropdown = action.payload.data
    },
    deliveryDropdownSuccessful: (state, action) => {
      console.log(action.payload, 'del')
      state.deliveryDropdown = action.payload.data
    },
    orderTypeDropdownSuccessful: (state, action) => {
      // console.log(action.payload, 'del')
      state.orderTypeDropdown = action.payload.data
      state.deliveryDropdown = action.payload.data
    },

    paymentTypeDropdownSuccessful: (state, action) => {
      // console.log(action.payload)
      state.paymentTypeDropdown = action.payload.data
    },
    CustomerTypeDropdownSuccessful: (state, action) => {
      state.customerTypeDropdown = action.payload.data
    },

    accountsDropdownSuccessful: (state, action) => {
      // console.log(action.payload)
      state.accountsDropdown = action.payload.data
    },
    categoryDropdownSuccessful: (state, action) => {
      state.categoryDropdown = action.payload.data
    },
    cashTypeDropdownSuccessfull: (state, action) => {
      state.cashTypeDropdown = action.payload.data
    },
    supplierDropDownSuccess: (state, action) => {
      // console.log(action.payload)
      state.suppliersList = action.payload.data
    },

    paymentTermsDropdownSuccess: (state, action) => {
      console.log('action:', action.payload)
      state.paymentTermsDropdown = action.payload.data
    },

    paymentTypeDropdownSuccessfull: (state, action) => {
      state.paymentType = action.payload.data
    },
    bowserdropdownSuccessfull: (state, action) => {
      state.bowserdropdown = action.payload.data
    },
    PoStatusDropdownSuccessfull: (state, action) => {
      state.PoStatusDropdown = action.payload.data
    },
    EquipmentsSuccess: (state, action) => {
      state.equipments = action.payload.data
    },
    NetDueListSuccess: (state, action) => {
      state.netDueOptions = action.payload.data
    },
  },
})

export const {
  getListSuccessful,
  getRoleSuccessful,
  orderStatusListSuccess,
  salesExecutivesSuccessful,
  industrySuccessful,
  timeSlotSuccessful,
  customersListSuccessful,
  deliveryDropdownSuccessful,
  pocDropdownSuccessful,
  orderTypeDropdownSuccessful,
  paymentTypeDropdownSuccessful,
  paymentTermsDropdownSuccess,
  CustomerTypeDropdownSuccessful,
  paymentTypeDropdownSuccessfull,
  accountsDropdownSuccessful,
  categoryDropdownSuccessful,
  cashTypeDropdownSuccessfull,
  supplierDropDownSuccess,
  bowserdropdownSuccessfull,
  PoStatusDropdownSuccessfull,
  EquipmentsSuccess,
  NetDueListSuccess,
} = dropdown.actions
export default dropdown.reducer

export const getStateList = () =>
  apiCallBegan({
    url: '/admin/states',
    method: 'GET',
    onSuccess: getListSuccessful.type,
  })

export const getRoleList = () =>
  apiCallBegan({
    url: '/admin/roles/dropdown',
    method: 'GET',
    onSuccess: getRoleSuccessful.type,
  })
export const getSaleExecutiveList = (module?) =>
  apiCallBegan({
    url: '/admin/users/dropdown?module=' + module || '',
    method: 'GET',
    onSuccess: salesExecutivesSuccessful.type,
  })
export const getOrderStatusList = () =>
  apiCallBegan({
    url: '/admin/order-status/dropdown',
    method: 'GET',
    onSuccess: orderStatusListSuccess.type,
  })

export const getindustryList = () =>
  apiCallBegan({
    url: '/admin/industries/dropdown',
    method: 'GET',
    onSuccess: industrySuccessful.type,
  })
export const getTimeSlotList = () =>
  apiCallBegan({
    url: '/admin/settings/time-slot',
    method: 'GET',
    onSuccess: timeSlotSuccessful.type,
  })
export const getCustomersDropdown = () =>
  apiCallBegan({
    url: '/admin/customers/dropdown',
    method: 'GET',
    onSuccess: customersListSuccessful.type,
  })
export const getpocDropdown = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/poc/dropdown/${id}`,
    method: 'GET',
    onSuccess: pocDropdownSuccessful.type,
  })
export const getdeliveryDropdown = (id: any) =>
  apiCallBegan({
    url: `/admin/customers/delivery-address/dropdown/${id}`,
    method: 'GET',
    onSuccess: deliveryDropdownSuccessful.type,
  })
export const getorderTypeDropdown = () =>
  apiCallBegan({
    url: '/admin/order-type/dropdown',
    method: 'GET',
    onSuccess: orderTypeDropdownSuccessful.type,
  })

export const fetchpaymentTypeDropdown = () =>
  apiCallBegan({
    url: '/admin/settings/payment-term',
    method: 'GET',
    onSuccess: paymentTypeDropdownSuccessful.type,
  })

export const fetchCustomerTypeDropdown = () =>
  apiCallBegan({
    url: '/admin/settings/customers/type/',
    method: 'GET',
    onSuccess: CustomerTypeDropdownSuccessful.type,
  })

export const fetchaccountsDropdown = () =>
  apiCallBegan({
    url: '/admin/settings/bank-account/',
    method: 'GET',
    onSuccess: accountsDropdownSuccessful.type,
  })

export const fetchcategoryDropdown = () =>
  apiCallBegan({
    url: '/admin/settings/expense-category/',
    method: 'GET',
    onSuccess: categoryDropdownSuccessful.type,
  })

export const fetchCashTypeDropdown = () =>
  apiCallBegan({
    url: '/admin/cash-in-hand/type/dropdown/',
    method: 'GET',
    onSuccess: cashTypeDropdownSuccessfull.type,
  })

export const suppliersDropDown = () =>
  apiCallBegan({
    url: '/admin/supplier/dropdown',
    method: 'GET',
    onSuccess: supplierDropDownSuccess.type,
  })

export const fetchPaymentTypeDropdown = () =>
  apiCallBegan({
    url: '/admin/settings/payment-type',
    method: 'GET',
    onSuccess: paymentTypeDropdownSuccessfull.type,
  })

export const fetchPaymentTermsDropdown = () =>
  apiCallBegan({
    url: '/admin/settings/supplier-payment-term',
    method: 'GET',
    onSuccess: paymentTermsDropdownSuccess.type,
  })
export const fetchBowserDropdown = () =>
  apiCallBegan({
    url: '/admin/bowser/dropdown',
    method: 'GET',
    onSuccess: bowserdropdownSuccessfull.type,
  })
export const fetchPoStatusDropdown = () =>
  apiCallBegan({
    url: '/admin/purchase-order/status/dropdown',
    method: 'GET',
    onSuccess: PoStatusDropdownSuccessfull.type,
  })
export const fetchEqupiments = () =>
  apiCallBegan({
    url: '/admin/equipments/dropdown',
    method: 'GET',
    onSuccess: EquipmentsSuccess.type,
  })
export const fetchNetDueList = () =>
  apiCallBegan({
    url: '/admin/credit-net-due/dropdown',
    method: 'GET',
    onSuccess: NetDueListSuccess.type,
  })
