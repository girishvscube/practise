import CustomButton from '../../../common/Button'
import { toast } from 'react-toastify'
import EditIcon from '../../../../assets/images/EditIcon.svg'
import { useEffect, useState } from 'react'
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SelectInput } from '../../../common/input/Select'
import { TimeandDatePicker } from '../../../common/DateTimePicker'
import TextArea from '../../../common/input/TextArea'
import { fetchLead } from '../../../../features/leads/leadSlice'
import moment from 'moment'
import Status from '../../../common/Status'
import Logs from '../../../common/Logs'
import axiosInstance from '../../../../utils/axios'
import Validator from 'validatorjs'
import { decryptData } from '../../../../utils/encryption'

const status = [
  {
    id: 'CALL_BACK',
    name: 'CALL_BACK',
  },
  {
    id: 'NOT_INTERESTED',
    name: 'NOT_INTERESTED',
  },
  {
    id: 'DUPLICATE',
    name: 'DUPLICATE',
  },
  {
    id: 'INTERESTED',
    name: 'INTERESTED',
  },
  {
    id: 'CONVERTED',
    name: 'CONVERTED',
  },
]

const initialValues = {
  status: '',
  callback_time: null,
  notes: '',
  assigned_to: '',
}
const LeadView = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const { id } = useParams()

  const { leads, isLoading } = useSelector((state: any) => state.lead)

  useEffect(() => {
    dispatch(fetchLead(decryptData(id)))
  }, [])

  const [params, setParams] = useState(initialValues as any)
  const [formErrors, setFormErrors] = useState(initialValues)

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setFormErrors(initialValues)
    if (name === 'status' && value != 'CALL_BACK') {
      setParams({ ...params, callback_time: null })
    }
    setParams({ ...params, [name]: value })
  }
  const basicinfo = [
    {
      name: 'Company Name',
      value: leads?.data?.company_name,
    },
    {
      name: 'Company Phone',
      value: leads?.data?.company_phone ? `+91${leads?.data?.company_phone}` : '--',
    },
    {
      name: 'Lead ID',
      value: leads?.data?.id,
    },
    {
      name: 'Contact Person',
      value: leads?.data?.contact_person_name,
    },
    {
      name: 'Contact Phone#',
      value: leads?.data?.contact_person_phone ? `+91${leads?.data?.contact_person_phone}` : '--',
    },
    {
      name: 'Email ID',
      value: leads?.data?.email || '--',
    },
    {
      name: 'Industry Type',
      value: leads?.data?.industry_type || '--',
    },
    {
      name: 'Lead Source',
      value: leads?.data?.source,
    },
    {
      name: 'Estimated Consum/month',
      value: leads?.data?.fuel_usage_per_month || '--',
    },
    {
      name: 'Address',
      value: leads?.data?.address || '--',
    },
  ]
  const handleDate = (newValue) => {
    setFormErrors(initialValues)
    const newDate = moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss')
    setParams({ ...params, callback_time: newDate })
  }

  const handleClick = () => {
    navigate(`/sales/leads/edit/${id}`)
  }

  const handleConvert = () => {
    navigate(`/customers/create?lead_id=${id}`)
  }

  const handleStatus = async () => {
    const rule = {
      callback_time: params.status.toLowerCase().includes('call') ? 'required' : '',
      notes: 'required|max:500',
      status: 'required',
    }

    const validation = new Validator(params, rule)
    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setFormErrors(fieldErrors)
      return false
    }
    await axiosInstance
      .patch(`/admin/leads/update-status/${decryptData(id)}`, params)
      .then((response) => {
        setParams(initialValues)
        showToastMessage(response.data.data.message, 'success')
        dispatch(fetchLead(decryptData(id)))
      })
      .catch((error) => {
        console.log(error)
        showToastMessage(error.data.data.message, 'error')
      })
    return true
  }

  const showToastMessage = (message: string, type: string) => {
    if (type === 'error') {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  return (
    <div className=''>
      <BreadCrumb
        links={[
          { path: 'Leads', url: '/sales/leads' },
          { path: 'View Lead', url: '' },
        ]}
      />

      <p className='font-black mb-7'> View Lead</p>
      {!isLoading ? (
        <div className='flex flex-col  sm:flex-row gap-5'>
          <div className='flex flex-col w-full sm:w-[450px]'>
            <div className='flex flex-col gap-6'>
              <div className='bg-lightbg mobileView'>
                <p className='subheading'>Lead Info</p>
                <div className='bg-darkbg mobileView border border-none  flex flex-col gap-y-6  font-nunitoRegular'>
                  {basicinfo.map((item, index) => (
                    <div className='flex justify-between'>
                      <p className=' text-xs text-textgray'>{item.name}</p>
                      <p className='text-sm text-white  text-right'>
                        {item.value}
                        {basicinfo.length - 1 === index ? (
                          <div>
                            {leads?.data?.city}
                            <br />
                            {leads?.data?.state}
                            <br />
                            {leads?.data?.pincode}
                          </div>
                        ) : null}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='mt-4'>
                  <CustomButton
                    onClick={handleClick}
                    borderRadius='1rem'
                    width='m-auto w-fit '
                    variant='outlined'
                    size='medium'
                    icon={<img src={EditIcon} alt='' />}
                  >
                    Edit Profile
                  </CustomButton>
                </div>
              </div>

              <div className='bg-lightbg mobileView'>
                <p className='subheading'>Lead Status</p>
                <div className='bg-darkbg  flex flex-col gap-y-6 rounded-lg p-4 font-nunitoRegular'>
                  <div className='flex justify-between items-center pb-3 border-b border-border'>
                    <p className='text-textgray text-xs'>Current Lead status:</p>
                    {leads?.data?.status ? <Status>{leads?.data?.status}</Status> : ''}
                  </div>

                  <div>
                    <SelectInput
                      options={status}
                      handleChange={handleChange}
                      value={params?.status}
                      error={!!formErrors.status}
                      helperText={formErrors.status}
                      label='Select Status'
                      name='status'
                    />
                  </div>
                  <div>
                    {params?.status === 'CALL_BACK' ? (
                      <>
                        <TimeandDatePicker
                          label='Call back time'
                          handleChange={handleDate}
                          value={params.callback_time}
                          error={formErrors.callback_time}
                        />
                        {formErrors.callback_time ? (
                          <p className='text-red-600'>*required</p>
                        ) : null}
                      </>
                    ) : (
                      ''
                    )}
                  </div>

                  <TextArea
                    rows={5}
                    handleChange={handleChange}
                    name='notes'
                    value={params?.notes}
                    error={!!formErrors.notes}
                    helperText={formErrors.notes}
                    placeholder='Additional Info'
                  />

                  <div className='flex gap-1'>
                    <CustomButton
                      onClick={handleConvert}
                      borderRadius='1rem'
                      width='m-auto w-fit '
                      variant='contained'
                      size='medium'
                      icon={
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M10.8895 1.8335H5.11016C3.09616 1.8335 1.8335 3.2595 1.8335 5.2775V10.7228C1.8335 12.7408 3.09016 14.1668 5.11016 14.1668H10.8888C12.9095 14.1668 14.1668 12.7408 14.1668 10.7228V5.2775C14.1668 3.2595 12.9095 1.8335 10.8895 1.8335Z'
                            stroke='#151929'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M5.62646 7.99997L7.20913 9.58197L10.3731 6.41797'
                            stroke='#151929'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      }
                    >
                      Convert
                    </CustomButton>
                    <CustomButton
                      onClick={handleStatus}
                      borderRadius='1rem'
                      width='m-auto w-fit '
                      variant='outlined'
                      size='medium'
                      icon={
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M4.92632 5.98919H4.30432C2.94766 5.98919 1.84766 7.08919 1.84766 8.44586V11.6959C1.84766 13.0519 2.94766 14.1519 4.30432 14.1519H11.7243C13.081 14.1519 14.181 13.0519 14.181 11.6959V8.43919C14.181 7.08652 13.0843 5.98919 11.7317 5.98919H11.103'
                            stroke='#FFCD2C'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M8.01449 1.45997V9.4873'
                            stroke='#FFCD2C'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M6.07031 3.4126L8.01365 1.4606L9.95765 3.4126'
                            stroke='#FFCD2C'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      }
                    >
                      Update
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col w-full gap-5 '>
            <div className='bg-lightbg border-border border rounded-lg  '>
              <p className='font-bold  text-yellow  mx-6 py-3 border-b-2 border-yellow text-lg  w-fit'>
                Overview
              </p>
            </div>

            <div className='bg-lightbg mobileView custom-sec-box'>
              <p className='subheading'>Other Info</p>

              <div className='childstyles flex flex-col lg:flex-row gap-4 lg:justify-between '>
                <div className='flex justify-between lg:flex-col lg:gap-2'>
                  <p className='text-xs text-textgray'>Lead Created Date & Time</p>
                  <p className='text-sm text-white break-all'>
                    {moment(leads?.data?.created_at).format('LT')}{' '}
                    <br className='block lg:hidden' />
                    {moment(leads?.data?.created_at).format('L')}
                  </p>
                </div>
                <div className='flex justify-between lg:flex-col lg:gap-2'>
                  <p className='text-xs text-textgray'>Lead Created By</p>
                  <p className='text-sm text-white'>{leads?.data?.userObj?.created_by}</p>
                </div>
                <div className='flex justify-between lg:flex-col lg:gap-2'>
                  <p className='text-xs text-textgray'>Lead Assigned</p>
                  <p className='text-sm text-white'>{leads?.data?.user?.name}</p>
                </div>
              </div>
            </div>

            <Logs logs={leads?.data?.logs} />
          </div>
        </div>
      ) : (
        <div className='w-full text-center pt-5'>Loading....</div>
      )}
    </div>
  )
}

export default LeadView
