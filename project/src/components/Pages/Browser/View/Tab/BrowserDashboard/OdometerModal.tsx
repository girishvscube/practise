import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseSquareLight from '../../../../../../assets/icons/lightIcons/CloseSquareLight.svg'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { CircularProgress } from '@mui/material'

const useStyles = makeStyles(() => ({
    root: {
        '& td ': {
            color: '#FFFFFF',
        },
        '& th ': {
            color: '#6A6A78',
        },
    },
    tr: {
        '& td:first-child ': {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
        },
        '& td:last-child ': {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
        },
    },
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        width: '100%',
        alignItems: 'center',
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
                    <img src={CloseSquareLight} alt='hhh' />
                </IconButton>
            ) : null}
        </DialogTitle>
    )
}
interface PopUpProps {
    handleClickOpen?: any
    handleClose?: any
    open?: any,
    data?: any,
    loading?: any
}
const CustomizedDialogs = ({
    open,
    handleClose,
    data,
    loading
}: PopUpProps) => {

    const classes = useStyles()

    return (
        <div className=''>
            <div>
                <BootstrapDialog
                    sx={{
                        '& .MuiBackdrop-root': {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(5px)',
                        },
                        '& .MuiDialog-container': {
                            '& .MuiPaper-root': {
                                width: '100%',
                                maxWidth: '67rem', // Set your width here
                            },
                        },
                    }}
                    onClose={handleClose}
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
                    <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
                        <div className='flex justify-start h-5'>
                            <p className='font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white'>
                                Odometer and Time info
                            </p>
                        </div>
                    </BootstrapDialogTitle>
                    <DialogContent>
                        <div className=''>
                            <TableContainer component={Paper}>
                                {
                                    loading ? <div className='w-full  flex justify-center items-center'>
                                        <CircularProgress />
                                        <span className='text-3xl'>Loading...</span>
                                    </div> : <>
                                        {data?.length > 0 ? (
                                            <Table
                                                aria-label='simple table'
                                                sx={{
                                                    [`& .${tableCellClasses.root}`]: {
                                                        borderBottom: '1px solid #404050',
                                                    },
                                                    minWidth: 650,
                                                    //   border: '1px solid #404050',
                                                    borderCollapse: 'separate',
                                                    borderSpacing: '0',
                                                    // px: '24px',
                                                    background: '#151929',
                                                    borderRadius: '8px',
                                                    '& .css-zvlqj6-MuiTableCell-root': {
                                                        padding: 0,
                                                    },
                                                }}
                                                className={classes.root}
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        {[
                                                            'PO/SO No. ',
                                                            'Depart Time',
                                                            'Odo Meter Start(Km)',
                                                            'Odo Meter End(Km)',
                                                            'Time Travelled',
                                                            'Distance Travelled(Km)',
                                                        ].map((item) => (
                                                            <TableCell align='center'>
                                                                <span className='text-xs text-textgray font-nunitoRegular'>{item}</span>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.length > 0 &&
                                                        data?.map((item: any) => (
                                                            <TableRow

                                                                sx={{
                                                                    '&:last-child td, &:last-child th': {
                                                                        border: 0,
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell align='center'>
                                                                    {item?.po_id || item?.so_id}
                                                                </TableCell>
                                                                <TableCell align='center'>
                                                                    {moment(item?.start_time).format('LT')}
                                                                </TableCell>
                                                                <TableCell align='center'>
                                                                    {item?.odometer_start}
                                                                </TableCell>
                                                                <TableCell align='center'>
                                                                    {item?.odometer_end}
                                                                </TableCell>
                                                                <TableCell align='center'>
                                                                    {moment(item?.start_time).format('LT')}
                                                                </TableCell>

                                                                <TableCell align='center'>
                                                                    {item?.odometer_end - item?.odometer_start}
                                                                </TableCell>

                                                            </TableRow>
                                                        ))}


                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className='rounded-lg w-full bg-darkGray p-8'>
                                                <p className='text-xl font-nunitoRegular text-center text-white '>
                                                    No Odometer Found !
                                                </p>
                                            </div>
                                        )}
                                    </>
                                }
                            </TableContainer>
                        </div>
                    </DialogContent>
                    <div className='flex justify-center pt-2 pb-10 h-[72px]'>

                    </div>
                </BootstrapDialog>
            </div>
        </div>
    )
}
export default CustomizedDialogs
