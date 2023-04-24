import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import React, { useEffect, useState } from 'react'
import { Input } from '../../../common/input/Input'
import { SelectInput } from '../../../common/input/Select'
import FileUpload from '../../../common/FileUpload'
import CustomButton from '../../../common/Button'
import Popup from '../../../common/Popup'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Validator from 'validatorjs'
import { useSelector, useDispatch } from 'react-redux'
import { getSaleExecutiveList } from '../../../../features/dropdowns/dropdownSlice'

import {
  ticketCreation,
  setApiSuccess,
  updateTicketApi,
  ticketUpdate,
} from '../../../../features/support/supportSlice'
import axiosInstance from '../../../../utils/axios'
import { decryptData } from '../../../../utils/encryption'
import TextArea from '../../../../components/common/input/TextArea'
import { showToastMessage } from '../../../../utils/helpers'

const CreateTicket = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [refImage, setRefImage] = useState('')
  const [open, setOpen] = useState({
    warning: false,
    success: false,
    update: false,
  })
  const { orderId, id }: any = useParams()
  const [searchParams] = useSearchParams()
  const customerName: any = searchParams.get('customer_name')
  console.log('customerName:', customerName)
  const initialValues = {
    customer_name: '',
    order_id: orderId || '',
    issue_type: '',
    phone: '',
    more_info: '',
    sales_id: '',
    priority: '',
    image: '',
    image_file: '',
  }

  const [params, setParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)
  const [priorities, setPriorities] = useState([] as any)
  const { salesExecutives } = useSelector((state: any) => state.dropdown)
  const { apiSuccess, updateTicketStatus, isLoading, button } = useSelector(
    (state: any) => state.support,
  )


  const priority = [
    {
      id: 'High',
      name: 'High',
    },
    {
      id: 'Low',
      name: 'Low',
    },
    {
      id: 'Medium',
      name: 'Medium',
    },
  ]

  const handleChange = (event: any) => {
    if (event.target.name === 'phone') {
      const re = /^[0-9\b]+$/
      if (event.target.value && !re.test(event.target.value)) {
        return
      }
    }
    setErrors({ ...errors, [event.target.name]: '' })
    setParams({ ...params, [event.target.name]: event.target.value })
  }

  const handleImage = (data) => {
    setParams({ ...params, image: data?.url })
    setRefImage(data.file)
  }

  const handleSubmit = async () => {
    console.log(params)
    const validation = new Validator(params, {
      customer_name: 'required|max:50',
      order_id: 'required',
      issue_type: 'required',
      phone: 'required|min:10|max:10',
      more_info: 'required|max:500',
      sales_id: 'required',
      priority: 'required',
    })
    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setErrors(fieldErrors)
      showToastMessage('Please Check all fields', 'error')
      return false
    }

    const formData = new FormData()

    const payloadKeys = [
      'customer_name',
      'order_id',
      'issue_type',
      'phone',
      'more_info',
      'sales_id',
      'priority',
    ]
    for (const key of payloadKeys) {
      formData.append(key, params[key])
    }

    if (refImage) {
      formData.append('image_file', refImage)
    }

    if (id) {
      let is_image = formData.get('image_file')
      if (!is_image) {
        formData.append('image', params.image)
      }
    }


    id ? dispatch(ticketUpdate(formData, decryptData(id))) : dispatch(ticketCreation(formData))

    return true
  }

  const fetchTicketPriorities = () => {
    axiosInstance.get('/admin/settings/support-tickets/issues')
      .then((res) => {
        setPriorities(res?.data?.data)
      })
  }

  // popup open to show warning
  const onCancel = (name, item) => {
    setOpen({ ...open, [name]: true })
  }

  // close popup
  const handleOpen = (key: any, value: any) => {
    setOpen({ ...open, [key]: value })
  }

  // popup navigate on okay
  const handleOkay = () => {
    navigate('/support/tickets')
    dispatch(setApiSuccess())
    dispatch(updateTicketApi())
  }

  useEffect(() => {
    dispatch(getSaleExecutiveList())
  }, [])

  useEffect(() => {
    if (apiSuccess === true) {
      setOpen({ ...open, success: true })
    }

    if (updateTicketStatus === true) {
      setOpen({ ...open, update: true })
      //
    }
  }, [apiSuccess, updateTicketStatus])

  useEffect(() => {
    if (id) {
      fetchTicketById()
    }
  }, [id])

  useEffect(() => {
    setParams({ ...params, customer_name: customerName })
  }, [customerName])

  useEffect(() => {
    fetchTicketPriorities();
  }, [])

  const fetchTicketById = () => {
    axiosInstance
      .get(`/admin/support-tickets/${decryptData(id)}`)
      .then((response) => {
        // setParams(response?.data?.data?.support_ticket);
        let list = response?.data?.data?.support_ticket
        setParams({
          ...params,
          customer_name: list?.customer_name,
          order_id: list?.order_id,
          issue_type: list?.issue_type,
          phone: list?.phone,
          more_info: list?.more_info,
          sales_id: list?.sales_id,
          priority: list?.priority,
          image: list?.image,
        })
      })
      .catch((err) => {
        showToastMessage(err?.data?.message, 'success')
      })
  }
  return (
    <div className=''>
      {id ? (
        <BreadCrumb
          links={[
            { path: 'Support', url: '/support' },
            { path: 'Edit Support Ticket', url: '' },
          ]}
        />
      ) : (
        <BreadCrumb
          links={[
            { path: 'Support', url: '/support' },
            { path: 'Create Support Ticket', url: '' },
          ]}
        />
      )}

      <p className='font-black mb-7'> Create Support Ticket</p>

      <div className='px-3 lg:px-4 py-6 rounded-lg border border-border bg-lightbg'>
        <div className='bg-darkbg p-2 rounded-lg'>
          <p>Support Ticket info</p>
        </div>

        <div className='grid lg:grid-cols-2 mt-6 gap-6 grid-cols-1'>
          <div className='flex flex-col gap-6'>
            <Input
              rows={1}
              width='w-full'
              value={params.order_id}
              label='Order ID'
              name='order_id'
            />
            <Input
              rows={1}
              width='w-full'
              error={!!errors?.customer_name}
              helperText={errors?.customer_name}
              handleChange={handleChange}
              value={params.customer_name}
              label='Customer Name'
              name='customer_name'
              readOnly={id}
            />

            <SelectInput
              // width="100%"
              options={priorities}
              error={!!errors?.issue_type}
              helperText={errors?.issue_type}
              handleChange={handleChange}
              value={params?.issue_type}
              label='Select the Issue'
              name='issue_type'
            />

            <Input
              rows={1}
              width='w-full'
              error={!!errors?.phone}
              helperText={errors?.phone}
              handleChange={handleChange}
              value={params.phone}
              label='Contact Phone Number'
              name='phone'
            />
            <TextArea
              placeholder='Add More Information'
              value={params.more_info}
              name='more_info'
              rows={5}
              error={!!errors?.more_info}
              helperText={errors?.more_info}
              handleChange={handleChange}
            />

            <SelectInput
              // width="100%"
              options={salesExecutives}
              error={!!errors?.sales_id}
              // helperText={errors?.sales_id}
              handleChange={handleChange}
              value={params?.sales_id}
              label='Assign Support Executive'
              name='sales_id'
            />
            {errors.sales_id ? (
              <p
                style={{ fontSize: '12px', marginTop: '-22px' }}
                className='MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1179uol-MuiFormHelperText-root'
              >
                The Assign Support Executive is required.
              </p>
            ) : null}

            <SelectInput
              // width="100%"
              options={priority}
              error={!!errors?.priority}
              helperText={errors?.priority}
              handleChange={handleChange}
              value={params?.priority}
              label='Select Priority Level'
              name='priority'
            />
          </div>
          <div className='lg:block hidden'>
            <p className='mb-2'>Reference Image</p>
            <FileUpload
              filename='image'
              styleType='lg'
              setImage={handleImage}
              acceptMimeTypes={['image/jpeg']}
              title='Drag and Drop PDF here'
              label='File Format: .jpeg/ .png'
              id='image'
              maxSize={5}
              imageUrl={params?.image}
            />
          </div>
          <div className='lg:hidden block'>
            <p className='mb-2'>Reference Image</p>
            <FileUpload
              filename='image'
              styleType='md'
              setImage={handleImage}
              acceptMimeTypes={['image/jpeg']}
              title='Drag and Drop PDF here'
              label='File Format: .jpeg/ .png'
              id='image'
              maxSize={5}
              imageUrl={params?.image}
            />
          </div>
        </div>
        <div className='flex gap-8 justify-end pt-6 lg:pt-0'>
          <div className=' w-[150px] lg:w-[106px]'>
            <CustomButton
              onClick={(e) => {
                e.preventDefault()
                onCancel('warning', true)
              }}
              width='w-full'
              variant='outlined'
              size='large'
              borderRadius='0.5rem'
              disabled={isLoading}
            >
              Cancel
            </CustomButton>
          </div>
          <div className='w-[150px] lg:w-[307px]'>
            <CustomButton
              onClick={handleSubmit}
              // width="w-[307px]"
              width='w-full'
              variant='contained'
              size='large'
              borderRadius='0.5rem'
              disabled={isLoading}
            >
              {id ? 'Update Ticket' : 'Create Ticket'}
            </CustomButton>
          </div>
        </div>
      </div>
      <Popup
        open={open.warning}
        Confirmation={handleOkay}
        handleClickOpen={handleOpen}
        popup='warning'
        subtitle='Changes are not Saved!'
        popupmsg='Do you want to proceed without changes?'
        handleOkay={handleOkay}
      />

      <Popup
        open={open.success}
        handleClickOpen={handleOpen}
        popup='success'
        subtitle=''
        popupmsg='Ticket  Created Successfully!'
        handleOkay={handleOkay}
      />

      <Popup
        open={open.update}
        handleClickOpen={handleOpen}
        popup='success'
        subtitle=''
        popupmsg='Ticket  Updated Successfully!'
        handleOkay={handleOkay}
      />
    </div>
  )
}

export default CreateTicket
