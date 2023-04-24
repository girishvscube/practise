import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import userDefault from '../../../../assets/icons/user/user_default.svg'
import { uuid } from './../../../../utils/helpers'
// import AddPocForm from '../../Customer/View/AddPocForm';
import AddMorePoc from './AddMorePoc'
import { useState, useEffect } from 'react'
import { getCustomerPocList } from '../../../../features/customer/pocSlice'
import axiosInstance from './../../../../utils/axios'
import { fetchPocByOrder } from '../../../../features/orders/orderSlice'

import { Tooltip } from '@mui/material'
import Popup from './../../../common/Popup'
import { showToastMessage } from './../../Suppliers/SupplierCreation/Toast'
import AddExtraPocPopup from './AddExtraPocPopup'

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
interface Props {
  pocListByOrder?: any
  customer_id: any
  orderId: any
}
const PocList: React.FC<Props> = ({ pocListByOrder, customer_id, orderId }) => {
  const dispatch = useDispatch()
  const { isLoading, pocList } = useSelector((state: any) => state.poc)

  const [PocId, setPocId] = useState()

  const initialValues = {
    customer_id: '',
    poc_name: '',
    phone: '',
    email: '',
    designation: '',
    image: '',
  }
  const [formErrors, setFormErrors] = useState(initialValues)

  const [params, setParams] = useState(initialValues)

  // useEffect(() => {
  //   dispatch(getpocDropdown(customer_id))
  // }, [customer_id])

  const classes = useStyles()

  const deleteOrderPoc = async (id: any) => {
    setPocId(id)
    OpenDeletePopup('warning', true)
  }

  const DeleteYes = async () => {
    await axiosInstance
      .delete(`/admin/orders/poc/${PocId}`)
      .then((response) => {
        console.log('response:', response)
        OpenDeletePopup('warning', false)
        showToastMessage(response.data.data.message, 'success')
        dispatch(fetchPocByOrder(orderId))
      })
      .catch((error) => {
        showToastMessage(error.response.data.errors.message, 'error')
        console.log('error:', error)
      })
  }
  const DeleteNo = () => {
    OpenDeletePopup('warning', false)
  }

  const [deletePopup, setDeletePopup] = useState({
    success: false,
    warning: false,
    question: false,
  })

  const OpenDeletePopup = (key: any, value: any) => {
    setDeletePopup({ ...deletePopup, [key]: value })
  }

  const [test, setTestPopup] = useState(false)

  const OpenTestPopup = () => {
    setTestPopup(true)
  }
  const CloseTestPopup = () => {
    setTestPopup(false)
  }

  return (
    <div className=' '>
      {isLoading ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            {pocListByOrder.length > 0 ? (
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
                      'Sl No.',
                      'POC Image',
                      'POC Name',
                      'Designation',
                      'Contact Details',
                      'Action',
                    ].map((item) => (
                      <TableCell key={uuid()} align='center'>
                        <span className='text-xs text-textgray font-nunitoRegular'>{item}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pocListByOrder?.length > 0 &&
                    pocListByOrder?.map((item: any) => (
                      <TableRow
                        key={uuid()}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align='center'>{item?.id}</TableCell>

                        <TableCell align='center'>
                          <div className='flex justify-center'>
                            <img
                              className='w-[48px] h-[48px]  rounded-full'
                              src={item?.image ? item?.image : userDefault}
                              alt='user profile'
                            />
                          </div>
                        </TableCell>
                        <TableCell align='center'>{item?.customer_poc?.poc_name}</TableCell>
                        <TableCell align='center'>{item?.customer_poc?.designation}</TableCell>
                        <TableCell align='center'>
                          {item?.customer_poc?.phone}
                          <span>
                            <br />
                          </span>
                          {item?.customer_poc?.email}
                        </TableCell>
                        <TableCell align='center'>
                          <div className='flex justify-center'>
                            <Tooltip title='Delete Poc'>
                              <svg
                                className='cursor-pointer'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                onClick={() => deleteOrderPoc(item?.id)}
                              >
                                <path
                                  d='M19.3238 9.46875C19.3238 9.46875 18.7808 16.2037 18.4658 19.0407C18.3158 20.3957 17.4788 21.1898 16.1078 21.2148C13.4988 21.2618 10.8868 21.2648 8.27881 21.2098C6.95981 21.1828 6.13681 20.3788 5.98981 19.0478C5.67281 16.1858 5.13281 9.46875 5.13281 9.46875'
                                  stroke='#EF4949'
                                  strokeWidth='1.5'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <path
                                  d='M20.708 6.24023H3.75'
                                  stroke='#EF4949'
                                  strokeWidth='1.5'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <path
                                  d='M17.4406 6.23998C16.6556 6.23998 15.9796 5.68498 15.8256 4.91598L15.5826 3.69998C15.4326 3.13898 14.9246 2.75098 14.3456 2.75098H10.1126C9.53358 2.75098 9.02558 3.13898 8.87558 3.69998L8.63258 4.91598C8.47858 5.68498 7.80258 6.23998 7.01758 6.23998'
                                  stroke='#EF4949'
                                  strokeWidth='1.5'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                            </Tooltip>
                          </div>
                        </TableCell>
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

          {/* <div className='py-4'>
            <AddMorePoc
              openUpdate={openUpdate}
              handleClickOpen={handleClickOpen}
              handleClose={handleClose}
              params={params}
              setFormParams={setParams}
              formErrors={formErrors}
              orderId={orderId}
              setFormErrors={setFormErrors}
              customer_id={customer_id}
              type='create'
            />
          </div> */}

          <br />

          <AddExtraPocPopup
            params={params}
            setFormParams={setParams}
            formErrors={formErrors}
            orderId={orderId}
            setFormErrors={setFormErrors}
            customer_id={customer_id}
            type='create'
            isOpen={test}
            ClosePopup={CloseTestPopup}
            OpenPopup={OpenTestPopup}
          />

          <div className=''>
            {/* 1. Warning Popup */}
            <Popup
              Confirmation={DeleteYes}
              handleNo={DeleteNo}
              // open={true}
              open={deletePopup.warning}
              handleClickOpen={OpenDeletePopup}
              popup='warning'
              subtitle='Are you Sure?'
              popupmsg=' Do you really want to delete Poc ?'
            />
          </div>
        </>
      )}
    </div>
  )
}

export default PocList
