import { useEffect, useState } from 'react'
import CustomButton from '../../../common/Button'
import { Input } from '../../../common/input/Input'
import { SelectInput } from './SelectInput'
import { SelectInputId } from './SelectInputId'
import Validator from 'validatorjs'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  leadCreation,
  leadUpdation,
  setApiSuccess,
  updateApi,
} from '../../../../features/leads/leadSlice'
import Popup from '../../../common/Popup'
import {
  getStateList,
  getindustryList,
  getSaleExecutiveList,
} from '../../../../features/dropdowns/dropdownSlice'
import axiosInstance from '../../../../utils/axios'
import { decryptData } from '../../../../utils/encryption'
import { getLoggedInUser } from '../../../../utils/auth'
import { showToastMessage } from '../../../../utils/helpers'

interface UserProps {
  type: string
  title: string
}

const initialValues = {
  company_name: '',
  company_phone: '',
  email: '',
  contact_person_name: '',
  contact_person_phone: '',
  assigned_to: '',
  industry_type: '',
  fuel_usage_per_month: '',
  source: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  created_by: 1,
}

const Form = ({ type, title }: UserProps) => {
  const [params, setParams] = useState(initialValues)
  const [formErrors, setFormErrors] = useState(initialValues)
  const [logInUser, setLoginUser] = useState('' as any)
  const [leadSource, setLeadSource] = useState([])
  const { states, industry, salesExecutives } = useSelector((state: any) => state.dropdown)
  const { apiSuccess, updateApiSuccess, isLoading } = useSelector((state: any) => state.lead)
  const navigate = useNavigate()
  const [open, setOpen] = useState({
    success: false,
    warning: false,
    update: false,
  })
  const { id } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getStateList())
    dispatch(getindustryList())
    dispatch(getSaleExecutiveList('leads'))
    let user = getLoggedInUser()
    if (user) {
      setLoginUser(user)
      if (user && user.role === 'sales_executive') {
        setParams({ ...params, assigned_to: user.id })
      }
    }
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    if (
      name === 'pincode' ||
      name === 'company_phone' ||
      name === 'contact_person_phone' ||
      name === 'fuel_usage_per_month'
    ) {
      const re = /^[0-9\b]+$/
      if (value && !re.test(value)) {
        return
      }
    }

    setParams({ ...params, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  useEffect(() => {
    if (type === 'update') {
      fetchLead()
    }
  }, [])

  useEffect(() => {
    if (apiSuccess === true) {
      setOpen({ ...open, success: true })
    }
    if (updateApiSuccess === true) {
      setOpen({ ...open, update: true })
    }
  }, [apiSuccess, updateApiSuccess])

  const fetchLead = async () => {
    const data: any = await axiosInstance.get(
      `${process.env.REACT_APP_BACKEND_URL}/admin/leads/${decryptData(id)}`,
    )
    setParams(data.data.data)
  }

  const handleSubmit = async () => {
    const validation = new Validator(params, {
      email: 'max:225|email',
      address: 'max:200|string',
      pincode: 'min:6|max:6',
      city: 'string|max:20',
      state: 'string|max:100',
      company_name: 'required|string|min:1|max:20',
      company_phone: 'required|min:10|max:10',
      contact_person_name: 'required|string|max:20',
      contact_person_phone: 'required|min:10|max:10',
      industry_type: 'required',
      fuel_usage_per_month: 'min:1',
      source: 'required',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      const err = Object.keys(fieldErrors)
      if (err.length) {
        const input: any = document.querySelector(`input[name=${err[0]}]`)
        if (input) {
          input.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'start',
          })
        }
      }

      setFormErrors(fieldErrors)
      showToastMessage('Please Check all the fields', 'error')
      return false
    }
    /* eslint-disable */
    id ? dispatch(leadUpdation(params, decryptData(id))) : dispatch(leadCreation(params))
    /* eslint-enable */
    return true
  }

  const handleClickOpen = (key: any, value: any) => {
    setOpen({ ...open, [key]: value })
  }

  const handleOkay = () => {
    navigate('/sales/leads')
    dispatch(setApiSuccess())
    dispatch(updateApi())
  }
  const handleCancel = () => {
    setOpen({ ...open, warning: true })
  }

  const handleNo = () => {
    setOpen({ ...open, warning: false })
  }

  const fetchSource = () => {
    axiosInstance.get('/admin/settings/leads/source').then((res) => {
      setLeadSource(res?.data.data)
    })
  }

  useEffect(() => {
    fetchSource()
  }, [])
  return (
    <div>
      <p className='text-xl font-extrabold text-white font-nunitoRegular'>{title}</p>
      <div className='w-full mt-[29px] p-[6px] lg:p-[20px] bg-lightbg rounded-lg border border-border'>
        <div className='h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mb-[24px]'>
          <p className='text-[18px] font-bold font-nunitoRegular'>Lead Info</p>
        </div>
        <form>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
            <div className='flex flex-col gap-[24px]'>
              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!formErrors.company_name}
                value={params.company_name}
                handleChange={handleChange}
                helperText={formErrors.company_name}
                label='Company Name'
                name='company_name'
              />

              {logInUser && logInUser.role != 'sales_executive' ? (
                <SelectInputId
                  options={salesExecutives}
                  handleChange={handleChange}
                  value={params.assigned_to}
                  error={!!formErrors.assigned_to}
                  helperText={formErrors.assigned_to}
                  label='Assign Sales Executives'
                  name='assigned_to'
                />
              ) : (
                ''
              )}

              <SelectInput
                options={industry}
                handleChange={handleChange}
                value={params.industry_type}
                error={!!formErrors.industry_type}
                helperText={formErrors.industry_type}
                label='Industry Type'
                name='industry_type'
              />

              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!formErrors.fuel_usage_per_month}
                value={params.fuel_usage_per_month}
                handleChange={handleChange}
                helperText={formErrors.fuel_usage_per_month}
                label='Estimated Fuel Consumption Per Month (in Litres)'
                name='fuel_usage_per_month'
              />

              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!formErrors.address}
                value={params.address}
                handleChange={handleChange}
                helperText={formErrors.address}
                label='Address'
                name='address'
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
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
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
                <SelectInput
                  options={states}
                  handleChange={handleChange}
                  value={params.state}
                  error={!!formErrors.state}
                  helperText={formErrors.state}
                  label='Select State'
                  name='state'
                />
              </div>
            </div>
            <div className='flex flex-col gap-[24px]'>
              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!formErrors.company_phone}
                value={params.company_phone}
                handleChange={handleChange}
                helperText={formErrors.company_phone}
                label='Phone Number'
                name='company_phone'
              />

              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!formErrors.contact_person_name}
                value={params.contact_person_name}
                handleChange={handleChange}
                helperText={formErrors.contact_person_name}
                label='Contact Person Name'
                name='contact_person_name'
              />

              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!formErrors.contact_person_phone}
                value={params.contact_person_phone}
                handleChange={handleChange}
                helperText={formErrors.contact_person_phone}
                label='Contact Person Phone'
                name='contact_person_phone'
              />
              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!formErrors.email}
                value={params.email}
                handleChange={handleChange}
                helperText={formErrors.email}
                label='Email Address'
                name='email'
              />
              <SelectInput
                options={leadSource}
                handleChange={handleChange}
                value={params.source}
                error={!!formErrors.source}
                helperText={formErrors.source}
                label='Lead Source'
                name='source'
              />
            </div>
          </div>

          <div className='flex items-center justify-center lg:justify-end mt-20 lg:mt-10'>
            <div className='flex gap-8 pb-3 lg:pb-0'>
              <div className=' w-[150px] lg:w-[106px]'>
                <CustomButton
                  onClick={handleCancel}
                  // width="w-[106px]"
                  width='w-full'
                  variant='outlined'
                  size='large'
                  borderRadius='8px'
                >
                  Cancel
                </CustomButton>
              </div>
              <div className=' w-[150px] lg:w-[307px]'>
                <CustomButton
                  onClick={handleSubmit}
                  width='w-full'
                  variant='contained'
                  size='large'
                  borderRadius='8px'
                  disabled={isLoading}
                >
                  {id ? 'Update Details' : 'Submit Details'}
                </CustomButton>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Popup
        open={open.success}
        handleClickOpen={handleClickOpen}
        popup='success'
        subtitle=''
        popupmsg='Lead Created Successfully !'
        handleOkay={handleOkay}
      />
      <Popup
        open={open.warning}
        Confirmation={handleOkay}
        handleClickOpen={handleClickOpen}
        handleNo={handleNo}
        popup='warning'
        subtitle='Changes are not Saved!'
        popupmsg='Do you want to proceed without changes? !'
        handleOkay={handleOkay}
      />
      <Popup
        open={open.update}
        handleClickOpen={handleClickOpen}
        popup='success'
        subtitle=''
        popupmsg='Updated Successfully!'
        handleOkay={handleOkay}
      />
    </div>
  )
}

export default Form
