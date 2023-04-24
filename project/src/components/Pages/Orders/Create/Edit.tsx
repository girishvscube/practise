import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../../../../utils/axios'
import { Input } from '../../../common/input/Input'
import { SelectInput } from '../../../common/input/Select'
import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import CreateDeliveryModal from './CreateDeliveryModal'
import { MultiSelectInput } from '../../../common/input/MultiSelect'
import CommonDatepicker from './../../../common/input/Datepicker'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import AddDiscountPopup from './AddDiscountPopup'
import EditPricePopup from './EditPricePopup'
import { menuStyles, showToastMessage, useSelectStyles } from '../../../../utils/helpers'
import TextArea from '../../../common/input/TextArea'
import Validator from 'validatorjs'
import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress'
import Popup from '../../../common/Popup'
import { decryptData } from '../../../../utils/encryption'
import { uuid } from './../../../../utils/helpers'
const initialValues = {
  customer_id: '',
  customer_delivery_details: '',
  total_amount: '',
  per_litre_cost: '',
  delivery_charges: '',
  fuel_qty: '',
  discount: '',
  grand_total: '',
  discount_type: 'Percentage',
  payment_type: '',
  additional_notes: '',
  discount_amount: '',
  id: '',
  customer_delivery_id: '',
  order_type: '',
  delivery_date: '',
  time_slot_id: '',
  sales_executive_id: '',
  poc_ids: [],
  updated_total:0,
  sub_total:0
}
const initialDialogMeta = {
  is_price_edit_open: false,
  is_discount_edit_open: false,
}
const EditOrder = () => {
  let { id } = useParams()
  id = decryptData(id)
  const navigate = useNavigate()
  const classes = useSelectStyles()
  const [disableCTA, setDisableCTA] = useState(false)
  const [order, setOrder] = useState({} as any)
  const [params, setParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)
  const [deliverLocList, setDeliverLocList] = useState([])
  const [orderTypeList, setOrderTypeList] = useState([])
  const [timeSlotList, setTimeSlotList] = useState([])
  const [usersList, setUsersList] = useState([])
  const [paymentTermsList, setPaymentTermsList] = useState([])
  const [handleDialog, setDialogMeta] = useState(initialDialogMeta)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setParams({ ...params, [name]: value })
    setErrors(initialValues)
  }

  const [open, setOpen] = useState({
    success: false,
    warning: false,
    question: false,
  })
  const [cancel, setCancel] = useState(false)

  const onCancel = () => {
    handleClickOpen('warning', true)
    setCancel(true)
  }

  const handleClickOpen = (key: any, value: any) => {
    setOpen({ ...open, [key]: value })
  }

  const Confirmation = async () => {
    // console.log('confimerd');
    if (cancel) {
      navigate('/sales/orders')
    } else {
      updateOrder()
    }
  }

  const handleOkay = () => {
    navigate('/sales/orders')
  }

  const CofirmAndEditOrder = (e: any) => {
    e.preventDefault()

    const validation = new Validator(params, {
      payment_type: 'required',
      sales_executive_id: 'required',
      per_litre_cost: 'required',
      customer_delivery_id: 'required',
      time_slot_id: 'required',
      fuel_qty: 'required',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setErrors(fieldErrors)
      return false
    }

    setErrors(initialValues)

    handleClickOpen('warning', true)
  }

  const handleDeliveryDateChange = (e: any) => {
    setParams({ ...params, delivery_date: moment(e).format('YYYY-MM-DD') })
    setErrors(initialValues)
  }

  const handleDialogOpen = (type) => {
    let key = type === 'edit' ? 'is_price_edit_open' : 'is_discount_edit_open'
    setDialogMeta({ ...initialDialogMeta, [key]: true })
  }

  const handlePriceEdit = (e: any) => {
    let sub_total =
      Number(params.fuel_qty) *
      Number(e.update_liter_price ? e.update_liter_price : e.per_litre_cost)
    let total_amount = sub_total
    let discount = 0
    if (e.discount) {
      if (params.discount_type == 'Percentage') {
        discount = (total_amount * Number(e.discount)) / 100
      } else {
        discount = parseFloat(e.discount)
      }
    }

    let grand_total = Number(params.delivery_charges || 0) + sub_total - discount
    setParams({
      ...params,
      per_litre_cost: e.update_liter_price ? e.update_liter_price : e.per_litre_cost,
      discount: e.discount,
      grand_total: String(grand_total),
      discount_type: e.discount_type ? e.discount_type : params.discount_type,
      discount_amount: discount ? String(discount) : '',
      sub_total:Number(e.update_liter_price ? e.update_liter_price : e.per_litre_cost) * Number(order.fuel_qty)
    })
  }

  const handlePriceChange = (e) => {
    const { name, value } = e
    setParams({ ...params, [name]: value })
  }

  const handleDiscountChange = (e) => {
    const { name, value } = e
    if (name === 'discount') {
      let discount = 0.0
      if (params.discount_type == 'Percentage') {
        if (Number(value) > 100) {
          return
        }
        discount = (Number(params.grand_total) * Number(value)) / 100
      } else {
        if (Number(value) > Number(params.grand_total)) {
          return
        }
        discount = parseFloat(value)
      }
      let grand_total = order.delivery_charges + order.total_amount - Number(discount)
      setParams({ ...params, updated_total: Number(grand_total), [name]: value })
    }
  }

  useEffect(() => {
    fetchOrder(id)
    fetchExecutives()
    fetchOrderTypes()
    fetchPaymentTypes()
  }, [])

  useEffect(() => {
    if (Object.keys(order).length) {
      Promise.all([fetchTimeSlots(order), fetchDeliveryLoc(order)]).then((resp) => {
        let list = timeSlotList.map((x: any) => {
          return {
            id: x.id,
            label: `${x.name}-${x.start} to ${x.end}`,
          }
        })
        let item = list.find((x) => x.label === order.time_slot)
        let delivery: any = deliverLocList.find(
          (x: any) => x.address_1 === order.customer_delivery_details.street_address,
        )
        setParams({
          ...params,
          time_slot_id: item ? item.id : '',
        })
      })
    }
  }, [order])

  const fetchOrder = (id) => {
    axiosInstance
      .get(`/admin/orders/${id}`)
      .then((response) => {
        let order = response.data.data.order
        console.log(order)
        if (order.is_order_cancelled) {
          navigate('/sales/orders')
          showToastMessage('Orders not editabe once its confirmed', 'error')
          return
        }
          setParams({ ...order, ...{ customer_delivery_id: order.customer_delivery_details.id , 
            sub_total:Number(order.per_litre_cost) * Number(order.fuel_qty),discount_amount: order.discount} })
        setOrder(order)
      })
      .catch(() => {
        // show error message and navigate to list
        navigate('/sales/orders')
        showToastMessage('UNABLE TO FETCH ORDER', 'error')
      })
  }

  const fetchExecutives = () => {
    axiosInstance
      .get(`/admin/users/dropdown?module=sales`)
      .then((response) => {
        setUsersList(response.data.data)
      })
      .catch(() => {
        showToastMessage('Unable to Fetch Sales Users', 'error')
      })
  }

  const fetchOrderTypes = () => {
    axiosInstance
      .get(`/admin/order-type/dropdown`)
      .then((response) => {
        setOrderTypeList(response.data.data)
      })
      .catch(() => {
        showToastMessage('Unable to Fetch Order Type', 'error')
      })
  }

  const fetchTimeSlots = (order) => {
    axiosInstance
      .get(`/admin/settings/time-slot`)
      .then((response) => {
        setTimeSlotList(response.data.data)
      })
      .catch(() => {
        showToastMessage('Unable to Time Slots', 'error')
      })
  }

  const fetchDeliveryLoc = (order) => {
    axiosInstance
      .get(`/admin/customers/delivery-address/dropdown/${order.customer_id}`)
      .then((response) => {
        setDeliverLocList(response.data.data)
      })
      .catch(() => {
        showToastMessage('Unable to Time Slots', 'error')
      })
  }

  const fetchPaymentTypes = () => {
    axiosInstance
      .get(`/admin/settings/payment-term`)
      .then((response) => {
        setPaymentTermsList(response.data.data)
      })
      .catch(() => {
        showToastMessage('Unable to Fetch Payment Terms', 'error')
      })
  }

  const updateOrder = () => {
    console.log(params)

    setDisableCTA(true)
    let obj = {
      total_amount: params.total_amount,
      per_litre_cost: params.per_litre_cost,
      delivery_charges: params.delivery_charges,
      fuel_qty: params.fuel_qty,
      discount: params.discount,
      grand_total: params.grand_total,
      discount_type: params.discount_type,
      payment_type: params.payment_type,
      additional_notes: params.additional_notes,
      discount_amount: params.discount_amount,
      customer_delivery_id: params.customer_delivery_id,
      order_type: params.order_type,
      delivery_date: moment(params.delivery_date).format('YYYY-MM-DD'),
      sales_executive_id: params.sales_executive_id,
      time_slot: '',
    }
    let timeStamp: any = timeSlotList.find((x: any) => x.id === params.time_slot_id)
    if (timeStamp) {
      obj['time_slot'] = `${timeStamp.name}-${timeStamp.start} to ${timeStamp.end}`
    }

    axiosInstance
      .put(`/admin/orders/${order?.id}`, obj)
      .then((response) => {
        navigate('/sales/orders')
        showToastMessage('ORDER UPDATED SUCCESSFULLY', 'success')
      })
      .catch(() => {
        // show error message and navigate to list
        setDisableCTA(false)
        showToastMessage('UNABLE TO UPDATE ORDER', 'error')
      })
  }

  return (
    <div className='container mx-auto'>
      <div>
        <BreadCrumb
          links={[
            { path: 'Orders', url: '/sales/orders' },
            { path: 'View Order', url: '/sales/orders/view/180' },
            { path: 'Edit Order', url: '' },
          ]}
        />
        <p className='text-xl font-extrabold text-white font-nunitoRegular'>Edit Order Info</p>
        <div className='w-full mt-[29px] p-[6px] lg:p-[20px] bg-[#262938] rounded-lg'>
          <div>
            <HeadingTab title='Order  Details' />
            <div className='grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]'>
              <Input
                rows={1}
                width='w-full'
                readOnly={true}
                value={params?.id}
                label='Order Id'
                name='id'
              />

              <SelectInput
                width='100%'
                options={orderTypeList}
                error={!!errors.order_type}
                helperText={errors?.order_type}
                handleChange={handleChange}
                value={params?.order_type}
                label='Select Order Type'
                name='order_type'
              />

              <CommonDatepicker
                error={errors?.delivery_date}
                label='Select Delivery Date'
                onChange={handleDeliveryDateChange}
                value={params?.delivery_date}
              />

              <SelectInput
                width='100%'
                options={timeSlotList}
                error={!!errors.time_slot_id}
                helperText={errors?.time_slot_id}
                handleChange={handleChange}
                value={params?.time_slot_id}
                label='Select Delivery Time Slot'
                name='time_slot_id'
              />

              <Input
                rows={1}
                width='w-full'
                error={!!errors.fuel_qty}
                helperText={errors.fuel_qty}
                handleChange={handleChange}
                value={params?.fuel_qty}
                label='Enter Fuel Quantity (In litres)'
                name='fuel_qty'
              />
            </div>
          </div>

          <br />

          <div>
            <HeadingTab title='Delivery Location' />
            <FormControl
              className={`${classes.root}`}
              fullWidth
              error={!!errors.customer_delivery_id}
            >
              <InputLabel id='select-input-label'>Select Delivery Location</InputLabel>
              <Select
                labelId='select-input-label'
                style={{
                  width: window.innerWidth < 768 ? '100%' : '50%',
                }}
                MenuProps={menuStyles}
                sx={{
                  color: 'white',
                  '.MuiSvgIcon-root ': {
                    fill: 'white !important',
                  },
                }}
                required={true}
                value={params?.customer_delivery_id}
                onChange={handleChange}
                label='Select Delivery Location'
                name='customer_delivery_id'
                error={!!errors.customer_delivery_id}
                fullWidth
              >
                {deliverLocList.length > 0 ? (
                  deliverLocList?.map((item: any) => (
                    <MenuItem key={uuid()} value={item.id}>
                      {item?.address_1},&nbsp;
                      {item?.address_2},&nbsp;
                      {item?.state},&nbsp;
                      {item?.pincode}.
                    </MenuItem>
                  ))
                ) : (
                  <p className='text-white p-4 text-xl'>Delivery addresses not found !</p>
                )}
              </Select>
              <FormHelperText>{errors?.customer_delivery_id}</FormHelperText>
            </FormControl>{' '}
            <br />
            <br />
          </div>
          <br />

          <div>
            <HeadingTab title='Assign Sales Executive' />
            <div className=''>
              <SelectInput
                required
                width={window.innerWidth < 768 ? '100%' : '50%'}
                options={usersList}
                error={!!errors.sales_executive_id}
                helperText={errors?.sales_executive_id}
                handleChange={handleChange}
                value={params?.sales_executive_id}
                label='Assign Sales Executive'
                name='sales_executive_id'
              />
            </div>
          </div>

          <br />
          {Object.keys(order).length ? (
            <div className='divstyles bg-lightbg  mb-4'>
              <div className='rounded-lg '>
                <div className='flex sm:flex-row flex-col justify-between border-border border-b mb-4 pb-2'>
                  <p className='subheading'>Price Details</p>

                  <div className='flex gap-x-4 justify-end '>
                    <AddDiscountPopup
                      open={handleDialog.is_discount_edit_open}
                      handleOpen={() => handleDialogOpen('discount')}
                      handleClose={() => setDialogMeta(initialDialogMeta)}
                      meta={params}
                      handleDiscountSubmit={handlePriceEdit}
                      setMeta={setParams}
                      handleDiscountChange={handleDiscountChange}
                    />

                    <EditPricePopup
                      meta={params}
                      open={handleDialog.is_price_edit_open}
                      handleOpen={() => handleDialogOpen('edit')}
                      handleClose={() => setDialogMeta(initialDialogMeta)}
                      handleDiscountSubmit={handlePriceEdit}
                      handlePriceChange={handlePriceChange}
                    />
                  </div>
                </div>

                {/*price info for mobile */}
                <div className='grid gap-4  sm:hidden bg-darkbg subdiv  gap-y-6 rounded-lg font-nunitoRegular '>
                  <div className='flex justify-between '>
                    <p className='text-textgray text-sm'>Fuel Price</p>
                    <p className='break-all'>₹{params?.total_amount}</p>
                  </div>
                  <div className='flex justify-between '>
                    <p className='text-textgray text-sm'>Delivery Charges</p>
                    <p className='break-all'>₹{params?.delivery_charges}</p>
                  </div>
                  <div className='flex justify-between '>
                    <p className='text-textgray text-sm'>Grand Total</p>
                    <p className='break-all'>₹{params?.grand_total}</p>
                  </div>
                  <div className='pt-1 border-t border-border '></div>
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
                      <p className=''>₹ {params?.per_litre_cost}</p>
                    </div>

                    <div className='py-8 border-b border-border flex justify-evenly '>
                      <p className=''>{params?.fuel_qty} Litres</p>
                    </div>
                    <div className='py-8 border-b border-border flex justify-evenly '>
                      <p className=''>{params?.sub_total}</p>
                    </div>
                  </div>

                  <div className=' flex   w-full'>
                    <div className=' w-7/12' />
                    <div className=' border-border border-l   w-5/12'>
                      <div className='p-5'>
                        <div className=' flex justify-between '>
                          <p className='text-xs text-textgray '>Fuel Price</p>
                          <p>₹{params?.sub_total}</p>
                        </div>
                        <div className='  flex justify-between'>
                          <p className='text-xs text-textgray '>Delivery Charges</p>
                          <p> ₹{params?.delivery_charges}</p>
                        </div>
                        {params.discount ? (
                          <div className=' flex justify-between '>
                            <p className='text-xs text-textgray '>
                              Discount
                              {params?.discount_type === 'Percentage'
                                ? ` ${params?.discount} %`
                                : ''}
                            </p>
                            <p>- ₹ {params.discount_amount}</p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className='p-5 flex border-t border-border justify-between '>
                        <p className='text-xs text-textgray '>Grand Total</p>
                        <p className=' text-2xl font-extrabold'>₹{params?.grand_total}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className='divstyles bg-lightbg  mb-4'>
            <div className='rounded-lg'>
              <HeadingTab title='Payment terms' />

              <FormControl className={classes?.root} fullWidth error={!!errors?.payment_type}>
                <InputLabel id='select-input-label'>Select Payment Type</InputLabel>
                <Select
                  error={!!errors?.payment_type}
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
                  value={params.payment_type}
                  onChange={handleChange}
                  label='Select Payment Type'
                  name='payment_type'
                  fullWidth
                >
                  {paymentTermsList?.map((item: any) => (
                    <MenuItem key={uuid()} value={item?.name}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>{errors?.payment_type}</FormHelperText>
              </FormControl>
              <br />
              <br />
              <HeadingTab title='Additional Notes' />
              <TextArea
                className='sm:w-1/2 w-full'
                rows={5}
                handleChange={handleChange}
                name='additional_notes'
                value={params?.additional_notes}
                placeholder='Additional Info'
                error={!!errors?.additional_notes}
                helperText={errors?.additional_notes}
              />
            </div>
          </div>

          {/* NAavigation Buttons  for desktop*/}
          <div className='hidden sm:flex justify-between'>
            <div>
              <CustomButton
                disabled={disableCTA}
                borderRadius='0.5rem'
                onClick={(e) => {
                  e.preventDefault()
                  onCancel()
                }}
                width='w-full'
                variant='outlined'
                size='large'
              >
                Cancel
              </CustomButton>
            </div>
            <div className='flex w-4/12 gap-x-4'>
              <CustomButton
                disabled={disableCTA}
                borderRadius='0.5rem'
                onClick={CofirmAndEditOrder}
                // width="w-[307px]"
                width='w-full'
                variant='contained'
                size='large'
              >
                Update and Confirm Order
              </CustomButton>
            </div>
          </div>

          <div className=''>
            <Popup
              Confirmation={Confirmation}
              handleNo={() => {
                // setButtonDisable({ ...buttonDisable, proforma: false })
                handleClickOpen('warning', false)
              }}
              open={open?.warning}
              handleClickOpen={handleClickOpen}
              popup='warning'
              subtitle={`${
                cancel ? 'Changes are not saved !' : 'Do you want to Update And Confirm Order ?'
              }`}
              popupmsg={`${
                cancel ? 'Do you want to Proceed without Saving the Details ?' : 'Are you Sure?'
              }`}
            />
            <Popup
              Confirmation={Confirmation}
              open={open?.success}
              handleClickOpen={handleClickOpen}
              popup='success'
              subtitle='Successfully Created!!'
              popupmsg={`Order with ID No. #SO ${order?.id}
                     is Created Scuccessfully.`}
              handleOkay={handleOkay}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditOrder
