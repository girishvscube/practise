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
import { getCustomerOrders } from '../../../../features/customer/customerSlice'
import moment from 'moment'

// import userDefault from '../../../../assets/icons/user/user_default.svg';
import Profile from '../../../../assets/icons/filledIcons/AddUser.svg'
// import Profile from '../../../../assets/icons/filledIcons/AddUser.svg'
// import AddPocForm from '../../Customer/View/AddPocForm';
// import AddMorePoc from './AddMorePoc';
import { useState, useMemo, useEffect } from 'react'
import { DateRangePicker } from '../../../common/input/DateRangePicker'
import CustomButton from '../../../common/Button'
import { Link } from 'react-router-dom'
import { Pagination } from '../../../common/Pagination/Pagination'
import { DateFiter } from './../../../common/DateFiter'
import { uuid } from './../../../../utils/helpers'
import axiosInstance from './../../../../utils/axios'

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
  pocList?: any
  cust_id?: any
  orderId?: any
}
const CustomerOrders: React.FC<Props> = ({ cust_id }) => {
  const dispatch = useDispatch()

  // const { orders, totalOrders, totalAmount } = useSelector((state: any) => state.customer)

  const [currentPage, setCurrentPage] = useState(1)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [ordersMeta, setOrdersMeta] = useState({
    totalAmount: '',
    totalOrders: '',
  })

  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })

  console.log('date:', date)

  // console.log('currentPage:', currentPage, totalOrders)

  const classes = useStyles()

  const onDateSelect = (date: any) => {
    setDate(date)
  }

  const fetchCustomerOrders = () => {
    axiosInstance
      .get(
        `/admin/customers/orders/${cust_id}?page=${currentPage}&start_date=${date.start_date}&end_date=${date.end_date}`,
      )
      .then((response) => {
        console.log('response:', response.data)
        setLoading(false)
        setOrders(response.data.data.data)
        setOrdersMeta({
          ...ordersMeta,
          totalAmount: response.data.total_order_amount,
          totalOrders: response.data.total_count,
        })
      })
      .catch((error) => {
        setLoading(false)
        console.log('error:', error)
      })
  }

  useEffect(() => {
    fetchCustomerOrders()
  }, [currentPage, date.end_date])

  return (
    <div className='divstyles bg-lightbg '>
      {/* Heading and date filter */}
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Orders </p>
        <div className='hidden sm:block'>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>
      <div className='w-full sm:hidden '>
        <br />
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>
      <br />

      {/* Order Analytics */}
      <div className='subdiv sm:flex-row flex-col flex justify-between'>
        <div className='border-border sm:px-4 w-full  sm:w-4/12 sm:border-r flex  gap-x-4 items-center '>
          <p className='text-xs text-textgray'>
            Total Orders: &nbsp;
            <span className='text-lg text-white font-bold'>{ordersMeta?.totalOrders}</span>
          </p>
        </div>
        <div className='border-border sm:px-4 w-full sm:w-5/12 sm:border-r flex gap-x-2 items-center '>
          <p className='text-xs text-textgray'>
            Total Order Value: &nbsp;
            <span className='text-lg text-white font-bold'>₹ {ordersMeta?.totalAmount ?? 0}</span>
          </p>
        </div>
        <div className='flex w-full sm:w-4/12 justify-center sm:justify-end'>
          <Link to={`/sales/orders/create?cust_id=${cust_id}`}>
            <CustomButton
              width='w-fit'
              variant='outlined'
              size='large'
              icon={<img src={Profile} alt='' />}
              borderRadius='20px'
            >
              Create New Order
            </CustomButton>
          </Link>
        </div>
      </div>

      <br />
      {/* Order List */}
      <div className='rounded-lg w-full bg-darkGray '>
        {loading ? (
          <div className='w-full h-96 flex justify-center items-center'>
            <CircularProgress />
            <span className='text-3xl'>Loading...</span>
          </div>
        ) : (
          <>
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
                        'Order ID',
                        'Order  Dates',
                        'Qty',
                        'Order Value',
                        'Payment Status',
                        'Order Status',
                        'Action',
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
                          <TableCell align='center'>{item?.id}</TableCell>

                          <TableCell align='center'>
                            {moment(item?.created_at).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell align='center'>{item?.fuel_qty} L</TableCell>
                          <TableCell align='center'>₹ {item?.grand_total}</TableCell>

                          <TableCell align='center'>
                            <p
                              className={`${
                                item?.payment_status === 'Paid'
                                  ? 'text-limeGreen'
                                  : 'text-errortext'
                              }`}
                            >
                              {item?.payment_status}
                            </p>
                          </TableCell>

                          <TableCell align='center'>
                            <p
                              className={`${
                                item?.status === 'DELIVERED'
                                  ? 'text-limeGreen'
                                  : item?.status === 'ORDER_PROCESSING'
                                  ? 'text-metallicSilver'
                                  : item?.status === 'ORDER_CONFIRMED'
                                  ? 'text-yellowOrange'
                                  : item?.status === 'PO_LINKED'
                                  ? 'text-vividYellow'
                                  : item?.status === 'DISPATCHED'
                                  ? 'text-azure'
                                  : 'text-errortext'
                              }`}
                            >
                              {item?.status}
                            </p>
                          </TableCell>

                          <TableCell align='center' sx={{ padding: '0px' }}>
                            <div className='flex justify-center'>
                              <Link to={`/sales/orders/view/${item?.id}`}>
                                <svg
                                  width='24'
                                  height='24'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='cursor-pointer'
                                >
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M15.1609 12.0532C15.1609 13.7992 13.7449 15.2142 11.9989 15.2142C10.2529 15.2142 8.83789 13.7992 8.83789 12.0532C8.83789 10.3062 10.2529 8.89124 11.9989 8.89124C13.7449 8.89124 15.1609 10.3062 15.1609 12.0532Z'
                                    stroke='#3AC430'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M11.998 19.355C15.806 19.355 19.289 16.617 21.25 12.053C19.289 7.48898 15.806 4.75098 11.998 4.75098H12.002C8.194 4.75098 4.711 7.48898 2.75 12.053C4.711 16.617 8.194 19.355 12.002 19.355H11.998Z'
                                    stroke='#3AC430'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />
                                </svg>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='rounded-lg w-full bg-darkGray p-8'>
                  <p className='text-xl font-nunitoRegular text-center text-white '>
                    No Orders found !
                  </p>
                </div>
              )}
            </TableContainer>
          </>
        )}
      </div>
      <Pagination
        className='pagination-bar'
        currentPage={currentPage}
        totalCount={ordersMeta?.totalOrders}
        pageSize={10}
        onPageChange={(page: any) => setCurrentPage(page)}
      />
    </div>
  )
}

export default CustomerOrders
