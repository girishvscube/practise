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
import { DeletePoc } from '../../../../features/customer/pocSlice'
// import AddPocForm from '../../Customer/View/AddPocForm';
// import AddMorePoc from './AddMorePoc';
import { useState, useEffect } from 'react'
import { DateRangePicker } from '../../../common/input/DateRangePicker'
import { SelectInput } from '../../../common/input/Select'
import { Pagination } from '../../../common/Pagination/Pagination'
import axiosInstance from '../../../../utils/axios'
import moment from 'moment'
import { uuid } from './../../../../utils/helpers'

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
const CustomerPayments: React.FC<Props> = ({ cust_id }) => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state: any) => state.poc)

  const initialValues = {
    customer_id: '',
    poc_name: '',
    phone: '',
    email: '',
    designation: '',
    image: '',
  }

  const [payments, setPayments] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const classes = useStyles()

  useEffect(() => {
    // dispatch(getCustomerPayments(cust_id, currentPage))

    const getpayments = async () => {
      axiosInstance
        .get(`/admin/customers/view/payments/${cust_id}?page=${currentPage}`)
        .then((response) => {
          // console.log(response)
          setPayments(response?.data?.data)
        })
        .catch(() => {
          // console.log(error)
        })
    }
    getpayments()
  }, [currentPage])

  return (
    <div className='divstyles bg-lightbg '>
      <div className='  flex items-center justify-between'>
        <p className='font-black  text-lg'>Transactions</p>

        <div className='  flex  gap-x-4'>
          <SelectInput
            width='135px'
            options={[
              { id: 1, name: 'All' },
              { id: 2, name: 'dada' },
              { id: 3, name: 'danger' },
            ]}
            handleChange={() => {}}
            value='1'
            error={false}
            helperText=''
            label='Select Role'
            name='role_id'
          />

          <div className='sm:block hidden'>
            <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
          </div>
        </div>
      </div>
      <br className='sm:hidden block' />
      <div className='block sm:hidden'>
        <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
      </div>
      <br />
      <div className='rounded-lg w-full bg-darkGray '>
        {isLoading ? (
          <div className='w-full h-96 flex justify-center items-center'>
            <CircularProgress />
            <span className='text-3xl'>Loading...</span>
          </div>
        ) : (
          <>
            <TableContainer component={Paper}>
              {payments?.length > 0 ? (
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
                        'Tran ID',
                        'Due Date ',
                        'Trans Date',
                        'Billed Amount ',
                        'Due interest Late Fee',
                        'Paid Amount',
                        'Amount Due',
                        'Payment Status',
                        'Action',
                      ].map((item) => (
                        <TableCell key={uuid()} align='center'>
                          <span className='text-xs text-textgray font-nunitoRegular'>{item}</span>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments?.length > 0 &&
                      payments?.map((item: any) => (
                        <TableRow
                          key={uuid()}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align='center'>{item?.id}</TableCell>

                          <TableCell align='center' />
                          <TableCell align='center'>
                            {moment(item?.created_at).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell align='center'>₹{Math.ceil(item?.grand_total)}</TableCell>
                          <TableCell align='center' />
                          <TableCell align='center' />
                          <TableCell align='center' />
                          <TableCell align='center'>{item?.status}</TableCell>
                          <TableCell align='center'>
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
                                d='M14.7369 2.76175H8.08489C6.00489 2.75375 4.30089 4.41075 4.25089 6.49075V17.2277C4.20589 19.3297 5.87389 21.0697 7.97489 21.1147C8.01189 21.1147 8.04889 21.1157 8.08489 21.1147H16.0729C18.1629 21.0407 19.8149 19.3187 19.8029 17.2277V8.03775L14.7369 2.76175Z'
                                stroke='#3AC430'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M14.4746 2.75V5.659C14.4746 7.079 15.6236 8.23 17.0436 8.234H19.7976'
                                stroke='#3AC430'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M11.6426 15.9492V9.9082'
                                stroke='#3AC430'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M9.29688 13.5947L11.6419 15.9497L13.9869 13.5947'
                                stroke='#3AC430'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='rounded-lg w-full bg-darkGray p-8'>
                  <p className='text-xl font-nunitoRegular text-center text-white '>
                    Oops, No Payments Found !
                  </p>
                </div>
              )}
            </TableContainer>
          </>
        )}

        {/* <div className="py-4">
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
          type="create"
        />
      </div> */}
      </div>
      <Pagination
        className='pagination-bar'
        currentPage={currentPage}
        totalCount={payments?.length}
        pageSize={10}
        onPageChange={(page: any) => setCurrentPage(page)}
      />
    </div>
  )
}

export default CustomerPayments
