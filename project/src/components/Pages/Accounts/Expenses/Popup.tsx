import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
import { SelectInput } from '../../../common/input/Select'
import { Input } from '../../../common/input/Input'
import FileUpload from '../../../common/FileUpload'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../../utils/axios'
import Validator from 'validatorjs'
import { toast } from 'react-toastify'
import CommonDatepicker from '../../../../components/common/input/Datepicker'
import moment from 'moment'

const expenseType = [
  {
    id: 'Direct',
    name: 'Direct',
  },
  {
    id: 'Indirect',
    name: 'Indirect',
  },
]

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    width: '100%',
    // alignItems: 'center',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    backgroundColor: '#404050',
  },
  dialogCustomizedWidth: {
    'max-width': '80%',
  },
}))
export interface DialogTitleProps {
  id: string
  children: any
  onClose: () => void
  type: any
}
const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, type, ...other } = props
  return (
    <DialogTitle sx={{ m: 0, py: 3 }} {...other}>
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
          <img src={CloseSquareLight} alt='' />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}
interface PopUpProps {
  handleClose: any
  open: any
  title: any
  type: string
  name: string
  accountsDropdown: any
  categoryExpense: any
  expenseId: any
}
const CustomizedDialogs = ({
  open,
  handleClose,
  title,
  type,
  name,
  accountsDropdown,
  categoryExpense,
  expenseId,
}: PopUpProps) => {
  const initialValues = {
    expense_type: '',
    sub_category: '',
    item_name: '',
    payee: '',
    amount: '',
    account_id: '',
    reference_img: '',
    date_of_expense: '',
  }
  const [params, setParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)
  const [imageFileEvent, setImageFileEvent] = useState('')
  const [loading, setLoading] = useState(false)
  const [subcategories, setSubcategories] = useState([])
  const handleInputChange = (event: any) => {
    setErrors(initialValues)
    if (event.target.name === 'expense_type') {
      fetchSubCategories(event.target.value)
    }
    if (event.target) {
      setParams({ ...params, [event.target.name]: event.target.value })
    } else {
      setParams({ ...params, reference_img: event.url })
    }
  }

  const handleDate = (date) => {
    setErrors(initialValues)
    setParams({ ...params, date_of_expense: date })
  }

  useEffect(() => {
    if (expenseId) {
      fetchExpenseForEdit()
    }
  }, [expenseId])

  const fetchExpenseForEdit = () => {
    axiosInstance.get(`/admin/expense/${expenseId}`).then((response) => {
      setParams(response?.data?.data)
      fetchSubCategories(response?.data?.data?.expense_type)
    })
  }

  const fetchSubCategories = (string: any) => {
    axiosInstance.get(`/admin/settings/expense-category/${string}`).then((res) => {
      setSubcategories(res?.data?.data)
    })
  }

  const handleImage = (data: any) => {
    setImageFileEvent(data.file)
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

  const handleSubmitAndNextPayIn = () => {
    handleSubmit('true')
    setImageFileEvent('')
  }

  const handleSubmit = (check: any) => {
    const rules = {
      expense_type: 'required',
      sub_category: 'required',
      item_name: 'required',
      payee: 'required',
      amount: 'required',
      account_id: 'required',
      date_of_expense: 'required',
    }

    const validation = new Validator(params, rules)

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })
      setErrors(fieldErrors)
      return false
    }
    setLoading(true)
    let formData = new FormData()
    const payloadKeys = [
      'expense_type',
      'sub_category',
      'item_name',
      'payee',
      'amount',
      'account_id',
      'date_of_expense'
    ];

    for (const key of payloadKeys) {

      if (key === 'date_of_expense') {
        let date = params['date_of_expense']
        let postdate = moment(date).format('YYYY-MM-DD')
        formData.append(key, postdate)
        continue
      }
      else {
        formData.append(key, params[key]);
      }
    }

    if (imageFileEvent) {
      formData.append('reference_img_file', imageFileEvent)
    }

    if (expenseId) {
      let is_image = formData.get('reference_img_file');
      if (!is_image) {
        formData.append('image', params.reference_img)
      }
    }

    expenseId
      ? axiosInstance
          .put(`/admin/expense/${expenseId}`, formData)
          .then((res) => {
            showToastMessage('Updated Successfully', 'success')
            handleClose()
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
          })
      : axiosInstance
          .post(`/admin/expense`, formData)
          .then((res) => {
            showToastMessage('Created Successfully', 'success')

            {
              check === 'true' ? null : handleClose()
            }
            setParams(initialValues)
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
          })
  }

  return (
    <div>
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
              width: '100%',
              m: 0,
              backgroundColor: 'arsenic',
              alignItems: 'center',
              borderColor: 'arsenic',
            },
          }}
        >
          <BootstrapDialogTitle id={name} onClose={handleClose} type={type}>
            <div className='flex justify-start'>
              <p className='font-bold font-nunitoRegular flex justify-start text-white absolute top-2 left-6'>
                {title}
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>

            <div className="mobileView bg-darkbg border border-none flex flex-col gap-6">
              <div>
                <CommonDatepicker label="Select Date of Expense" value={params?.date_of_expense ? moment(params.date_of_expense).format('YYYY-MM-DD') : null} onChange={handleDate} />
                {errors.date_of_expense ? <p className='ml-4 text-red-600 text-xs'>{errors.date_of_expense}</p> : ''}
              </div>

              <SelectInput
                width='100%'
                options={expenseType}
                handleChange={handleInputChange}
                value={params.expense_type}
                label='Expense Type'
                name='expense_type'
                error={!!errors.expense_type}
                helperText={errors.expense_type}
              />
              <SelectInput
                width='100%'
                options={subcategories}
                handleChange={handleInputChange}
                value={params.sub_category}
                label='Select Sub Category'
                name='sub_category'
                error={!!errors.sub_category}
                helperText={errors.sub_category}
              />
              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!errors.item_name}
                value={params.item_name}
                handleChange={handleInputChange}
                helperText={errors.item_name}
                label='Item Name'
                name='item_name'
              />
              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!errors.payee}
                value={params.payee}
                handleChange={handleInputChange}
                helperText={errors.payee}
                label='Enter Payee'
                name='payee'
              />

              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!errors.amount}
                value={params.amount}
                handleChange={handleInputChange}
                helperText={errors.amount}
                label='Amount Spent'
                name='amount'
              />

              <SelectInput
                width='100%'
                options={accountsDropdown}
                handleChange={handleInputChange}
                value={params.account_id}
                label='Account'
                name='account_id'
                error={!!errors.account_id}
                helperText={errors.account_id}
              />
              <div className=''>
                <p className='mb-2 text-white'>Reference bill Image</p>
                <FileUpload
                  styleType='md'
                  setImage={handleImage}
                  removeImage={() => setImageFileEvent('')}
                  acceptMimeTypes={['image/jpeg']}
                  title='Drag and Drop PDF here'
                  label='File Format:.JPEG,PNG'
                  id='file1'
                  maxSize={5}
                  imageUrl={params.reference_img}
                  filename='image'
                  error={errors.reference_img}
                />
                {errors?.reference_img ? (
                  <p className='ml-4 text-xs text-red-600'>Required</p>
                ) : null}
              </div>
            </div>
          </DialogContent>
          <div className='flex w-full justify-between mobileView border border-none'>
            <div className={expenseId ? 'hidden' : 'block'}>
              <CustomButton
                onClick={handleSubmitAndNextPayIn}
                width='w-fit w-full'
                variant='outlined'
                size='large'
                borderRadius='0.5rem'
                disabled={loading ? true : false}
              >
                Submit & Next Pay-in
              </CustomButton>
            </div>

            <div className={expenseId ? 'flex w-full justify-center' : ''}>
              <CustomButton
                onClick={() => {
                  handleSubmit('false')
                }}
                width='w-fit'
                variant='contained'
                size='large'
                borderRadius='0.5rem'
                disabled={loading ? true : false}
              >
                {expenseId ? 'Update Details' : 'Submit Details'}
              </CustomButton>
            </div>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  )
}

export default CustomizedDialogs
