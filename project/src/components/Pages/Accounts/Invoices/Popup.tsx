import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import CustomButton from '../../../common/Button'
import TextArea from '../../../common/input/TextArea'
import { Input } from '../../../common/input/Input'
import FileUpload from '../../../common/FileUpload'
import { useState } from 'react'

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
  submit: any
  params: any
  error: any
  handleChange: any
  disabled: any
  invoiceId: any
}
const CustomizedDialogs = ({
  open,
  handleClose,
  title,
  type,
  name,
  submit,
  error,
  params,
  handleChange,
  disabled,
  invoiceId,
}: PopUpProps) => {
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
            <div className='mobileView bg-darkbg border border-none flex flex-col gap-6'>
              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!error?.to}
                value={params.to}
                handleChange={handleChange}
                helperText={error?.to}
                label='To'
                name='to'
              />

              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!error?.cc}
                value={params.cc}
                handleChange={handleChange}
                helperText={error?.cc}
                label='cc'
                name='cc'
              />

              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                error={!!error?.subject}
                value={params.subject}
                handleChange={handleChange}
                helperText={error?.subject}
                label='Subject'
                name='subject'
              />

              <TextArea
                placeholder='Write a message here'
                id='123456'
                name='message'
                rows={5}
                className='col-span-3'
                error={!!error?.message}
                value={params.message}
                handleChange={handleChange}
                helperText={error?.message}
              />

              <p className='mb-2 text-white'>Invoice Attached in the mail</p>
            </div>
          </DialogContent>
          <div className='flex w-full justify-center mobileView border border-none'>
            <div>
              <CustomButton
                onClick={submit}
                width='w-fit'
                variant='contained'
                size='large'
                borderRadius='0.5rem'
                disabled={disabled}
              >
                Send Mail
              </CustomButton>
            </div>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  )
}

export default CustomizedDialogs
