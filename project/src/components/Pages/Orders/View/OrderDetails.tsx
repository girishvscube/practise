import CustomButton from '../../../common/Button'

import moment from 'moment'
import { Link } from 'react-router-dom'
import { DownloadSOInvoice } from './../../../../utils/helpers'
import { encryptData } from './../../../../utils/encryption'
import { uuid } from './../../../../utils/helpers'

interface Props {
  orderByid: any
  orderId: any
}

const OrderDetails: React.FC<Props> = ({ orderByid, orderId }) => {
  const basicinfo = [
    {
      name: 'Order Id',
      value: orderId,
    },
    {
      name: 'Ordered Date',
      value: moment(orderByid?.order?.created_at).format('DD/MM/YYYY'),
    },
    {
      name: 'Order Type',
      value: orderByid?.order?.order_type,
    },
    {
      name: 'Fuel Quantity',
      value: `${orderByid?.order?.fuel_qty} L`,
    },
    {
      name: 'Delivery Date',
      value: moment(orderByid?.order?.delivery_date).format('DD/MM/YYYY'),
    },
    {
      name: 'Delivery Time Slot',
      value: `${
        orderByid?.order?.time_slot || ''
      }`,
    },
  ]

  return (
    <div className='flex   flex-col  divstyles bg-lightbg w-full '>
      <p className='subheading'>Order Details</p>
      <div className='bg-darkbg  flex flex-col gap-y-6 rounded-lg p-[24px] font-nunitoRegular '>
        {basicinfo?.map((item) => (
          <div key={uuid()} className='flex justify-between'>
            <p className=' text-xs text-textgray pt-1'>{item?.name}</p>
            <p className='text-sm text-white text-righ'>{item?.value}</p>
          </div>
        ))}

        {orderByid?.order?.is_order_confirmed ? (
          <div className='flex justify-between'>
            <p className=' text-xs text-textgray pt-1'>Download</p>
            <p className={`text-sm text-green text-right`}>
              <button
                onClick={() => {
                  DownloadSOInvoice(orderId)
                }}
                className='text-green'
              >
                <svg
                  className=' pb-1 inline-block'
                  width='20'
                  height='20'
                  viewBox='0 0 14 14'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.08097 9.2907L7.08097 1.26337'
                    stroke='#3AC430'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9.02466 7.33887L7.08066 9.29087L5.13666 7.33887'
                    stroke='#3AC430'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M10.1693 4.41864H10.7913C12.148 4.41864 13.2473 5.51797 13.2473 6.87531L13.2473 10.1313C13.2473 11.4846 12.1506 12.5813 10.7973 12.5813L3.37065 12.5813C2.01398 12.5813 0.913982 11.4813 0.913982 10.1246L0.913982 6.86797C0.913982 5.51531 2.01132 4.41864 3.36398 4.41864H3.99198'
                    stroke='#3AC430'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Download
              </button>
            </p>
          </div>
        ) : null}
      </div>
      <br />
      {!orderByid?.order?.is_order_confirmed && !orderByid?.order?.is_order_cancelled ? (
        <CustomButton
          borderRadius='5rem'
          width='m-auto w-fit '
          variant='outlined'
          size='medium'
          icon={
            <svg
              width='12'
              height='12'
              viewBox='0 0 12 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6.87402 10.2214H10.5003'
                stroke='#FFCD2C'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M6.39 1.8974C6.77783 1.43389 7.47499 1.36593 7.94811 1.74587C7.97427 1.76648 8.81474 2.41939 8.81474 2.41939C9.33449 2.7336 9.49599 3.40155 9.1747 3.91129C9.15764 3.93859 4.40597 9.88224 4.40597 9.88224C4.24789 10.0794 4.00792 10.1959 3.75145 10.1987L1.93176 10.2215L1.52177 8.48616C1.46433 8.24215 1.52177 7.98589 1.67985 7.78867L6.39 1.8974Z'
                stroke='#FFCD2C'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M5.51074 3.00049L8.23687 5.09405'
                stroke='#FFCD2C'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          }
        >
          <Link to={`/sales/orders/edit/${encryptData(orderId)}`}>Edit Order</Link>
        </CustomButton>
      ) : (
        <></>
      )}
    </div>
  )
}

export default OrderDetails
