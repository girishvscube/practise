import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
// import { Input } from '../../../common/input/Input';
// import Validator from 'validatorjs'
// import FileUpload from '../../../common/FileUpload';
import Profile from '../../../../assets/icons/filledIcons/AddUser.svg'
import { useEffect, useState } from 'react'
// import { CreatePoc, EditPoc } from '../../../../features/customer/pocSlice'
import AddPocForm from '../../Customer/View/AddPocForm'
import { MultiSelectInput } from '../../../common/input/MultiSelect'
import { SelectChangeEvent } from '@mui/material/Select'
import { SelectInput } from '../../../common/input/Select'
import axiosInstance from '../../../../utils/axios'
import { getCustomerPocList } from '../../../../features/customer/pocSlice'
import { fetchPocByOrder } from '../../../../features/orders/orderSlice'
import { useSelector, useDispatch } from 'react-redux'
import { dropdown } from '../../../../features/dropdowns/dropdownSlice'
import { showToastMessage } from '../../Settings/BankAccounts/Toast'
import { getpocDropdown } from '../../../../features/dropdowns/dropdownSlice'

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
  OpenPopup: any
  ClosePopup: any
  isOpen: any
  params: any
  setFormParams: any
  formErrors: any
  setFormErrors: any
  customer_id: any
  type: any
  pocId?: any
  orderId: any
}
const CustomizedDialogs = ({
  isOpen,
  OpenPopup,
  ClosePopup,
  params,
  setFormParams,
  formErrors,
  setFormErrors,
  customer_id,
  type,
  pocId,
  orderId,
}: PopUpProps) => {
  const dispatch = useDispatch()

  const { createSuccess, editSuccess } = useSelector((state: any) => state.poc)
  const { pocDropdown } = useSelector((state: any) => state.dropdown)

  const [pocs, setPocs] = useState<string[]>([])

  const [isMoreOpen, setIsmoreOpen] = useState(false)

  const openMorePopup = () => {
    setIsmoreOpen(true)
  }
  const closeMorePopup = () => {
    setIsmoreOpen(false)
  }

  const [customerPocs, setCustomerPocs] = useState(false)
  const fetchPocDropDown = async () => {
    axiosInstance
      .get(`/admin/customers/poc/dropdown/${customer_id}`)
      .then((response) => {
        console.log('response:', response.data.data)
        setCustomerPocs(response.data.data)
      })
      .catch((error) => {
        console.log('error:', error)
      })
  }

  useEffect(() => {
    if (customer_id) fetchPocDropDown()
  }, [customer_id])

  const handleChange = (event: SelectChangeEvent<typeof pocs>) => {
    const {
      target: { value },
    } = event
    setPocs(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    ClosePopup()
  }, [createSuccess, editSuccess])

  const handleSubmit = async () => {
    await axiosInstance
      .post(`/admin/orders/poc/${orderId}`, { poc_ids: pocs })
      .then((response: any) => {
        console.log(response?.data)
        dispatch(fetchPocByOrder(orderId))
        ClosePopup()
      })
      .catch((error) => {
        showToastMessage(error.response.data.errors.message, 'error')
        console.log(error)
      })
  }

  return (
    <div className='flex justify-center'>
      {type === 'update' ? null : (
        <CustomButton
          onClick={OpenPopup}
          width='w-[140px]'
          variant='outlined'
          size='large'
          icon={<img src={Profile} alt='' />}
          borderRadius='20px'
        >
          Add POC
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
          // onClose={ClosePopup}
          aria-labelledby='customized-dialog-title'
          open={isOpen}
          PaperProps={{
            sx: { m: 1, backgroundColor: '#404050', alignItems: 'center', borderColor: '#404050' },
          }}
        >
          <BootstrapDialogTitle id='customized-dialog-title' onClose={ClosePopup}>
            <div className='flex justify-start h-5'>
              <p className='font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white'>
                {`Add POC to the Order ${+orderId + 1}`}
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <div className='w-[325px] lg:w-[496px]  bg-[#151929] p-2 lg:p-6 rounded-lg flex flex-col gap-6'>
                <MultiSelectInput
                  handleChange={handleChange}
                  value={pocs}
                  label='Select'
                  error={false}
                  helperText=''
                  options={customerPocs}
                  width='100%'
                  name='poc_ids'
                />

                <p className='text-xs text-textgray text-center'>
                  Are you any Finding the Relevent POCs ? (or) Do you want to Add New Point of
                  Contact?
                </p>
                <div>
                  <AddPocForm
                    open={isMoreOpen}
                    handleClickOpen={openMorePopup}
                    handleClose={closeMorePopup}
                    params={params}
                    setFormParams={setFormParams}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    customer_id={customer_id}
                    type='create'
                    pocId={1}
                  />
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

CustomizedDialogs.defaultProps = {
  pocId: '',
}
