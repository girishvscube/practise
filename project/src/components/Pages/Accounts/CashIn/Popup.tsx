import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
import { SelectInput } from '../../../common/input/Select'
import { Input } from '../../../common/input/Input'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCashTypeDropdown } from '../../../../features/dropdowns/dropdownSlice'

import CommonDatepicker from '../../../../components/common/input/Datepicker'
import moment from 'moment'

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
  params?: any
  handleChange?: any
  errors?: any
  handleDate?: any
  handleSubmit?: any
  disabledButton?: any
}
const CustomizedDialogs = ({
  open,
  handleClose,
  title,
  type,
  name,
  params,
  handleChange,
  errors,
  handleDate,
  handleSubmit,
  disabledButton,
}: PopUpProps) => {
  const dispatch = useDispatch()

  const { cashTypeDropdown } = useSelector((state: any) => state.dropdown)

  useEffect(() => {
    dispatch(fetchCashTypeDropdown())
  }, [])
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
              padding: 10,
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
            <div className='mobileView bg-darkbg border border-none flex flex-col gap-6 pt-10'>
              <SelectInput
                width='100%'
                options={cashTypeDropdown}
                handleChange={handleChange}
                value={params.type}
                label='Select Type of adjustment'
                name='type'
                error={!!errors.type}
                helperText={errors.type}
              />

              <Input
                rows={1}
                width='w-full'
                // disabled={params?.type.length > 0 ? false : true}
                readOnly={false}
                error={!!errors.amount}
                value={params.amount}
                handleChange={handleChange}
                helperText={errors.amount}
                label='Enter Amount'
                name='amount'
              />

              <div className='flex flex-col gap-1'>
                <CommonDatepicker
                  label='Select Adjustment Date'
                  value={
                    params?.adjustment_date
                      ? moment(params?.adjustment_date).format('YYYY-MM-DD')
                      : null
                  }
                  onChange={handleDate}
                />
                {errors.adjustment_date ? (
                  <p className='ml-4 text-red-600 text-xs'>{errors.adjustment_date}</p>
                ) : (
                  ''
                )}
              </div>
            </div>
          </DialogContent>
          <div className='flex w-full justify-center mobileView border border-none'>
            <div>
              <CustomButton
                onClick={handleSubmit}
                width='w-fit'
                variant='contained'
                size='large'
                borderRadius='0.5rem'
                disabled={disabledButton}
              >
                {type === 'update' ? 'Update Details' : ' Submit Details'}
              </CustomButton>
            </div>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  )
}

export default CustomizedDialogs
