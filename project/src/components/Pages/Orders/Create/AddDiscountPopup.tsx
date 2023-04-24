import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
import { Input } from '../../../common/input/Input'

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
          <img src={CloseSquareLight} alt='' />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}
interface PopUpProps {
  handleOpen: any
  handleClose: any
  open: any
  meta: any
  handleDiscountSubmit: any,
  handleDiscountChange:any,
  setMeta:any
}
const CustomizedDialogs = ({
  open,
  meta,
  handleOpen,
  handleClose,
  handleDiscountSubmit,
  handleDiscountChange,
  setMeta
}: PopUpProps) => {

  const SubmitDiscount = () => {
    if (meta.discount) {
      handleDiscountSubmit(meta)
    }
    handleClose()
  }

  const handleChange = (e) => {
    handleDiscountChange(e?.target)
  }
  return (
    <div className='flex justify-center'>
      <CustomButton
        borderRadius='0.5rem'
        onClick={handleOpen}
        width='w-fit'
        variant='outlined'
        size='large'
        icon={
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8.00008 5.55469V10.4389'
              stroke='#FFCD2C'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M10.445 7.99685H5.55615'
              stroke='#FFCD2C'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M11.124 1.33594H4.87635C2.69858 1.33594 1.3335 2.87733 1.3335 5.05938V10.9458C1.3335 13.1279 2.69223 14.6693 4.87635 14.6693H11.124C13.3081 14.6693 14.6668 13.1279 14.6668 10.9458V5.05938C14.6668 2.87733 13.3081 1.33594 11.124 1.33594Z'
              stroke='#FFCD2C'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        }
      >
        Add Discount
      </CustomButton>

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
                Add Discount
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <div className='border  border-border  w-[325px] lg:w-[496px]  bg-[#151929]  rounded-lg flex flex-col  '>
                <div className=' flex justify-evenly bg-lightbg rounded-t-lg  '>
                  <div
                    className={`cursor-pointer border-border w-full ${
                      meta.discount_type === 'Percentage' ? 'border-yellow border-b-2 ' : 'border-r'
                    }`}
                  >
                    <p
                      onClick={() => {
                        setMeta({
                          ...meta,
                          discount: 0,
                          discount_type: 'Percentage',
                        })
                      }}
                      className={`py-2 text-center  ${
                        meta.discount_type === 'Percentage' ? 'text-yellow ' : 'text-white'
                      }`}
                    >
                      Percentage
                    </p>
                  </div>
                  <div
                    className={` cursor-pointer border-border w-full  ${
                      meta.discount_type === 'Amount' ? 'border-yellow border-b-2 ' : 'border-l'
                    }`}
                  >
                    <p
                      onClick={() => {
                        setMeta({ ...meta, discount: 0, discount_type: 'Amount' })
                      }}
                      className={` py-2   text-center  ${
                        meta.discount_type === 'Amount' ? 'text-yellow ' : 'text-white'
                      } `}
                    >
                      Amount
                    </p>
                  </div>
                </div>
                <div className='p-4 rounded-lg my-4'>
                  <Input
                    rows={1}
                    disabled={false}
                    readOnly={false}
                    bgcolor='#262938'
                    value={meta?.discount}
                    handleChange={handleChange}
                    label={
                      meta.discount_type == 'Amount'
                        ? 'Enter the Discount value'
                        : 'Enter the Percentage value'
                    }
                    name='discount'
                  />
                </div>
              </div>

              <br />
              <div className='border p-4  border-border  w-[325px] lg:w-[496px]  bg-[#151929]  rounded-lg grid grid-cols-3  justify-between  '>
                <div className=''>
                  <p className='text-xs text-textgray '>Actual Total</p>
                  <p className='text-white'>{meta?.grand_total}</p>
                </div>
                <div className=''>
                  <p className='text-xs text-textgray '>Discount Applied</p>
                  <p className='text-white'>{meta?.discount || '--'}</p>
                </div>
                <div className=''>
                  <p className='text-xs text-textgray '>Final Total</p>
                  <p className='text-white'>{meta?.updated_total}</p>
                </div>
              </div>
            </div>
          </DialogContent>
          <div className='flex justify-center pt-2 pb-10 h-[72px]'>
            <CustomButton onClick={SubmitDiscount} width='w-full' variant='contained' size='large'>
              Submit Details
            </CustomButton>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  )
}
export default CustomizedDialogs
