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
import { useEffect, useState } from 'react'
import { fetchPocByOrder } from '../../../../features/orders/orderSlice'
import moment from 'moment'

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
  trackingData: any
  loading: any
}
const TrackingTable: React.FC<Props> = ({ trackingData, loading }) => {
  console.log('trackingData:', trackingData)
  const classes = useStyles()

  return (
    <div className='rounded-lg w-full bg-darkGray '>
      {
        <>
          <TableContainer component={Paper}>
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
                  {['Date & Time', 'Description']?.map((item) => (
                    <TableCell align='center'>
                      <span className='text-xs text-textgray font-nunitoRegular'>{item}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {trackingData ? (
                <TableBody>
                  <TableRow
                    key={'item?.name'}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align='center'>{trackingData?.created_at}</TableCell>
                    <TableCell align='center'>
                      <p className=' text-xs text-textgray pt-1'>
                        Order Status:{' '}
                        <span className='text-sm text-white text-righ'>
                          {trackingData?.current_status}
                        </span>
                      </p>
                    </TableCell>
                  </TableRow>
                  {trackingData?.pos?.po_id && (
                    <TableRow
                      key={'item?.name'}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align='center'>
                        {moment(trackingData?.pos?.created_at).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align='left'>
                        <p>{trackingData?.pos?.po_id ? 'Po Linked' : ''}</p>
                        <div className='flex justify-between'>
                          <p className=' text-xs text-textgray pt-1'>PoNo</p>
                          <p className='text-sm text-white text-righ'>{trackingData?.pos?.po_id}</p>
                        </div>
                        <div className='flex justify-between'>
                          <p className=' text-xs text-textgray pt-1'>Supplier</p>
                          <p className='text-sm text-white text-righ'>
                            {trackingData?.pos?.purchase_order?.supplier.name}
                          </p>
                        </div>
                        <div className='flex justify-between'>
                          <p className=' text-xs text-textgray pt-1'>Bowser</p>
                          <p className='text-sm text-white text-righ'>
                            {trackingData?.pos?.purchase_order?.bowser?.name}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {trackingData?.trip?.id && (
                    <TableRow
                      key={'item?.name'}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align='center'>
                        {moment(trackingData?.trip?.created_at).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align='left'>
                        <p>{trackingData?.trip?.id ? 'Trip Scheduled' : ''}</p>
                        <div className='flex justify-between'>
                          <p className=' text-xs text-textgray pt-1'>TripID:</p>
                          <p className='text-sm text-white text-righ'>{trackingData?.trip?.id}</p>
                        </div>
                        <div className='flex justify-between'>
                          <p className=' text-xs text-textgray pt-1'>Trip Start time:</p>
                          <p className='text-sm text-white text-righ'>
                            {moment(trackingData?.trip?.start_time).format('DD-MM-YYYY')}
                          </p>
                        </div>
                        <div className='flex justify-between'>
                          <p className=' text-xs text-textgray pt-1'>Scheduled Delivery time:</p>
                          <p className='text-sm text-white text-right'>
                            {moment(trackingData?.trip?.end_time).format('DD-MM-YYYY')}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {trackingData?.current_status?.toLowerCase()?.includes('out') && (
                    <TableRow
                      key={'item?.name'}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align='center'>{trackingData?.created_at}</TableCell>
                      <TableCell align='center'>{trackingData?.current_status}</TableCell>
                    </TableRow>
                  )}

                  {trackingData?.current_status?.toLowerCase()?.includes('delivered') && (
                    <TableRow
                      key={'item?.name'}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align='center'>{trackingData?.created_at}</TableCell>
                      <TableCell align='center'>{trackingData?.current_status}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              ) : (
                <div className='rounded-lg w-full bg-darkGray p-8'>
                  <p className='text-xl font-nunitoRegular text-center text-white '>
                    No Orders found to track !
                  </p>
                </div>
              )}
            </Table>
          </TableContainer>
        </>
      }
    </div>
  )
}

export default TrackingTable
