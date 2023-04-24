import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import { useEffect } from 'react'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
import { Input } from '../../../common/input/Input'
import { SelectInput } from '../../../common/input/Select'
import CustomCheckbox from '../../../common/input/Checkbox'
import Validator from 'validatorjs'
import Plus from '../../../../assets/icons/filledIcons/Plus.svg'
import { useDispatch, useSelector } from 'react-redux'

import { getStateList } from '../../../../features/dropdowns/dropdownSlice'
import { showToastMessage } from './../../Suppliers/SupplierCreation/Toast'
import axiosInstance from './../../../../utils/axios'
import {
  getDeliveryList,
  CreateDelivery,
  UpdateDelivery,
  resetDelivery,
  getDelivery,
} from '../../../../features/customer/deliverySlice'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },

  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    backgroundColor: '#404050',
  },
  '&::-webkit-scrollbar': { display: 'none' },
  dialogCustomizedWidth: {
    'max-width': '80%',
  },
}))

export interface DialogTitleProps {
  id: string
  children: any
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[600],
          }}
        >
          {/* <CloseIcon /> */}

          <img src={CloseSquareLight} alt='' />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

interface PopUpProps {
  handleClickOpen: any
  handleClose: any
  open: any
  customer_id: any
  params: any
  setFormParams: any
  formErrors: any
  setFormErrors: any
  type: any
  pocId: any
  dropdownOptions: any
}

const CustomizedDialogs = ({
  open,
  handleClickOpen,
  handleClose,
  customer_id,
  params,
  setFormErrors,
  formErrors,
  setFormParams,
  type,
  dropdownOptions,
  pocId,
}: PopUpProps) => {
  const dispatch = useDispatch()
  const { states } = useSelector((state: any) => state.dropdown)
  const { iseditSuccess } = useSelector((state: any) => state.delivery)

  useEffect(() => {
    dispatch(getStateList())
  }, [])

  useEffect(() => {
    if (iseditSuccess === true) {
      handleClose()
      dispatch(getDeliveryList(customer_id))
      dispatch(resetDelivery())
    }
  }, [iseditSuccess])

  useEffect(() => {
    pocId && fetchDeliveryById()
  }, [pocId])

  const fetchDeliveryById = () => {
    axiosInstance
      .get(`/admin/customers/delivery-address/${pocId}`)
      .then((response: any) => {
        const del = response?.data?.data
        setFormParams({
          ...params,
          location_name: del?.location_name,
          address_1: del?.address_1,
          address_2: del?.address_2,
          pincode: del?.pincode,
          address_type: del?.address_type,
          city: del?.city,
          state: del?.state,
          phone: del?.phone,
          landmark: del?.landmark,
          location: del?.location,
          customer_poc_id: del?.customer_poc_id,
          fuel_price: del?.fuel_price,
          is_fuel_price_checked: Boolean(del?.is_fuel_price_checked),
        })
      })
      .catch((error: any) => {
        showToastMessage(error.response.data.errors.message, 'error')
      })
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'pincode' || name === 'phone') {
      const re = /^[0-9\b]+$/
      if (value && !re.test(value)) {
        return
      }
    }

    if (e.target.name.includes('is')) {
      setFormParams({ ...params, [e.target.name]: e.target.checked })
      setFormErrors({ ...formErrors, [e.target.name]: '' })
    } else {
      setFormParams({ ...params, [e.target.name]: e.target.value.toString() })
      setFormErrors({ ...formErrors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async () => {
    let postdata = {
      ...params,
      customer_id,
    }

    postdata = { ...postdata, pincode: params.pincode.toString() }

    const validation = new Validator(postdata, {
      phone: 'required|numeric|digits:10',
      address_type: 'required',
      address_1: 'required',
      pincode: 'required|string|min:6|max:6',
      city: 'required|alpha',
      state: 'required',
      customer_poc_id: 'required',
      location: 'url',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setFormErrors(fieldErrors)

      const err = Object.keys(formErrors)
      if (err.length) {
        const input: any = document.querySelector(`input[name=${err[0]}]`)

        input.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'start',
        })
      }
      showToastMessage('Please Select All Required Fields!', 'error')
      return false
    }

    if (type === 'update') {
      dispatch(UpdateDelivery(postdata, pocId))
    } else {
      dispatch(CreateDelivery(postdata))
    }
    return true
  }

  return (
    <div>
      {type === 'update' ? null : (
        <CustomButton
          onClick={handleClickOpen}
          width='w-full'
          variant='outlined'
          size='large'
          icon={<img src={Plus} alt='' />}
          borderRadius='20px'
        >
          Add Delivery Location
        </CustomButton>
      )}

      <div>
        <BootstrapDialog
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(5px)',
            },
          }}
          // onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}
          PaperProps={{
            sx: {
              m: 1,
              backgroundColor: '#404050',
              alignItems: 'center',
              borderColor: '#404050',
            },
          }}
        >
          <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
            <div className='flex justify-start h-5'>
              <p className='font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white'>
                {/* Add Delivery Location */}
                {type === 'update' ? 'Update Delivery Location' : 'Add Delivery Location'}
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <div className='w-[325px] lg:w-[496px] subdiv flex flex-col gap-6'>
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.location_name}
                  value={params.location_name}
                  handleChange={handleChange}
                  helperText={formErrors.location_name}
                  label='Location Name'
                  name='location_name'
                />

                <SelectInput
                  // width="100%"
                  required
                  options={[
                    { name: 'Home' },
                    { name: 'Work' },
                    { name: 'Company' },
                    { name: 'Other' },
                  ]}
                  // options={addressTypeList}
                  error={!!formErrors.address_type}
                  value={params.address_type}
                  handleChange={handleChange}
                  helperText={formErrors.address_type}
                  label='Address Type e.g(Home,Office)'
                  name='address_type'
                />

                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.address_1}
                  value={params.address_1}
                  handleChange={handleChange}
                  helperText={formErrors.address_1}
                  label='Address Line 1'
                  name='address_1'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.address_2}
                  value={params.address_2}
                  handleChange={handleChange}
                  helperText={formErrors.address_2}
                  label='Address Line 2'
                  name='address_2'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.pincode}
                  value={params.pincode}
                  handleChange={handleChange}
                  helperText={formErrors.pincode}
                  label='Pincode'
                  name='pincode'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.phone}
                  value={params.phone}
                  handleChange={handleChange}
                  helperText={formErrors.phone}
                  label='Location Contact Number'
                  name='phone'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.location}
                  value={params.location}
                  handleChange={handleChange}
                  helperText={formErrors.location}
                  label='Add your location Link here'
                  name='location'
                />

                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.city}
                  value={params.city}
                  handleChange={handleChange}
                  helperText={formErrors.city}
                  label='City'
                  name='city'
                />
                <SelectInput
                  width='100%'
                  options={states}
                  handleChange={handleChange}
                  value={params.state}
                  error={!!formErrors.state}
                  helperText={formErrors.state}
                  label='Select State'
                  name='state'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.landmark}
                  value={params.landmark}
                  handleChange={handleChange}
                  helperText={formErrors.landmark}
                  label='Land Mark'
                  name='landmark'
                />

                <SelectInput
                  width='100%'
                  options={dropdownOptions}
                  handleChange={handleChange}
                  value={params.customer_poc_id}
                  error={!!formErrors.customer_poc_id}
                  helperText={formErrors.customer_poc_id}
                  label='Select Point of Contact'
                  name='customer_poc_id'
                />

                <CustomCheckbox
                  handleCheck={handleChange}
                  ischecked={params?.is_fuel_price_checked}
                  color='text-yellow'
                  name='is_fuel_price_checked'
                  Label='Increase Price from Standard Fuel Price (Per Liter)'
                />

                {params.is_fuel_price_checked === true ? (
                  <Input
                    rows={1}
                    width='w-full'
                    // disabled={check !== true}
                    readOnly={false}
                    //   error={!!formErrors.pincode}
                    value={params.fuel_price}
                    handleChange={handleChange}
                    //   helperText={formErrors.pincode}
                    label='Enter The Value'
                    name='fuel_price'
                  />
                ) : null}
              </div>
            </div>
          </DialogContent>

          <div className='flex justify-center pt-2 pb-10 h-[72px]'>
            <CustomButton onClick={handleSubmit} width='w-[150px]' variant='contained' size='large'>
              Submit Details
            </CustomButton>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  )
}

export default CustomizedDialogs
