import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'

import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'

import Tab from './Tab/Tab'

import OrderStatus from './OrderStatus'
import DelLocationsList from './DelLocationsList'
import PocList from './PocList'
import OrderDetails from './OrderDetails'
import CustomerDetails from './CustomerDetails'

import {
  fetchOrders,
  HardReset,
  fetchPocByOrder,
  fetchOrderById,
} from '../../../../features/orders/orderSlice'
import { ViewCustomer } from '../../../../features/customer/customerSlice'
import { getOrderStatusList } from '../../../../features/dropdowns/dropdownSlice'
import {
  getCustomerPocList,
  ResetPocDelete,
  ResetPocCreate,
} from '../../../../features/customer/pocSlice'
import { getDeliveryList } from '../../../../features/customer/deliverySlice'
import PriceInfo from './PriceInfo'
import PaymentsAndInvoice from './PaymentsAndInvoice'

import Support from './Support'
import Logs from '../../../common/Logs'
import CircularProgress from '@mui/material/CircularProgress'
import OrderTracking from './../../SupportsTicket/TicketView/OrderTracking'
import { decryptData } from '../../../../utils/encryption'

const ViewOrder = () => {
  /* eslint-disable*/
  const dispatch = useDispatch()
  let { id }: any = useParams()

  id = decryptData(id)

  const { state } = useLocation()
  const customerData: any = state
  const { isLoading, isStatusUpdateSuccess, pocListByOrder, orderByid } = useSelector(
    (state: any) => state.order,
  )
  const { pocList, isdeleteSuccess, createSuccess } = useSelector((state: any) => state.poc)
  const { orderStatusList } = useSelector((state: any) => state.dropdown)
  const { deliveryList } = useSelector((state: any) => state.delivery)

  console.log(orderByid, 'orderByid')

  /* eslint-enable */
  const TabConstants = [
    {
      title: 'Customer info',
    },
    {
      title: 'Price & Payment Details',
    },
    {
      title: 'Order Tracking',
    },
    {
      title: 'Activity Logs',
    },
  ]

  useEffect(() => {
    dispatch(getOrderStatusList())
    if (id) {
      dispatch(fetchOrders(id))
      dispatch(getDeliveryList(id))
      dispatch(fetchPocByOrder(id))
      dispatch(fetchOrderById(id))
    }
  }, [id])

  useEffect(() => {
    if (isdeleteSuccess === true) {
      dispatch(getCustomerPocList(customerData?.defaultId))
      dispatch(ResetPocDelete())
    }
  }, [isdeleteSuccess])

  useEffect(() => {
    if (isStatusUpdateSuccess === true) {
      dispatch(fetchOrders(id))
      dispatch(fetchOrderById(id))
      dispatch(HardReset())
    }
  }, [isStatusUpdateSuccess])

  useEffect(() => {
    if (createSuccess === true) {
      dispatch(getCustomerPocList(customerData?.defaultId))
      dispatch(ResetPocCreate())
    }
  }, [createSuccess])

  return (
    <>
      <BreadCrumb
        links={[
          { path: 'Orders', url: '/sales/orders' },
          { path: 'View Order', url: '' },
        ]}
      />

      <p className='font-black mb-2'>View Order</p>

      {isLoading ? (
        <div className='w-full h-80 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : (
        <div className='mb-24 grid grid-cols-1 sm:grid-cols-[20rem,minmax(670px,_1fr)] gap-5 '>
          <div className='flex flex-col gap-5  '>
            <OrderDetails orderId={id} orderByid={orderByid} />
            <OrderStatus orderId={id} orderByid={orderByid} orderStatusList={orderStatusList} />
            <Support orderId={id} customerName={orderByid?.order?.customer.company_name} />
          </div>

          <div className='flex flex-col gap-5 '>
            <div className='rounded-lg'>
              <Tab
                cols={TabConstants}
                data={[
                  <div className=''>
                    <CustomerDetails customerDetails={orderByid?.order?.customer} />
                    <div className='divstyles bg-lightbg'>
                      <p className='subheading'>List of POCs</p>
                      <PocList
                        orderId={id}
                        customer_id={orderByid?.order?.customer?.id}
                        pocListByOrder={pocListByOrder}
                      />
                    </div>
                    <br />
                    <DelLocationsList orderByid={orderByid} deliveryList={deliveryList} />
                  </div>,

                  <div className=''>
                    <PriceInfo orderByid={orderByid} />
                    <PaymentsAndInvoice orderByid={orderByid} />
                  </div>,
                  <div className='divstyles bg-lightbg'>
                    <OrderTracking orderId={id} />
                  </div>,
                  <Logs logs={orderByid?.order?.logs} />,
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ViewOrder
