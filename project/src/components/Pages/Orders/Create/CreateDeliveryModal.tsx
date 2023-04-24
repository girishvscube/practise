import * as React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import { useState, useEffect } from 'react'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
import { Input } from '../../../common/input/Input'
import { SelectInput } from '../../../common/input/Select'
import CustomCheckbox from '../../../common/input/Checkbox'
import Validator from 'validatorjs'
import Plus from '../../../../assets/icons/filledIcons/Plus.svg'
import axiosInstance from '../../../../utils/axios'
import { CreateDelivery } from '../../../../features/customer/deliverySlice'
import { useDispatch } from 'react-redux'

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

  dropdownOptions: any
}

const CustomizedDialogs = ({
  open,
  handleClickOpen,
  handleClose,
  customer_id,
  dropdownOptions,
}: PopUpProps) => {
  const [state, setState] = useState([])

  const initialValues = {
    address_type: '',
    address_1: '',
    address_2: '',
    pincode: '',
    city: '',
    state: '',
    phone: '',
    location: '',
    fuel_price: '',
    is_fuel_price_checked: false,
    landmark: '',
    customer_poc_id: '',
  }

  const [params, setParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)

  const dispatch = useDispatch()
  useEffect(() => {
    fetchStates()
  }, [])

  const handleChange = (e: any) => {
    if (e.target.name.includes('is')) {
      setParams({ ...params, [e.target.name]: e.target.checked })
      setErrors({ ...errors, [e.target.name]: '' })
    } else {
      setParams({ ...params, [e.target.name]: e.target.value.toString() })
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const fetchStates = async () => {
    const data: any = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_URL}/admin/states`)
    setState(data.data.data)
  }

  const handleSubmit = async () => {
    const postdata = {
      ...params,
      customer_id,
    }

    // console.log(postdata, 'del post');
    const validation = new Validator(postdata, {
      phone: 'required',
      address_type: 'required',
      address_1: 'required',
      pincode: 'required',
      city: 'required',
      state: 'required',
      customer_poc_id: 'required',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setErrors(fieldErrors)
      return false
    }

    dispatch(CreateDelivery(postdata))

    return true
  }

  return (
    <div>
      <div className='justify-start flex '>
        <CustomButton
          onClick={handleClickOpen}
          width='w-fit'
          variant='outlined'
          size='large'
          icon={<img src={Plus} alt='' />}
          borderRadius='0.5rem'
        >
          Add New Delivery Location
        </CustomButton>
      </div>

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
            sx: { m: 1, backgroundColor: '#404050', alignItems: 'center', borderColor: '#404050' },
          }}
        >
          <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
            <div className='flex justify-start h-5'>
              <p className='font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white'>
                {/* Add Delivery Location */}
                Add Delivery Location
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <div className='w-[325px]  lg:w-[496px] mt-10 bg-[#151929] p-2 lg:p-6 rounded-lg flex flex-col gap-6'>
                <SelectInput
                  width='100%'
                  required
                  options={[
                    { name: 'Home' },
                    { name: 'Work' },
                    { name: 'Company' },
                    { name: 'Other' },
                  ]}
                  // options={addressTypeList}
                  error={!!errors.address_type}
                  value={params.address_type}
                  handleChange={handleChange}
                  helperText={errors.address_type}
                  label='Address Type e.g(Home,Office)'
                  name='address_type'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors.address_1}
                  value={params.address_1}
                  handleChange={handleChange}
                  helperText={errors.address_1}
                  label='Address Line 1'
                  name='address_1'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors.address_2}
                  value={params.address_2}
                  handleChange={handleChange}
                  helperText={errors.address_2}
                  label='Address Line 2'
                  name='address_2'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors.pincode}
                  value={params.pincode}
                  handleChange={handleChange}
                  helperText={errors.pincode}
                  label='Pin'
                  name='pincode'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors.phone}
                  value={params.phone}
                  handleChange={handleChange}
                  helperText={errors.phone}
                  label='Location Contact Number'
                  name='phone'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors.location}
                  value={params.location}
                  handleChange={handleChange}
                  helperText={errors.location}
                  label='Add your location Link here'
                  name='location'
                />

                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors.city}
                  value={params.city}
                  handleChange={handleChange}
                  helperText={errors.city}
                  label='City'
                  name='city'
                />
                <SelectInput
                  // width="100%"
                  options={state}
                  handleChange={handleChange}
                  value={params.state}
                  error={!!errors.state}
                  helperText={errors.state}
                  label='Select State'
                  name='state'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors.landmark}
                  value={params.landmark}
                  handleChange={handleChange}
                  helperText={errors.landmark}
                  label='Land Mark'
                  name='landmark'
                />
                <SelectInput
                  // width="100%"
                  options={dropdownOptions}
                  handleChange={handleChange}
                  value={params.customer_poc_id}
                  error={!!errors.customer_poc_id}
                  helperText={errors.customer_poc_id}
                  label='Select Point of Contact'
                  name='customer_poc_id'
                />
                <CustomCheckbox
                  handleCheck={handleChange}
                  ischecked={params.is_fuel_price_checked}
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
                    //   error={errors.pincode}
                    value={params.fuel_price}
                    handleChange={handleChange}
                    //   helperText={errors.pincode}
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
