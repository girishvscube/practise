import { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import Validator from 'validatorjs'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import moment from 'moment'

import CustomButton from '../../../common/Button'
import { Input } from '../../../common/input/Input'
import { createBrowser, setApiSuccess } from '../../../../features/browser/browserSlice'
import Popup from '../../../common/Popup'
import axiosInstance from '../../../../utils/axios'
import FileUpload from '../../../common/FileUpload'
import DocumentsForm from './DocumentsForm'
import { menuStyles, showToastMessage, useSelectStyles } from '../../../../utils/helpers'

const { fields, rules } = require('./fields')

interface FormProps {
  type: string
  title: string
  name?: string
  value?: any
  label?: string
  error?: boolean
  helperText?: string
  // handleChange?: any
  options: any
  width?: string
  required?: boolean
}

const Form = ({ type, title, error, width, required }: FormProps) => {
  const { isLoading, apiSuccess, updateApiSuccess } = useSelector((state: any) => state.browser)
  const [parkingList, setParkingList] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const [params, setParams] = useState(fields)
  const [errors, setErrors] = useState(fields)
  const [bowserImage, setBowserImage] = useState('')
  const [open, setopen] = useState({
    warning: false,
    update: false,
    success: false,
  })
  const classes = useSelectStyles()

  const dispatch = useDispatch()

  const handleChange = (e: any) => {
    // console.log(e.target);
    setErrors(fields)
    if (e.target) {
      const { name, value } = e.target

      if (name === 'fuel_capacity') {
        const re = /^[0-9\b]+$/
        if (value && !re.test(value)) {
          return
        }
      }
      if (e.target.name.includes('_check')) {
        setParams({ ...params, [e.target.name]: e.target.checked })
      } else {
        setParams({ ...params, [e.target.name]: e.target.value })
      }
    } else {
      setParams({ ...params, [e.name]: e.file })
    }
  }

  const handleImage = (data: any) => {
    setBowserImage(data.file)
  }

  useEffect(() => {
    if (apiSuccess === true) {
      showSuccessMessage()
    }
    if (updateApiSuccess === true) {
      setopen({ ...open, update: true })
    }
  }, [apiSuccess, updateApiSuccess])

  useEffect(() => {
    if (type === 'update') {
      fetchBrowsers()
    }
  }, [])

  // auto fill data for edit
  const fetchBrowsers = async () => {
    const data: any = await axiosInstance.get(
      `${process.env.REACT_APP_BACKEND_URL}/admin/bowser/${id}`,
    )
    setParams(data.data.data)
  }

  const handleSubmit = async () => {
    const validation = new Validator(params, rules)

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

      setErrors(fieldErrors)
      return false
    }
    /* eslint-disable */
    let payload = { ...params }
    const payloadKeys = ['name', 'registration_no', 'fuel_capacity', 'parking_station_id']

    const formData = new FormData()

    for (let key of payloadKeys) {
      if (payload[key]) {
        formData.append(key, payload[key])
      }
    }
    if (bowserImage) {
      formData.append('image_file', bowserImage)
    }

    if (id) {
      let is_image = formData.get('image_file')
      if (!is_image) {
        formData.append('image', payload.image)
      }
    }

    if (payload.registration_validity) {
      payload.registration_validity = moment(new Date(payload.registration_validity)).format(
        'YYYY-MM-DD',
      )
    }

    if (payload.pollution_cert_validity) {
      payload.pollution_cert_validity = moment(new Date(payload.pollution_cert_validity)).format(
        'YYYY-MM-DD',
      )
    }
    if (payload.vehicle_fitness_validity) {
      payload.vehicle_fitness_validity = moment(new Date(payload.vehicle_fitness_validity)).format(
        'YYYY-MM-DD',
      )
    }

    if (payload.heavy_vehicle_validity) {
      payload.heavy_vehicle_validity = moment(new Date(payload.heavy_vehicle_validity)).format(
        'YYYY-MM-DD',
      )
    }

    id ? updateBowser(formData, id) : dispatch(createBrowser(formData))

    return true
  }

  //update
  const updateBowser = (payload: any, id: any) => {
    axiosInstance
      .put(`/admin/bowser/${id}`, payload)
      .then((res) => {
        showToastMessage('Updated Successfully', 'success')
        navigate('/fleet_manage/bowser')
      })
      .catch((err) => {
        showToastMessage('Something went Wrong', 'error')
      })
  }

  const showSuccessMessage = () => {
    toast.success('Bowser Created Successfully!', {
      position: toast.POSITION.TOP_RIGHT,
    })
    navigate('/fleet_manage/bowser')
    dispatch(setApiSuccess())
  }

  const handleOpen = (key: any, value: any) => {
    setopen({ ...open, [key]: value })
  }

  const handleOkay = () => {
    navigate('/fleet_manage/bowser')
  }

  useEffect(() => {
    getparking_station_idList()
  }, [])

  const getparking_station_idList = async () => {
    await axiosInstance('/admin/parking-station/dropdown')
      .then((response) => {
        setParkingList(response.data.data)
      })
      .catch((error) => {
        showToastMessage('UNABLE TO FETCH PARKING STATIONS', 'error')
      })
  }

  const handleNo = () => {
    handleOpen('warning', false)
  }

  return (
    <div>
      <div>
        <p className='text-xl font-extrabold text-white font-nunitoRegular'>{title}</p>
        <div className='w-full mt-[29px] p-[6px] lg:p-[20px] bg-lightbg rounded-lg border border-border'>
          <div className='h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mb-[24px]'>
            <p className='text-[18px] font-bold font-nunitoRegular'>Bowser Details</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
              <div className='flex flex-col gap-[24px]'>
                <Input
                  rows={1}
                  width='w-full'
                  error={errors?.name}
                  value={params.name}
                  handleChange={handleChange}
                  helperText={errors?.name}
                  label='Bowser Name'
                  name='name'
                />
                <Input
                  rows={1}
                  width='w-full'
                  error={errors?.registration_no}
                  value={params.registration_no}
                  handleChange={handleChange}
                  helperText={errors?.registration_no}
                  label='Registration Number'
                  name='registration_no'
                />

                <Input
                  rows={1}
                  width='w-full'
                  handleChange={handleChange}
                  value={params.fuel_capacity}
                  error={errors?.fuel_capacity}
                  helperText={errors?.fuel_capacity}
                  label='Fuel Capacity'
                  name='fuel_capacity'
                />
              </div>
              <div className='flex flex-col gap-[24px]'>
                <div className=''>
                  <p className='mb-2'>Bowser Image</p>
                  <FileUpload
                    filename='image'
                    styleType='lg'
                    setImage={handleImage}
                    acceptMimeTypes={['image/jpeg']}
                    title='Drag and Drop Image here'
                    label='File Format: .jpeg/ .png'
                    id='image'
                    maxSize={5}
                    imageUrl={params.image}
                  />
                </div>
              </div>
            </div>

            <div>
              <DocumentsForm
                params={params}
                setParams={setParams}
                errors={errors}
                handleChange={handleChange}
              />
            </div>

            <div className='h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mb-[24px] mt-[34px]'>
              <p className='text-[18px] font-bold font-nunitoRegular'>Linked Parking Station</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
              <div className='flex flex-col gap-[24px]'>
                <FormControl className={classes.root} fullWidth error={error}>
                  <InputLabel id='select-input-label'>Select Parking Station</InputLabel>
                  <Select
                    labelId='select-input-label'
                    style={{
                      width,
                    }}
                    sx={{
                      '.MuiSvgIcon-root ': {
                        fill: 'white !important',
                      },
                    }}
                    MenuProps={menuStyles}
                    required={required}
                    value={params.parking_station_id}
                    onChange={handleChange}
                    label='Select Parking Station'
                    name='parking_station_id'
                    error={errors?.parking_station_id}
                    fullWidth
                  >
                    {parkingList.map((item: any) => (
                      <MenuItem key={item.id} value={item.id ? item.id : item.name}>
                        {item.station_name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors?.parking_station_id && (
                      <p style={{ color: '#d32f2f' }} className=''>
                        The parking station field is required.
                      </p>
                    )}
                  </FormHelperText>
                </FormControl>
              </div>
            </div>

            <div className='flex items-center justify-center lg:justify-end mt-20 lg:mt-10'>
              <div className='flex gap-8 pb-3 lg:pb-0'>
                <div className=' w-[150px] lg:w-[106px]'>
                  <CustomButton
                    disabled={isLoading}
                    borderRadius='7px'
                    onClick={() => {
                      setopen({ ...open, warning: true })
                    }}
                    // width="w-[106px]"
                    width='w-full'
                    variant='outlined'
                    size='large'
                  >
                    Cancel
                  </CustomButton>
                </div>
                <div className=' w-[150px] lg:w-[307px]'>
                  <CustomButton
                    disabled={isLoading}
                    borderRadius='7px'
                    onClick={handleSubmit}
                    // width="w-[307px]"
                    width='w-full'
                    variant='contained'
                    size='large'
                  >
                    Submit Details
                  </CustomButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Popup
        open={open.warning}
        Confirmation={handleOkay}
        handleNo={handleNo}
        handleClickOpen={handleOpen}
        popup='warning'
        subtitle='Changes are not Saved!'
        popupmsg='Do you want to proceed without changes?'
        handleOkay={handleOkay}
      />
    </div>
  )
}

export default Form
