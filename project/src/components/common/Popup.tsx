import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import ButtonComponent from './Button'
import { SxProps } from '@mui/material'

interface Props {
  open?: any
  handleClickOpen?: any
  popup?: string
  title?: string
  subtitle?: string
  popupmsg?: string
  Confirmation?: any
  handleOkay?: any
  handleNo?: any
}

const dialogSx: SxProps = {
  '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    backgroundColor: '#262938',
    borderRadius: '8px',
    border: '1px solid #404050',
    width: '100%',
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(5px)',
  },
}

const Popup: React.FC<Props> = ({
  open,
  handleClickOpen,
  popup,
  title,
  subtitle,
  popupmsg,
  Confirmation,
  handleOkay,
  handleNo,
}) => {
  const DialogContentSx: SxProps = {
    color: popup === 'success' ? '#57CD53' : popup === 'warning' ? '#EF4949' : 'white',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '22px',
  }
  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') {
      console.log(reason)
    } else {
      handleClickOpen(popup, false)
    }
  }
  return (
    <div>
      <Dialog
        sx={dialogSx}
        open={open}
        disableEscapeKeyDown
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent sx={{ width: '100%', padding: window.innerWidth < 768 ? '0.5rem' : '1rem' }}>
          <DialogContentText component='div' sx={DialogContentSx} id='alert-dialog-description'>
            <div>
              <div className={`${popup !== 'question' ? 'hidden' : 'flex justify-between mb-4'}`}>
                <p className=' text-white'>{title}</p>
                <svg
                  className=' cursor-pointer '
                  onClick={() => handleClickOpen(popup, false)}
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M14.3936 10.1211L9.60156 14.9131'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M14.3976 14.9181L9.60156 10.1211'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M16.334 3.27734H7.665C4.644 3.27734 2.75 5.41634 2.75 8.44334V16.6113C2.75 19.6383 4.635 21.7773 7.665 21.7773H16.333C19.364 21.7773 21.25 19.6383 21.25 16.6113V8.44334C21.25 5.41634 19.364 3.27734 16.334 3.27734Z'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <div className=' bg-darkbg rounded-lg py-5 mt-2'>
                <div className=' flex gap-3 justify-center items-center'>
                  {popup === 'success' ? (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M16.334 2.75018H7.665C4.644 2.75018 2.75 4.88918 2.75 7.91618V16.0842C2.75 19.1112 4.635 21.2502 7.665 21.2502H16.333C19.364 21.2502 21.25 19.1112 21.25 16.0842V7.91618C21.25 4.88918 19.364 2.75018 16.334 2.75018Z'
                        stroke='#3AC430'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M8.43945 12.0002L10.8135 14.3732L15.5595 9.6272'
                        stroke='#3AC430'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  ) : popup === 'warning' ? (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M4.81409 20.4368H19.1971C20.7791 20.4368 21.7721 18.7268 20.9861 17.3528L13.8001 4.78781C13.0091 3.40481 11.0151 3.40381 10.2231 4.78681L3.02509 17.3518C2.23909 18.7258 3.23109 20.4368 4.81409 20.4368Z'
                        stroke='#EF4949'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M12.002 13.4148V10.3148'
                        stroke='#EF4949'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M11.995 16.5H12.005'
                        stroke='#EF4949'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  ) : (
                    ''
                  )}
                  <div
                    className={`flex flex-col   gap-1 justify-center items-center $padding{
                      popup === 'question' ? 'px-20 text-center' : ''
                    }`}
                  >
                    <p>{subtitle}</p>
                  </div>
                </div>
                <p
                  className={`${
                    popup === 'question'
                      ? 'hidden'
                      : 'text-textgray font-normal text-sm text-center mt-5'
                  }`}
                >
                  {popupmsg}
                </p>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            paddingBottom: '1rem',
          }}
        >
          <div>
            {popup === 'success' ? (
              <ButtonComponent onClick={handleOkay} variant='contained' borderRadius='8px'>
                Okay
              </ButtonComponent>
            ) : (
              <ButtonComponent onClick={Confirmation} variant='contained' borderRadius='8px'>
                {popup === 'success' ? 'Okay' : popup === 'warning' ? 'Yes' : 'Save'}
              </ButtonComponent>
            )}
          </div>
          <div className={`${popup === 'success' ? 'hidden' : ''}`}>
            <ButtonComponent
              onClick={() => {
                handleNo()
                handleClickOpen(popup, false)
              }}
              variant='outlined'
              borderRadius='8px'
            >
              No
            </ButtonComponent>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Popup

Popup.defaultProps = {
  popup: '',
  title: '',
  subtitle: '',
  popupmsg: '',
  Confirmation: function test() {},
  handleOkay: function test() {},
  open: false,
  handleClickOpen: function test() {},
}
