import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'

import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import Tab from '../View/Tab/Tab'
import TextArea from '../../../common/input/TextArea'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { fetchpaymentTypeDropdown } from '../../../../features/dropdowns/dropdownSlice'
import moment from 'moment'
import AddDiscountPopup from './AddDiscountPopup'
import EditPricePopup from './EditPricePopup'
import { uuid } from './../../../../utils/helpers'
interface Props {
  todayValue: any
  total_meta: any
  handlePaymentFields: any
  handleStep?: any
  params?: any
  handleChange: any
  ConfirmOrder?: any
  errors?: any
  handleBack: any
  setPaymentFields: any
  openAddDiscountPopup: any
  closeAddDiscountPopup: any
  openEditPricePopup: any
  closeEditPricePopup: any
  discountPopup: any
  editPricePopup: any
  handleSaveExit: any
  order: any
  setTotalMeta: any
  handlePriceEdit: any
  setButtonDisable: any
  buttonDisable: any
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
    title: 'Delivery Details & POC',
  },
  {
    title: 'Order Details',
  },

  {
    title: 'Executive info',
  },
]

const OrderConfirmation: React.FC<Props> = ({
  order,
  handleStep,
  ConfirmOrder,
  errors,
  handleBack,
  openAddDiscountPopup,
  closeAddDiscountPopup,
  discountPopup,
  handleSaveExit,
  total_meta,
  handleChange,
  editPricePopup,
  handlePriceEdit,
  openEditPricePopup,
  closeEditPricePopup,
  setTotalMeta,
  setButtonDisable,
  buttonDisable,
}) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { paymentTypeDropdown } = useSelector((state: any) => state.dropdown)
  const [meta, setMeta] = useState({
    discount_type: 'Percentage',
    grand_total: '',
    delivery_charges: '',
    per_litre_cost: '',
    total_amount: '',
    updated_total: '',
    discount: '',
    update_liter_price: '',
  } as any)
  
  useEffect(() => {
    dispatch(fetchpaymentTypeDropdown())
    setMeta(total_meta)
  }, [])

  useMemo(()=>{
    setMeta(total_meta)
  },[total_meta])

  const handlePriceChange = (e) => {
    const { name, value } = e
    setMeta({ ...meta, [name]: value })
  }

  const handleDiscountChange = (e) => {
    const { name, value } = e
    if (name === 'discount') {
      let discount = 0.0
      if (meta.discount_type == 'Percentage') {
        if (Number(value) > 100) {
          return
        }
        discount = (meta.grand_total * Number(value)) / 100
      } else {
        if (Number(value) > meta.grand_total) {
          return
        }
        discount = parseFloat(value)
      }
      let grand_total = total_meta.delivery_charges + meta.sub_total - Number(discount)
      setMeta({ ...meta, updated_total: grand_total, [name]: value })
    }
  }



  return (
    <div>
      <div>
        <div className='divstyles bg-lightbg mb-4'>
          <p className='subheading'>Customer Details</p>
          <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full'>
            <div className='flex flex-row sm:items-start items-center justify-between sm:flex-col'>
              <p className='text-xs text-textgray '>Order ID</p>
              <p className='break-all'>{order?.id}</p>
            </div>

            <div className='flex flex-row sm:items-start items-center justify-between sm:flex-col'>
              <p className='text-xs text-textgray '>Customer Id</p>
              <p className='break-all'>{order?.customer_id}</p>
            </div>

            <div className='flex flex-row sm:items-start items-center justify-between sm:flex-col'>
              <p className='text-xs text-textgray '>Company Name</p>
              <p className='break-all'>{order?.customer?.company_name}</p>
            </div>

            <div className='flex flex-row sm:items-start items-center justify-between sm:flex-col'>
              <p className='text-xs text-textgray '>Contact Number</p>
              <p className='break-all'>{order?.customer?.phone}</p>
            </div>
            <div className='flex flex-row sm:items-start items-center justify-between sm:flex-col'>
              <p className='text-xs text-textgray '>Email</p>
              <p className='break-all'>{order?.customer?.email}</p>
            </div>

            <div className='flex flex-row sm:items-start items-center justify-between sm:flex-col'>
              <p className='text-xs text-textgray '>Payment Due/ Balances</p>
              <p className='break-all'>{order?.customer?.outstanding_amount}</p>
            </div>
          </div>
        </div>
        <div className='divstyles bg-lightbg  mb-4'>
          <div className='rounded-lg'>
            <Tab
              cols={TabConstants}
              data={[
                <div className='subdiv bg-darkGray grid sm:grid-cols-4 gap-x-8 w-full'>
                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Delivery Location</p>
                    <p className='break-all'>
                      {order?.customer_delivery_details?.street_address}
                      {order?.customer_delivery_details?.city}
                      {order?.customer_delivery_details?.state}
                      {order?.customer_delivery_details?.zipcode}
                    </p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Industry Type</p>
                    <p className='break-all'>{order?.customer?.industry_type}</p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Address Type</p>
                    <p className='break-all'>{order?.customer_delivery_details?.address_type}</p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Location Contact Number</p>
                    <p className='break-all'>{order?.customer_delivery_details?.phone}</p>
                  </div>
                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Link</p>
                    <p className='w-36 break-all'>
                      {order?.customer_delivery_details?.location_url || 'NA'}
                    </p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>POC Name</p>
                    <p className='break-all'>{order?.customer_delivery_details?.poc_name}</p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>POC Phone</p>
                    <p className='break-all'>{order?.customer_delivery_details?.poc_phone}</p>
                  </div>
                </div>,

                <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full'>
                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Order Date</p>
                    <p>{moment(order?.created_at).format('DD/MM/YYYY')}</p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Order type</p>
                    <p>{order?.order_type}</p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Fuel Quantity</p>
                    <p>{order?.fuel_qty}L</p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Delivery Date</p>
                    <p>{moment(order?.delivery_date).format('DD/MM/YYYY')}</p>
                  </div>

                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Delivery Time Slot</p>
                    <p>
                      {order?.time_slot || '--'}
                    </p>
                  </div>
                </div>,
                <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full '>
                  <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
                    <p className='text-xs text-textgray '>Sales Executive</p>
                    <p>{order?.user?.name}</p>
                  </div>
                </div>,
              ]}
            />
          </div>
        </div>
        <div className='divstyles bg-lightbg  mb-4'>
          <div className='rounded-lg '>
            <div className='flex sm:flex-row flex-col justify-between border-border border-b mb-4 pb-2'>
              <p className='subheading'>Price Details</p>

              <div className='flex gap-x-4 justify-end '>
                <AddDiscountPopup
                  open={discountPopup}
                  handleOpen={openAddDiscountPopup}
                  handleClose={closeAddDiscountPopup}
                  meta={meta}
                  handleDiscountSubmit={handlePriceEdit}
                  setMeta={setMeta}
                  handleDiscountChange={handleDiscountChange}
                />

                <EditPricePopup
                  meta={meta}
                  handlePriceChange={handlePriceChange}
                  open={editPricePopup}
                  handleOpen={openEditPricePopup}
                  handleClose={closeEditPricePopup}
                  handleDiscountSubmit={handlePriceEdit}
                />
              </div>
            </div>

            {/*price info for mobile */}
            <div className='grid gap-4  sm:hidden bg-darkbg subdiv  gap-y-6 rounded-lg font-nunitoRegular '>
              <div className='flex justify-between '>
                <p className='text-textgray text-xs'>SNO</p>
                <p className='break-all'>1</p>
              </div>

              <div className='flex justify-between '>
                <p className='text-textgray text-xs'>Product Name</p>
                <p className='break-all'>ATD Diesel</p>
              </div>

              <div className='flex justify-between '>
                <p className='text-textgray text-xs'>Price Per Litre</p>
                <p className='break-all'>{total_meta?.per_litre_cost}</p>
              </div>

              <div className='flex justify-between '>
                <p className='text-textgray text-xs'>Order Quantity</p>
                <p className='break-all'>{order?.fuel_qty} Litres</p>
              </div>
              <div className='pt-1 border-t border-border '></div>

              <div className='flex justify-between '>
                <p className='text-textgray text-sm'>Total</p>
                <p className='break-all'>₹{total_meta?.total_amount}</p>
              </div>

              <div className='flex justify-between '>
                <p className='text-textgray text-sm'>Fuel Price</p>
                <p className='break-all'>₹{total_meta?.total_amount}</p>
              </div>
              <div className='flex justify-between '>
                <p className='text-textgray text-sm'>Delivery Charges</p>
                <p className='break-all'>₹{total_meta?.delivery_charges}</p>
              </div>
              {total_meta.discount ? (
                <div className='flex justify-between '>
                  <p className='text-textgray text-sm'>
                    Discount{' '}
                    {total_meta?.discount_type === 'Percentage' ? ` ${total_meta?.discount} %` : ''}
                  </p>
                  <p className='break-all'>- ₹ {total_meta.discount_amount}</p>
                </div>
              ) : null}
              <div className='pt-1 border-t border-border '></div>
              <div className='flex justify-between '>
                <p className='text-textgray text-sm'>Grand Total</p>
                <p className='break-all'>₹ {total_meta?.grand_total}</p>
              </div>
            </div>

            {/* price info for desktop details */}
            <div className=' hidden sm:block bg-darkbg  gap-y-6 rounded-lg  font-nunitoRegular'>
              <div className=' grid grid-cols-5 justify-evenly  w-full'>
                <div className='py-4 border-b border-border flex justify-evenly '>
                  <p className='text-xs text-textgray '>Sl No.</p>
                </div>

                <div className='py-4 border-b border-border flex justify-evenly '>
                  <p className='text-xs text-textgray '>Product Name</p>
                </div>

                <div className='py-4 border-b border-border flex justify-evenly '>
                  <p className='text-xs text-textgray '>Price Per Litre</p>
                </div>

                <div className='py-4 border-b border-border flex justify-evenly '>
                  <p className='text-xs text-textgray '>Order Quantity</p>
                </div>

                <div className='py-4 border-b border-border flex justify-evenly '>
                  <p className='text-xs text-textgray '>Total</p>
                </div>
              </div>
              <div className=' grid grid-cols-5 justify-evenly  w-full'>
                <div className='py-8 border-b border-border flex justify-evenly '>
                  <p className=''>1</p>
                </div>

                <div className='py-8 border-b border-border flex justify-evenly '>
                  <p className=''>ATD Diesel</p>
                </div>

                <div className='py-8 border-b border-border flex justify-evenly '>
                  <p className=''>₹ {total_meta?.per_litre_cost}</p>
                </div>

                <div className='py-8 border-b border-border flex justify-evenly '>
                  <p className=''>{order?.fuel_qty} Litres</p>
                </div>
                <div className='py-8 border-b border-border flex justify-evenly '>
                  <p className=''>{total_meta?.sub_total}</p>
                </div>
              </div>

              <div className=' flex   w-full'>
                <div className=' w-7/12' />
                <div className=' border-border border-l   w-5/12'>
                  <div className='p-5'>
                    <div className=' flex justify-between '>
                      <p className='text-xs text-textgray '>Fuel Price</p>
                      <p>₹{total_meta?.sub_total}</p>
                    </div>
                    <div className='  flex justify-between'>
                      <p className='text-xs text-textgray '>Delivery Charges</p>
                      <p> ₹{total_meta?.delivery_charges}</p>
                    </div>
                    {total_meta.discount ? (
                      <div className=' flex justify-between '>
                        <p className='text-xs text-textgray '>
                          Discount
                          {total_meta?.discount_type === 'Percentage'
                            ? ` ${total_meta?.discount} %`
                            : ''}
                        </p>
                        <p>- ₹ {total_meta.discount_amount}</p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className='p-5 flex border-t border-border justify-between '>
                    <p className='text-xs text-textgray '>Grand Total</p>
                    <p className=' text-2xl font-extrabold'>₹{total_meta?.grand_total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='divstyles bg-lightbg  mb-4'>
          <div className='rounded-lg'>
            <HeadingTab title='Payment terms' />

            <FormControl className={classes?.root} fullWidth error={!!errors?.step_2?.payment_type}>
              <InputLabel id='select-input-label'>Select Payment Type</InputLabel>
              <Select
                labelId='select-input-label'
                style={{
                  width: window.innerWidth < 768 ? '100%' : '50%',
                }}
                MenuProps={{
                  sx: {
                    '&& .MuiMenuItem-root': {
                      backgroundColor: '#2F3344',
                      border: '1px solid #404050 !important',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#444757 !important',
                      },
                    },
                    '&& .MuiMenu-list': {
                      padding: '0',
                    },

                    '&& .Mui-selected': {
                      color: '#FFCD2C !important',
                      backgroundColor: '#333748',
                    },
                  },
                }}
                sx={{
                  color: 'white',
                  '.MuiSvgIcon-root ': {
                    fill: 'white !important',
                  },
                }}
                required
                value={total_meta.payment_type}
                onChange={handleChange}
                label='Select Payment Type'
                name='payment_type'
                fullWidth
              >
                {paymentTypeDropdown?.map((item: any) => (
                  <MenuItem key={uuid()} value={item?.name}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>{errors?.step_2?.payment_type}</FormHelperText>
            </FormControl>
            <br />
            <br />
            <HeadingTab title='Additional Notes' />
            <TextArea
              className='sm:w-1/2 w-full'
              rows={5}
              handleChange={handleChange}
              name='additional_notes'
              value={total_meta?.additional_notes}
              placeholder='Additional Info'
              error={!!errors?.step_2?.additional_notes}
              helperText={errors?.step_2?.additional_notes}
            />
          </div>

          <div className=' hidden sm:flex justify-between'>
            <div>
              <CustomButton
                borderRadius='0.5rem'
                disabled={buttonDisable.confirmation}
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
            <div className='flex w-4/12 gap-x-4'>
              <CustomButton
                disabled={buttonDisable.confirmation}
                borderRadius='0.5rem'
                onClick={(e) => {
                  e.preventDefault()
                  handleSaveExit()
                }}
                width='w-full'
                variant='outlined'
                size='large'
              >
                Save & Exit
              </CustomButton>
              <CustomButton
                disabled={buttonDisable.confirmation}
                borderRadius='0.5rem'
                onClick={ConfirmOrder}
                // width="w-[307px]"
                width='w-full'
                variant='contained'
                size='large'
              >
                Save and Next
              </CustomButton>
            </div>
          </div>
        </div>

        <div className='sm:hidden grid gap-4 grid-cols-1'>
          <div className='flex gap-4'>
            <CustomButton
              disabled={buttonDisable.confirmation}
              borderRadius='0.5rem'
              onClick={(e) => {
                e.preventDefault()
                handleSaveExit()
              }}
              width='w-full'
              variant='outlined'
              size='large'
            >
              Save & Exit
            </CustomButton>
            <CustomButton
              disabled={buttonDisable.confirmation}
              borderRadius='0.5rem'
              onClick={ConfirmOrder}
              // width="w-[307px]"
              width='w-full'
              variant='contained'
              size='large'
            >
              Save and Next
            </CustomButton>
          </div>

          <CustomButton
            disabled={buttonDisable.confirmation}
            borderRadius='0.5rem'
            onClick={() => {
              handleStep(1)
              handleBack()
            }}
            width='w-7/12 m-auto'
            variant='outlined'
            size='large'
          >
            Go Back
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
