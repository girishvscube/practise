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
          {/* <CloseIcon /> */}
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
  handlePriceChange:any
}
const CustomizedDialogs = ({
  open,
  handleOpen,
  handleClose,
  handleDiscountSubmit,
  handlePriceChange,
  meta
}: PopUpProps) => {
  const handleChange = (e) => {
    handlePriceChange(e?.target)
  }

  const SubmitPerLitreCost = () => {
    if (meta.update_liter_price) {
      handleDiscountSubmit(meta)
    }
    handleClose()
  }
  
  return (
    <div className='flex justify-center'>
      <CustomButton
        borderRadius='0.5rem'
        onClick={handleOpen}
        width='w-fit'
        variant='contained'
        size='large'
      >
        Edit Price
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
            <div className='flex justify-start h-5 '>
              <p className='font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white'>
                Edit Price Values
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <div className='border  border-border  w-[325px] lg:w-[496px]  bg-[#151929]  rounded-lg flex flex-col  '>
                <div className='border-b-2   bg-lightbg rounded-t-lg  border-yellow text-center'>
                  <p className='rounded-lg my-2 text-yellow '>Price Per Litre</p>
                </div>
                <div className='p-4 rounded-lg my-4'>
                  <Input
                    rows={1}
                    disabled={false}
                    readOnly={false}
                    bgcolor='#262938'
                    value={meta.update_liter_price}
                    handleChange={handleChange}
                    label='Enter the value'
                    name='update_liter_price'
                  />
                </div>
              </div>

              <br />
              <div className='border p-4  border-border  w-[325px] lg:w-[496px]  bg-[#151929]  rounded-lg grid grid-cols-3  justify-between  '>
                <div className=''>
                  <p className='text-xs text-textgray '>Today's Per Litre</p>
                  <p className='text-white'>{meta.per_litre_cost}</p>
                </div>

                <div className=''>
                  <p className='text-xs text-textgray '>Updated Fuel Price</p>
                  <p className='text-white'>{meta.update_liter_price || '--'}</p>
                </div>
              </div>
            </div>
          </DialogContent>
          <div className='flex justify-center pt-2 pb-10 h-[72px]'>
            <CustomButton
              onClick={SubmitPerLitreCost}
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
