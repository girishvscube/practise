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
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CreatePoc } from '../../../../features/customer/pocSlice'

import React, { useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import CustomCheckbox from './../../../common/input/Checkbox'

import { fetchOrdersList, fetchOrderCount } from '../../../../features/orders/orderSlice'
import { fetchConfirmedOrders } from '../../../../features/PurchaseOrders/purchaseOrderSlice'
import moment from 'moment'
import axiosInstance from './../../../../utils/axios'
import { showToastMessage, uuid } from '../../../../utils/helpers'
import { formLabelClasses } from '@mui/material'

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
          <img src={CloseSquareLight} alt='' />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}
interface PopUpProps {
  handleClickOpen?: any
  handleClose?: any
  open?: any
  customer_id?: any
  PoId: any
  linkedSos: any
  getLinkedSOs: any
  setLoading: any
}
const CustomizedDialogs = ({
  open,
  handleClickOpen,
  handleClose,
  customer_id,
  PoId,
  linkedSos,
  getLinkedSOs,
  setLoading,
}: PopUpProps) => {
  const [orders, setOrders] = useState([])
  const [disablebtn, setDisablebtn] = useState(false)

  const LinkSOs = async () => {
    setLoading(true)
    setDisablebtn(true)
    let list = orders
      ?.filter((item: any) => {
        if (item.checked === true) {
          return item
        }
      })
      .map((item: any) => {
        return item.id
      })

    axiosInstance
      .put(`admin/purchase-sales-order/${PoId}`, { so_ids: list })
      .then((response) => {
        console.log('Likned', response.data.data.message)
        handleClose()
        setLoading(false)
        getConfirmedOrders()
        getLinkedSOs()
        showToastMessage(response.data.data.message, 'success')
        setDisablebtn(false)
      })
      .catch((error) => {
        console.log('error:', error)
        setLoading(false)
        setDisablebtn(false)
        showToastMessage(error.response.data.errors.message, 'error')
      })

    console.log('list:', list)
  }

  const getConfirmedOrders = async () => {
    axiosInstance
      .get('/admin/purchase-sales-order/orders/confirmed')
      .then((response: any) => {
        let list = response.data.data
        list.map((item: any) => {
          item['checked'] = false
        })
        setOrders(list)
      })
      .catch((error: any) => {
        // console.log('error:', error)
      })
  }

  useEffect(() => {
    getConfirmedOrders()
    setDisablebtn(false)
  }, [linkedSos])

  const handleChange = (id: any, e: any) => {
    const SO: any = [...orders]
    let index = SO.findIndex((x: any) => x.id === id)

    if (index !== -1) {
      SO[index]['checked'] = e.target.checked
    }
    setOrders(SO)
    setDisablebtn(false)
    // console.log('SO:', SO)
  }

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
          <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
            <div className='flex justify-start h-5'>
              <p className='font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white'>
                Link Orders
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className=''>
              <TableContainer component={Paper}>
                {orders?.length > 0 ? (
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
                          'Select ',
                          'Order ID',
                          'Ordered Date',
                          'Order type',
                          'Fuel Quantity',
                          'Delivery Date',
                          'Delivery Time Slot',
                        ].map((item) => (
                          <TableCell key={uuid()} align='center'>
                            <span className='text-xs text-textgray font-nunitoRegular'>{item}</span>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders?.length > 0 &&
                        orders?.map((item: any) => (
                          <TableRow
                            key={uuid()}
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell align='center'>
                              <CustomCheckbox
                                handleCheck={(e: any) => handleChange(item.id, e)}
                                ischecked={item?.checked}
                                color='text-textgray'
                                name='remember'
                                Label=''
                              />
                            </TableCell>
                            <TableCell align='center'>{item?.id}</TableCell>
                            <TableCell align='center'>
                              {moment(item?.created_at).format('DD-MM-YYYY')}
                            </TableCell>
                            <TableCell align='center'>
                              <p className='flex justify-center items-center'>
                                {item?.order_type} &nbsp;
                              </p>
                            </TableCell>
                            <TableCell align='center'>{item?.fuel_qty}</TableCell>

                            <TableCell align='center'>
                              {moment(item?.delivery_date).format('DD-MM-YYYY')}
                            </TableCell>
                            <TableCell align='center'>{item?.time_slot}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className='rounded-lg w-full bg-darkGray p-8'>
                    <p className='text-xl font-nunitoRegular text-center text-white '>
                      No POCs Found !
                    </p>
                  </div>
                )}
              </TableContainer>
            </div>
          </DialogContent>
          <div className='flex justify-center pt-2 pb-10 h-[72px]'>
            <CustomButton
              disabled={disablebtn}
              onClick={LinkSOs}
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
