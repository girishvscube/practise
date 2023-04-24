import { useState, useEffect } from 'react'
import Validator from 'validatorjs'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Delete from '../../../../assets/images/Iconly.svg'

import CustomButton from '../../../common/Button'
import FileUpload from '../../../common/FileUpload'
import { Input } from '../../../common/input/Input'
import { SelectInput } from '../../../common/input/Select'
import PopUp from './PopUp'
import Popup from '../../../common/Popup'
import { setSuccessApiState, setUpdateApiState } from '../../../../features/userInfo/userSlice'
import { getStateList } from '../../../../features/dropdowns/dropdownSlice'
import axiosInstance from '../../../../utils/axios'
import { decryptData } from '../../../../utils/encryption'
import { showToastMessage, uuid } from '../../../../utils/helpers'

interface UserProps {
  type: string
  title: string
}

const initialValues = {
  name: '',
  phone: '',
  image: '',
  email: '',
  role_id: '',
  address: '',
  city: '',
  pincode: '',
  state: '',
  dl_image: '',
  images: [
    {
      label: 'Adhar Card',
      url: '',
      preview: '',
      file: '',
    },
  ],
  bank_details: {
    account_no: '',
    bank_cheque: '',
    ifsc_code: '',
    bank_name: '',
    account_name: '',
    check_image: '',
    file: '',
  },
}
const imageInterfaceValue = {
  label: '',
  url: '',
  preview: '',
  file: '',
}

const Form = ({ type, title }: UserProps) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [roles, setRoles] = useState([] as any)
  const { states } = useSelector((state: any) => state.dropdown)
  const [bankDetails, setBankDetails] = useState(initialValues.bank_details)

  const [imageFileEvent, setImageFileEvent] = useState('')
  const [dlImageFileEvent, setdlImageFileEvent] = useState('')

  const [showBankForm, setShowBankForm] = useState(false)
  const [showDLUpload, setShowDLUpload] = useState(false)

  const [params, setParams] = useState(initialValues)
  const [formErrors, setFormErrors] = useState(initialValues)
  const [additonalDoc, setAdditonalDoc] = useState(imageInterfaceValue)

  const [open, setopen] = useState({
    document: false,
    warning: false,
    update: false,
    success: false,
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (id) {
      fetchUser()
    }
  }, [id])

  //fetch roles
  useEffect(() => {
    fetchRoles()
    dispatch(getStateList())
  }, [])

  const fetchRoles = () => {
    axiosInstance
      .get('/admin/roles/dropdown')
      .then((response) => {
        setRoles(response?.data?.data)
      })
      .catch((err) => {})
  }
  // auto fill data for edit
  const fetchUser = () => {
    axiosInstance
      .get(`${process.env.REACT_APP_BACKEND_URL}/admin/users/${decryptData(id)}`)
      .then((response) => {
        const user = response.data.data
        setParams(user)
        setShowBankForm(!!(user && user.role.name.toLowerCase().includes('sales')))
        setShowDLUpload(!!(user && user.role.name.toLowerCase().includes('driver')))
        if (user.bank_details) {
          setBankDetails(user.bank_details)
        }
        if (user.images && user.images.length) {
          user.images = user.images
            .filter((x) => x)
            .map((x) => ({
              label: x.label,
              url: x.url,
              preview: '',
              file: '',
            }))
          setParams(user)
        }
      })
      .catch((error) => {
        showToastMessage(error?.response?.data.errors.message, 'error')
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

    if (name === 'role_id') {
      const role = roles.find((x) => x.id === value)
      setShowBankForm(!!(role && role.name.toLowerCase().includes('sales')))
      setShowDLUpload(!!(role && role.name.toLowerCase().includes('driver')))
    }

    setParams({ ...params, [name]: value.toString() })
    setFormErrors({ ...formErrors, [name]: '' })
  }

  const handleSubmit = async () => {
    let postdata: any = {}
    if (params.role_id) {
      const role = roles.find((x) => x.id === Number(params.role_id))
      if (role && role.name.toLowerCase().includes('sales')) {
        postdata = {
          ...params,
          bank_details: bankDetails,
        }
      } else {
        postdata = params
      }
    }

    const rules = {
      name: ['required', 'regex:^[A-Za-zs]$', 'max:150'],
      email: 'required|max:150|email',
      phone: 'required|min:10|max:10',
      role_id: 'required',
      address: 'required|max:500|string',
      city: 'required|string|max:50',
      state: 'required|string|max:50',
      pincode: 'required|string|min:6|max:6',
    }

    if (postdata.role_id) {
      const role = roles.find((x) => x.id === Number(postdata.role_id))
      if (role && role.name.toLowerCase().includes('sales')) {
        rules['bank_details'] = 'required'
        rules['bank_details.bank_name'] = 'required|string|max:100'
        rules['bank_details.account_no'] = 'required|max:17'
        rules['bank_details.account_name'] = 'required|string|max:100'
        rules['bank_details.ifsc_code'] = 'required|string|max:11'
      }
    }

    const validation = new Validator(postdata, rules, {
      'required.bank_details.account_no': 'Account number field required',
      'required.bank_details.account_name': 'Account name field required',
      'required.bank_details.ifsc_code': 'Ifsc code field required',
      'required.bank_details.bank_name': 'Bank name field required',
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
      return false
    }

    const formData = new FormData()
    const payloadKeys = [
      'name',
      'phone',
      'email',
      'role_id',
      'address',
      'city',
      'pincode',
      'state',
      'bank_details',
    ]
    for (const key of payloadKeys) {
      if (key === 'bank_details' && Object.values(postdata[key]).some((x) => x)) {
        const obj = {}
        for (const sub_key in postdata[key]) {
          if (!['bank_cheque', 'file'].includes(sub_key)) {
            obj[sub_key] = postdata[key][sub_key]
          }
        }

        formData.append('bank_details', JSON.stringify(obj))
        if (postdata.bank_details.check_image && postdata.bank_details.file) {
          formData.append('user_check_image', postdata[key].file)
        }
        continue
      }

      if (key !== 'bank_details') formData.append(key, postdata[key])
    }

    if (imageFileEvent) {
      formData.append('user_image', imageFileEvent)
    }
    if (dlImageFileEvent) {
      formData.append('user_dl_image', dlImageFileEvent)
    }

    let is_invalid = postdata.images.some(x => x.label != 'Adhar Card' && !x.file)
    if (is_invalid) {
      showToastMessage('Please Select File of Additional doc', 'error')
      return
    }
    const files = postdata.images.filter((x) => x.file)
    if (files.length) {
      const labels = files.map((x) => x.label)
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i].file)
      }

      formData.append('labels', JSON.stringify(labels))
    }
    const old_files = postdata.images.map((x) => x.url && x.url.startsWith('https'))

    if (id && old_files.length) {
      formData.append('old_files', JSON.stringify(old_files))
    }

    if (id) {
      let is_image = formData.get('user_image')
      if (!is_image) {
        formData.append('image', postdata.image)
      }

      let is_dl_image = formData.get('dl_user_image')
      if (!is_dl_image) {
        formData.append('dl_image', postdata.dl_image)
      }
    }
    id ? updateUser(decryptData(id), formData) : createUser(formData)

    return true
  }

  const createUser = (payload) => {
    setLoading(true)
    axiosInstance
      .post('/admin/users', payload)
      .then(() => {
        setLoading(false)
        setopen({ ...open, success: true })
        setAdditonalDoc(imageInterfaceValue)
        setParams(initialValues)
        handleRemoveDocuments(0, 'remove')
        let images = params.images;
        for (let i = 0; i < images.length; i++) {
          images.pop();
        }

      })
      .catch((error) => {
        setLoading(false)
        showToastMessage(error?.response?.data?.errors?.message, 'error')
      })
  }

  const updateUser = (id, payload) => {
    setLoading(true)
    axiosInstance
      .put('/admin/users/' + id, payload)
      .then(() => {
        setLoading(false)
        setopen({ ...open, update: true })
        setAdditonalDoc(imageInterfaceValue)
        setParams(initialValues)
        handleRemoveDocuments(0, 'remove')
        let images = params.images;
        for (let i = 0; i < images.length; i++) {
          images.pop();
        }
      })
      .catch((error) => {
        setLoading(false)
        const message = error.payload.message
        showToastMessage(message, 'error')
      })
  }

  const deleteFile = (param_type) => {
    if (param_type === 'image') {
      setImageFileEvent('')
    } else {
      setdlImageFileEvent('')
    }
    setParams({ ...params, [param_type]: '' })
  }
  // adding documents label
  const handleLabel = (event: any) => {
    setAdditonalDoc({ ...additonalDoc, label: event.target.value })
    setFormErrors(initialValues)
  }

  // adding adhar card
  function setImage(data: any, index: number) {
    const images = params.images
    images[index] = {
      label: images[index].label,
      url: data.url,
      preview: data.preview,
      file: data.file,
    }
    setParams({ ...params, images })
  }

  function removeSelectedFile(index: number) {
    const images = params.images
    images[index] = { label: images[index].label, url: '', preview: '', file: '' }
    setParams({ ...params, images })
  }

  // handling other documents popup url
  function setHandleData(data: any) {
    let list: any = (formErrors['file'] = '')
    setFormErrors(list)
    setAdditonalDoc({ ...additonalDoc, url: data.url, file: data.file, preview: data.preview })
  }

  // submitting popup title and file url into array
  const handleAddDocument = (e: any) => {
    e.preventDefault()
    const rules = {
      label: 'required|string|max:20',
      file: 'required',
    }

    const validation = new Validator(additonalDoc, rules)
    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })
      setFormErrors(fieldErrors)
      return false
    }

    params.images.push({
      label: additonalDoc.label,
      url: additonalDoc.url,
      preview: additonalDoc.preview,
      file: additonalDoc.file,
    })
    setopen({ ...open, document: false })
    setAdditonalDoc(imageInterfaceValue)
  }

  // display image
  const handleImage = (data: any) => {
    setParams({ ...params, [data.name]: data.url })
    setImageFileEvent(data.file)
  }

  // bank details
  const handleBankDetails = (e: any) => {
    const { name, value } = e.target

    if (name === 'account_no') {
      const re = /^[0-9\b]+$/
      if (value && !re.test(value)) {
        return
      }
    }

    if (name) {
      setBankDetails({ ...bankDetails, [name]: value })
      setFormErrors({ ...formErrors, [`bank_details.${name}`]: '' })
    } else {
      setBankDetails({ ...bankDetails, check_image: e?.url, file: e.file })
    }
  }

  // removing other documents added
  const handleRemoveDocuments = (index: any, type: string) => {
    const list = [...params.images]
    if (type === 'index') {
      list.splice(index, 1)
    } else {
      list[index].file = ''
      list[index].url = ''
      list[index].preview = ''
    }

    setParams({ ...params, images: list })
  }

  // handling driving license
  const handleDL = (data: any) => {
    // console.log(data, "dl")
    // params.images.push({ label: 'Driving License', url: data, preview: '', file: data.file })
    setdlImageFileEvent(data.file)
  }

  const handleOkay = () => {
    setLoading(false)
    navigate('/users')
    setParams(initialValues)
    dispatch(setSuccessApiState())
    dispatch(setUpdateApiState())
  }

  // popup
  const handleOpen = (key: any, value: any) => {
    setopen({ ...open, [key]: value })
  }

  const handleNo = () => {
    handleOpen('warning', false)
  }

  return (
    <div>
      <div>
        <p className='text-xl	 font-extrabold text-white font-nunitoRegular'>{title}</p>
        <div className='w-full mt-7 p-1.5 lg:p-5 bg-lightbg rounded-lg border border-border'>
          <div className='h-14 bg-darkbg flex items-center pl-5 rounded-lg mb-6'>
            <p className='text-lg font-bold font-nunitoRegular'>User Details</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-6'>
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.name}
                  value={params.name}
                  handleChange={handleChange}
                  helperText={formErrors.name}
                  label='Enter Name'
                  name='name'
                />

                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.phone}
                  value={params.phone}
                  handleChange={handleChange}
                  helperText={formErrors.phone?.replace('characters', 'numbers')}
                  label='Phone Number'
                  name='phone'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={id ? true : false}
                  error={!!formErrors.email}
                  value={params.email}
                  handleChange={handleChange}
                  helperText={formErrors.email}
                  label='Email ID'
                  name='email'
                />

                <SelectInput
                  options={roles}
                  handleChange={handleChange}
                  value={params.role_id}
                  error={!!formErrors.role_id}
                  helperText={formErrors.role_id}
                  label='Select Role'
                  name='role_id'
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
                    helperText={formErrors.pincode?.replace('characters', 'numbers')}
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

              <div className='flex flex-col gap-10'>
                <div className='h-20'>
                  <p className='mb-2'>Display Image</p>
                  <FileUpload
                    styleType='md'
                    setImage={handleImage}
                    removeImage={() => deleteFile('image')}
                    acceptMimeTypes={['image/jpeg', 'image/png']}
                    title='Drag and Drop PDF here'
                    label='File Format:.JPEG,PNG'
                    id='file1'
                    maxSize={5}
                    imageUrl={params.image}
                    filename='image'
                  />
                </div>
                {showDLUpload ? (
                  <div className='h-20 pt-2'>
                    <p className='mb-2'>Driving License</p>
                    <FileUpload
                      styleType='md'
                      setImage={handleDL}
                      removeImage={() => deleteFile('dl_image')}
                      acceptMimeTypes={['application/pdf']}
                      title='Drag and Drop PDF here'
                      label='File Format:.pdf'
                      id='driving'
                      maxSize={5}
                      filename='dl'
                      imageUrl={params.dl_image}
                    />
                  </div>
                ) : null}

                {params.images
                  .filter((x) => x)
                  .map((list: any, index: any) => (
                    <div className='flex flex-col gap-12' key={uuid()}>
                      <div className='h-20 flex flex-col gap-2 mt-4'>
                        <div className='flex gap-10'>
                          <p>{list.label}</p>
                          {index === 0 ? null : (
                            <img
                              src={Delete}
                              className='cursor-pointer'
                              alt='delete'
                              onClick={() => {
                                handleRemoveDocuments(index, 'index')
                              }}
                            />
                          )}
                        </div>
                        <FileUpload
                          styleType='md'
                          setImage={(props) => setImage(props, index)}
                          removeImage={() => {
                            handleRemoveDocuments(index, 'value')
                          }}
                          acceptMimeTypes={['application/pdf']}
                          title='Drag and Drop PDF here'
                          label='File Format:.pdf'
                          id={`fileAdding${index}`}
                          maxSize={5}
                          imageUrl={list.url}
                          previewData={list.preview}
                          filename=''
                        />
                      </div>
                    </div>
                  ))}

                <div className='flex justify-end pt-10'>
                  <PopUp
                    handleDocument={handleAddDocument}
                    open={open.document}
                    handleClickOpen={() => {
                      setopen({ ...open, document: true })
                    }}
                    handleClose={() => {
                      setopen({ ...open, document: false })
                    }}
                    handleChange={handleLabel}
                    setImage={setHandleData}
                    title='Add New Document'
                    type='Add Other Documents'
                    name='add document'
                    additionalDoc={additonalDoc}
                    formErrors={formErrors}
                  />
                </div>
              </div>
            </div>
            {showBankForm ? (
              <div className='block'>
                <div className='h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mt-[50px]'>
                  <p className='text-[18px] font-bold font-nunitoRegular text-white'>
                    Bank Account Details
                  </p>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]'>
                  <div className='flex flex-col gap-[24px]'>
                    <Input
                      rows={1}
                      width='w-full'
                      disabled={false}
                      readOnly={false}
                      error={!!formErrors['bank_details.account_no']}
                      value={bankDetails.account_no}
                      handleChange={handleBankDetails}
                      helperText={formErrors['bank_details.account_no']}
                      label='Account Number'
                      name='account_no'
                    />
                    <Input
                      rows={1}
                      width='w-full'
                      disabled={false}
                      readOnly={false}
                      value={bankDetails.account_name}
                      error={!!formErrors['bank_details.account_name']}
                      handleChange={handleBankDetails}
                      helperText={formErrors['bank_details.account_name']}
                      label='Account Name'
                      name='account_name'
                    />
                    <Input
                      rows={1}
                      width='w-full'
                      disabled={false}
                      readOnly={false}
                      error={!!formErrors['bank_details.bank_name']}
                      value={bankDetails.bank_name}
                      handleChange={handleBankDetails}
                      helperText={formErrors['bank_details.bank_name']}
                      label='Bank Name'
                      name='bank_name'
                    />
                    <Input
                      rows={1}
                      width='w-full'
                      disabled={false}
                      readOnly={false}
                      error={!!formErrors['bank_details.ifsc_code']}
                      value={bankDetails.ifsc_code}
                      handleChange={handleBankDetails}
                      helperText={formErrors['bank_details.ifsc_code']}
                      label='IFSC Code'
                      name='ifsc_code'
                    />
                  </div>
                  <div className='h-20 flex flex-col gap-2'>
                    <p>Blank Cheque</p>
                    <FileUpload
                      styleType='md'
                      setImage={handleBankDetails}
                      acceptMimeTypes={['application/pdf']}
                      title='Drag and Drop PDF here'
                      label='File Format:.pdf'
                      id='index2'
                      maxSize={5}
                      filename='bank_cheque'
                    />
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}

            <div className='flex items-center justify-center lg:justify-end mt-20 lg:mt-10'>
              <div className='flex gap-8 pb-3 lg:pb-0'>
                <div className=' w-[150px] lg:w-[106px]'>
                  <CustomButton
                    onClick={() => {
                      setopen({ ...open, warning: true })
                    }}
                    width='w-full'
                    variant='outlined'
                    size='large'
                    disabled={loading}
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
                    disabled={loading}
                  >
                    {id ? 'Update Details' : 'Submit Details'}
                  </CustomButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Popup
        open={open.update}
        handleClickOpen={handleOpen}
        popup='success'
        subtitle=''
        popupmsg='User Updated Successfully!'
        handleOkay={handleOkay}
      />

      <Popup
        open={open.success}
        handleClickOpen={handleOpen}
        popup='success'
        subtitle=''
        popupmsg='User Created Successfully!'
        handleOkay={handleOkay}
      />

      <Popup
        open={open.warning}
        Confirmation={handleOkay}
        handleClickOpen={handleOpen}
        handleNo={handleNo}
        popup='warning'
        subtitle='Changes are not Saved!'
        popupmsg='Do you want to proceed without changes?'
        handleOkay={handleOkay}
      />
    </div>
  )
}

export default Form


