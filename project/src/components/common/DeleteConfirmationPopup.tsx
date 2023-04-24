import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SxProps } from '@mui/material'
import ButtonComponent from './Button'
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
export default function AlertDialog({ open, handleClose, popup, handleDelete, button }) {
    const DialogContentSx: SxProps = {
        color: popup === 'success' ? '#57CD53' : popup === 'warning' ? '#EF4949' : 'white',
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '22px',
    }

    return (
        <div>
            <Dialog
                sx={dialogSx}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={DialogContentSx} >
                        <div className=' bg-darkbg rounded-lg py-5 mt-2'>
                            <div className=' flex gap-3 justify-center items-center'>

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

                                <div>
                                    <p>Do You Really Want to Delete?</p>
                                </div>
                            </div>

                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    paddingBottom: '24px',
                }}>
                    {/* <Button onClick={handleClose}>Disagree</Button> */}
                    <ButtonComponent
                        onClick={() => {
                            handleDelete()
                        }}
                        variant='contained'
                        borderRadius='8px'
                        disabled={button}
                    >
                        Yes
                    </ButtonComponent>
                    <ButtonComponent
                        onClick={() => {
                            handleClose()
                        }}
                        variant='outlined'
                        borderRadius='8px'
                        disabled={button}
                    >
                        No
                    </ButtonComponent>
                </DialogActions>
            </Dialog>
        </div>
    );
}
