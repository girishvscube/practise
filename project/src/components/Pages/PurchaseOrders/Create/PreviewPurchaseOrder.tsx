import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import { uuid } from './../../../../utils/helpers'
import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import Tab from '../View/Tab/Tab'
import TextArea from '../../../common/input/TextArea'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchpaymentTypeDropdown } from '../../../../features/dropdowns/dropdownSlice'
import { ViewCustomer } from '../../../../features/customer/customerSlice'
import { getCustomerPocList } from '../../../../features/customer/pocSlice'
import { getDeliveryList } from '../../../../features/customer/deliverySlice'
import { fetchOrderById } from '../../../../features/orders/orderSlice'
import moment from 'moment'
import axiosInstance from '../../../../utils/axios'

interface Props {
  todayValue?: any
  paymentfields?: any
  handlePaymentFields?: any
  handleStep?: any
  params?: any

  ConfirmOrder?: any
  errors?: any

  handleBack?: any
  handleChange: any
  setPaymentFields?: any
  handleSaveExit?: any
  suppliersList: any
  bowserdropdown: any
  CreatePO: any
}
const useStyles = makeStyles({
  select: {
    '& ul': {
      backgroundColor: 'rgba(255, 255, 255, 0.1);',
    },
    '& li': {
      backgroundColor: '#2F3344',
    },
  },
  icon: {
    fill: 'white',
  },
  root: {
    // width: 200,
    '& .MuiOutlinedInput-input': {
      color: '#FFFF',
    },
    '& .MuiInputLabel-root': {
      color: '#6A6A78',
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#404050',
      borderRadius: '8px',
    },
    '&:hover .MuiOutlinedInput-input': {
      color: '#FFFF',
    },
    '&:hover .MuiInputLabel-root': {
      color: '#6A6A78',
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFFF',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
      color: '#FFFF',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FFCD2C',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFCD2C',
    },
  },
})

const TabConstants = [
  {
    title: 'Supplier Details',
  },
  {
    title: 'Bowser Details',
  },
]

const PreviewPO: React.FC<Props> = ({
  suppliersList,
  handleChange,
  CreatePO,
  bowserdropdown,
  handleStep,
  params,
  ConfirmOrder,
  errors,
  handleBack,
  handleSaveExit,
}) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { orderByid } = useSelector((state: any) => state.order)

  let supplier = suppliersList.find((x: any) => x.id === Number(params?.step_1?.supplier_id))

  let bowser = bowserdropdown?.find((x: any) => x.id === Number(params?.step_1?.bowser_id))

  const priceinfo = [
    {
      name: 'Sl No.',
      value: 1,
    },
    {
      name: 'Product Name',
      value: 'ATD Diesel',
    },
    {
      name: 'Price Per Litre',
      value: `₹ ${params?.step_1?.price_per_litre}`,
    },
    {
      name: 'Order Quantity',
      value: `${params?.step_1?.fuel_qty} Litres`,
    },
    {
      name: 'Total',
      value:
        `₹ ${(params?.step_1?.price_per_litre * params?.step_1?.fuel_qty).toFixed(3)} ` ?? 'NA',
    },
  ]

  const bowserinfo = [
    {
      name: 'Bowser Name:',
      value: bowser?.name,
    },
    {
      name: 'Registration Number:',
      value: bowser?.registration_no,
    },
    {
      name: 'Fuel Left Over:',
      value: bowser?.fuel_left ?? '--',
    },
    {
      name: 'Driver Name:',
      value: bowser?.driver?.name ?? '--',
    },
    {
      name: 'Last Trip End time/ Date:',
      value: bowser?.last_trip ?? '--',
    },
    {
      name: 'Parking Station:',
      value: bowser?.parkingstation?.name ?? '--',
    },
  ]

  const supplierinfo = [
    {
      name: 'Supplier ID',
      value: supplier?.id,
    },

    {
      name: 'Supplier Name',
      value: supplier?.name,
    },
    {
      name: 'Phone Number',
      value: supplier?.phone,
    },
    {
      name: 'Email ID',
      value: supplier?.email,
    },
    {
      name: 'Address',
      value: supplier?.address,
    },
    {
      name: 'GST No.',
      value: supplier?.gst,
    },
    {
      name: 'State',
      value: supplier?.state,
    },
  ]

  const customerDetails = [
    // {
    //   name: 'P0 No',
    //   value: orderByid?.order?.id,
    //   // value: userInfo?.id,
    // },
    // {
    //   name: 'PO Created  Date',
    //   value: orderByid?.order?.customer_id,
    //   // value: userInfo?.phone,
    // },
    // {
    //   name: 'Purchasing Date',
    //   value: orderByid?.order?.customer?.company_name,
    //   // value: userInfo?.role?.name,
    // },
    // {
    //   name: 'Purchase Type',
    //   value: orderByid?.order?.customer?.phone,
    //   // value: userInfo?.email,
    // },
    {
      name: 'Purchase Fuel Qty',
      value: `${params?.step_1?.fuel_qty} L`,
      // value: userInfo?.address,
    },
    // {
    //   name: 'Payment Due/ Balances',
    //   value: orderByid?.order?.customer?.outstanding_amount,
    //   // value: 'Download',
    // }
  ]

  const finalprice = [
    {
      name: 'Sub Total:',
      value: `₹ ${(params?.step_1?.price_per_litre * params?.step_1?.fuel_qty).toFixed(3)}`,
    },
    {
      name: 'Total Tax:',
      value: `Inclusive of All Taxes`,
    },
    {
      name: 'Total:',
      value: `₹ ${(params?.step_1?.price_per_litre * params?.step_1?.fuel_qty).toFixed(3)}`,
    },
    {
      name: 'Grand Total',
      value: `₹${(params?.step_1?.price_per_litre * params?.step_1?.fuel_qty).toFixed(3)}`,
    },
  ]

  return (
    <div>
      <div>
        <div className='divstyles bg-lightbg mb-4'>
          <p className='subheading'>Basic info</p>
          <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full'>
            {customerDetails?.length > 0 &&
              customerDetails?.map((item: any) => (
                <div
                  key={uuid()}
                  className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'
                >
                  <p className='text-xs text-textgray '>{item?.name}</p>
                  <p className={`break-all ${item?.name.includes('Due') && 'text-errortext'}  `}>
                    {item?.name?.includes('Due') && '₹'}
                    {item?.value}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className='divstyles bg-lightbg  mb-4'>
          <div className='rounded-lg'>
            <Tab
              cols={TabConstants}
              data={[
                <div className='subdiv bg-darkGray grid sm:grid-cols-4 gap-x-8 w-full'>
                  {supplierinfo?.length > 0 &&
                    supplierinfo?.map((item: any) => (
                      <div
                        key={uuid()}
                        className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'
                      >
                        <p className='text-xs text-textgray '>{item?.name}</p>

                        {item?.name?.includes('Link') ? (
                          <a className='break-all  underline' href={item?.value}>
                            {item?.value}
                          </a>
                        ) : (
                          <p className='break-all'>
                            {item.value}
                            {item?.address_1}
                            {item?.address_2}
                            {item?.city}
                            {item?.state} &nbsp;
                            {item?.pincode}
                          </p>
                        )}
                      </div>
                    ))}
                </div>,

                <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full'>
                  {bowserinfo?.length > 0 &&
                    bowserinfo?.map((item: any) => (
                      <div
                        key={uuid()}
                        className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'
                      >
                        <p className='text-xs text-textgray '>{item?.name}</p>
                        <p>{item?.value}</p>
                      </div>
                    ))}
                </div>,
                <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full '>
                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Sales Executive</p>
                    <p>{orderByid?.order?.user?.name}</p>
                  </div>
                </div>,
              ]}
            />
          </div>
        </div>

        {/*price info for mobile */}

        <div className='divstyles bg-lightbg  mb-4'>
          <p className='subheading'>Purchase Order Details</p>
          <div className='grid  sm:hidden bg-darkbg subdiv  rounded-lg  font-nunitoRegular '>
            {priceinfo.map((item) => {
              return (
                <div key={uuid()} className='flex justify-between '>
                  <p className='text-textgray text-sm'>{item.name}</p>
                  <p className='break-all'>{item.value}</p>
                </div>
              )
            })}
            {/* <div className='pt-1 border-t border-border '></div> */}

            {finalprice.map((item) => {
              return (
                <div key={uuid()} className='flex justify-between border-t border-border '>
                  <p className='text-textgray text-sm pt-4'>{item.name}</p>
                  <p className='break-all pt-4'>{item.value}</p>
                </div>
              )
            })}
            <div className='border-t border-border pt-4'>
              <p>Additional Information:</p>
              <p className='text-2xl'>NA</p>
            </div>
          </div>

          <div className=' hidden sm:block bg-darkbg  gap-y-6 rounded-lg  font-nunitoRegular'>
            <div className=' grid grid-cols-5 justify-evenly  w-full'>
              {priceinfo?.length > 0 &&
                priceinfo?.map((item: any) => (
                  <div key={uuid()} className='py-4 border-b border-border flex justify-evenly '>
                    <p className='text-xs text-textgray '>{item?.name}</p>
                  </div>
                ))}
            </div>
            <div className=' grid grid-cols-5 justify-evenly  w-full'>
              {priceinfo?.length > 0 &&
                priceinfo?.map((item: any) => (
                  <div key={uuid()} className='py-8 border-b border-border flex justify-evenly '>
                    <p className=''>{item?.value}</p>
                  </div>
                ))}
            </div>

            <div className=' flex   w-full'>
              <div className='p-5 w-7/12 '>
                <p className='text-xs text-textgray '>Additional Information</p>
                <p>NA</p>
              </div>
              <div className=' border-border border-l   w-5/12'>
                <div className='p-5'>
                  <div className=' flex justify-between '>
                    <p className='text-xs text-textgray '>Sub Total:</p>
                    <p>
                      ₹ {(params?.step_1?.price_per_litre * params?.step_1?.fuel_qty).toFixed(3)}
                    </p>
                  </div>
                  <div className='  flex justify-between'>
                    <p className='text-xs text-textgray '>Total Tax:</p>
                    <p>(Inclusive of All Taxes)</p>
                  </div>
                </div>
                <div className='p-5 flex border-t border-border justify-between '>
                  <p className='text-xs text-textgray '>Grand Total</p>
                  <p className=' text-2xl font-extrabold'>
                    ₹ {(params?.step_1?.price_per_litre * params?.step_1?.fuel_qty).toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='divstyles bg-lightbg  mb-4'>
          <div className='rounded-lg'>
            <HeadingTab title='Additional Notes' />
            <TextArea
              className='sm:w-1/2 w-full'
              rows={5}
              handleChange={handleChange}
              name='additional_notes'
              value={params?.step_2?.additional_notes}
              placeholder='Enter Your Notes Here...'
              error={!!errors?.step_2?.additional_notes}
              helperText={errors?.step_2?.additional_notes}
            />
          </div>

          {/* NAavigation Buttons for desktop */}
          <div className=' hidden sm:flex justify-between'>
            <div>
              <CustomButton
                borderRadius='0.5rem'
                onClick={() => {
                  handleStep(1)
                  handleBack()
                }}
                variant='outlined'
                size='large'
              >
                Go Back
              </CustomButton>
            </div>
            <div className='flex gap-x-4'>
              <CustomButton
                borderRadius='0.5rem'
                onClick={CreatePO}
                //  width="w-[307px]"
                // width='w-fit'
                variant='contained'
                size='large'
              >
                Generate PO
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Navigation buttons for mobile devices */}
        <div className='sm:hidden grid gap-4 grid-cols-1'>
          <div className='flex gap-4'>
            <CustomButton
              width='w-full'
              borderRadius='0.5rem'
              onClick={() => {
                handleStep(1)
                handleBack()
              }}
              variant='outlined'
              size='large'
            >
              Go Back
            </CustomButton>
            <CustomButton
              borderRadius='0.5rem'
              onClick={CreatePO}
              // width="w-[307px]"
              width='w-full'
              variant='contained'
              size='large'
            >
              Generate PO
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPO
