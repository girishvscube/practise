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
import { CreatePoc, EditPoc } from '../../../../features/customer/pocSlice'
import { getCustomerPocList, resetProgress } from '../../../../features/customer/pocSlice'
import { showToastMessage } from './../../Suppliers/SupplierCreation/Toast'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    backgroundColor: '#404050 ',
    // borderRadius: '10rem !important',
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
  params: any
  setFormParams: any
  formErrors: any
  setFormErrors: any
  customer_id: any
  type: any
  pocId?: any
}
const CustomizedDialogs = ({
  open,
  handleClickOpen,
  handleClose,
  params,
  setFormParams,
  formErrors,
  setFormErrors,
  customer_id,
  type,
  pocId,
}: PopUpProps) => {
  const dispatch = useDispatch()
  const { createSuccess, editSuccess, createFailed, editFailed } = useSelector(
    (state: any) => state.poc,
  )

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormErrors({})
    if (name === 'phone') {
      const re = /^[0-9\b]+$/
      if (value && !re.test(value)) {
        return
      }
    }
    setFormParams({ ...params, [e.target.name]: e.target.value.toString() })
  }

  const [postImage, setpostImage] = useState('')
  const [disable, setDisable] = useState(false)

  // console.log(customer_id, 'customer_id')/
  useEffect(() => {
    handleClose()
    setDisable(false)
  }, [createSuccess, editSuccess])

  useEffect(() => {
    handleClose()
    setDisable(false)
  }, [createFailed, editFailed])

  const handleSubmit = async () => {
    setDisable(true)
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

    if (postImage) {
      formdata.append('image_file', postImage)
    }

    if (type === 'update') {
      let is_image = formdata.get('image_file')
      if (!is_image) formdata.append('image', params.image)
    }

    const validation = new Validator(params, {
      phone: 'numeric|required|numeric|digits:10',
      designation: 'required',
      poc_name: 'required|max:20',
      email: 'required|email',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })
      setFormErrors(fieldErrors)

      const err = Object.keys(formErrors)
      if (err.length) {
        console.log('err:', err)

        const input: any = document.querySelector(`input[name=${err[0]}]`)
        console.log('input:', input)

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
      dispatch(EditPoc(formdata, pocId))
    } else {
      dispatch(CreatePoc(formdata))
    }
    return true
  }
  const handleImage = (data: any) => {
    // console.log(data.file, 'file')
    setpostImage(data?.file)
    setFormParams({ ...params, image: data.url })
    setFormErrors({ ...formErrors, image: '' })
  }

  const removeImage = () => {
    setFormParams({ ...params, image: '' })
  }
  return (
    <div className='flex justify-center'>
      {type === 'update' ? null : (
        <CustomButton
          onClick={handleClickOpen}
          width='w-fit'
          variant='outlined'
          size='large'
          icon={<img src={Profile} alt='' />}
          borderRadius='20px'
        >
          Add New POC
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
            <div className='flex justify-start h-5 '>
              <p className='font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white'>
                {type === 'update' ? 'Update Poc' : 'Add New Poc'}
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <div className='w-[325px]  lg:w-[496px] subdiv  rounded-lg flex flex-col gap-6'>
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.poc_name}
                  value={params?.poc_name}
                  handleChange={handleChange}
                  helperText={formErrors?.poc_name}
                  label='POC Name'
                  name='poc_name'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.designation}
                  value={params?.designation}
                  handleChange={handleChange}
                  helperText={formErrors?.designation}
                  label='Designation'
                  name='designation'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.phone}
                  value={params?.phone}
                  handleChange={handleChange}
                  helperText={formErrors?.phone}
                  label='Contact Number'
                  name='phone'
                />
                <Input
                  rows={1}
                  width='w-full'
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.email}
                  value={params?.email}
                  handleChange={handleChange}
                  helperText={formErrors?.email}
                  label='Email ID'
                  name='email'
                />

                {/* <input
                  type='file'
                  onChange={(e: any) => {
                    console.log(e?.target?.files[0])
                  }}
                  name=''
                  id=''
                /> */}
                <div className='flex flex-col gap-1    w-full'>
                  <p className='text-white'>POC Image</p>
                  <FileUpload
                    removeImage={removeImage}
                    imageUrl={params?.image}
                    styleType='md'
                    setImage={handleImage}
                    acceptMimeTypes={['image/jpeg']}
                    title='Drag and Drop PDF here'
                    label='File Format:.JPEG,PNG'
                    id='file1'
                    maxSize={5}
                    filename=''
                  />
                  {formErrors?.image ? (
                    <p className='text-[13px] ml-2 text-red-600'>* required</p>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogContent>
          <div className='flex justify-center pt-2 pb-10 h-[72px]'>
            <CustomButton
              disabled={disable}
              onClick={handleSubmit}
              width='w-full'
              variant='contained'
              size='large'
            >
              Submit Details
            </CustomButton>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  )
}
export default CustomizedDialogs

CustomizedDialogs.defaultProps = {
  pocId: '',
}
