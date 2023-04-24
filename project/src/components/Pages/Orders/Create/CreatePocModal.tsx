import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
import { Input } from '../../../common/input/Input'
import Validator from 'validatorjs'
import FileUpload from '../../../common/FileUpload'
import Profile from '../../../../assets/icons/filledIcons/AddUser.svg'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CreatePoc } from '../../../../features/customer/pocSlice'

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
}
const CustomizedDialogs = ({ open, handleClickOpen, handleClose, customer_id }: PopUpProps) => {
  const dispatch = useDispatch()
  const { createSuccess, editSuccess } = useSelector((state: any) => state.poc)
  // console.log(customer_id, 'cid');
  const initialValues = {
    poc_name: '',
    phone: '',
    email: '',
    designation: '',
    image: '',
  }

  const [params, setParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)

  const [postImage, setpostImage] = useState('')

  const handleChange = (e: any) => {
    setParams({ ...params, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    handleClose()
  }, [createSuccess, editSuccess])

  const handleSubmit = async () => {
    const postdata = {
      ...params,
      customer_id,
    }

    const formdata = new FormData()

    Object.entries(postdata).forEach(([key, value]) => {
      if (key !== 'image') {
        formdata.append(`${key}`, `${value}`)
      }
    })

    formdata.append('image', postImage)

    const validation = new Validator(
      params,
      {
        phone: 'numeric|required|digits:10',
        designation: 'required',
        poc_name: 'required',
        email: 'required',
     
      },
      {
        required: '* required',
      },
    )
    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })
      setErrors(fieldErrors)
      return false
    }
    dispatch(CreatePoc(formdata))
    return true
  }
  const handleImage = (data: any) => {
    setpostImage(data?.file)
    setParams({ ...params, image: data.url })
    setErrors({ ...errors, image: '' })
  }
  return (
    <div className=''>
      <div className='justify-start flex '>
        <CustomButton
          onClick={handleClickOpen}
          width='w-fit'
          variant='outlined'
          size='large'
          icon={<img src={Profile} alt='' />}
          borderRadius='0.5rem'
        >
          Add New POC
        </CustomButton>
      </div>

      <div>
        <BootstrapDialog  sx={{
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
                Add New Poc
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <div className='w-[325px]  lg:w-[496px] mt-4 bg-[#151929] p-2 lg:p-6 rounded-lg flex flex-col gap-6'>
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors?.poc_name}
                  value={params?.poc_name}
                  handleChange={handleChange}
                  helperText={errors?.poc_name}
                  label='POC Name'
                  name='poc_name'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors?.designation}
                  value={params?.designation}
                  handleChange={handleChange}
                  helperText={errors?.designation}
                  label='Designation'
                  name='designation'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors?.phone}
                  value={params?.phone}
                  handleChange={handleChange}
                  helperText={errors?.phone}
                  label='Contact Number'
                  name='phone'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!errors?.email}
                  value={params?.email}
                  handleChange={handleChange}
                  helperText={errors?.email}
                  label='Email ID'
                  name='email'
                />
                <div className='flex flex-col gap-1'>
                  <p className='text-white'>POC Image</p>
                  <FileUpload
                    styleType='md'
                    setImage={handleImage}
                    acceptMimeTypes={['image/jpeg']}
                    title='Drag and Drop PDF here'
                    label='File Format:.JPEG,PNG'
                    id='file1'
                    maxSize={5}
                    filename=''
                  />
                  {errors?.image ? (
                    <p className='text-[13px] ml-2 text-red-600'>* required</p>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogContent>
          <div className='flex justify-center pt-2 pb-10 h-[72px]'>
            <CustomButton onClick={handleSubmit} width='w-full' variant='contained' size='large'>
              Submit Details
            </CustomButton>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  )
}
export default CustomizedDialogs
