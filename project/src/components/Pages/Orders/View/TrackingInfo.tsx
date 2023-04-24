import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import Status from '../../../common/Status'
import { uuid } from './../../../../utils/helpers'
const data = [
  {
    date: '22/08/1985',
    time: '6:23 PM',
    description: 'Order Confirmed',
    location: 'N/A',
    trackingStatus: 'Dispatching Soon',
  },
  {
    date: '22/08/1985',
    time: '6:23 PM',
    description: 'Order Confirmed',
    location: 'N/A',
    trackingStatus: 'Dispatched',
  },
  {
    date: '22/08/1985',
    time: '6:23 PM',
    description: 'Out for Delivery',
    location: 'N/A',
    trackingStatus: 'Delivered',
  },
  {
    date: '22/08/1985',
    time: '6:23 PM',
    description: 'Order Confirmed',
    location: 'Adilabad, Telangana.',
    trackingStatus: 'Dispatching Soon',
  },
  {
    date: '22/08/1985',
    time: '6:23 PM',
    description: 'Order Confirmed',
    location: 'Adilabad, Telangana.',
    trackingStatus: 'Dispatching Soon',
  },
]

const TrackingInfo = () => {
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

  const classes = useStyles()
  return (
    <TableContainer component={Paper}>
      {data.length > 0 ? (
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
              {['Date & Time', 'Description', 'Location', 'Tracking Status'].map((item) => (
                <TableCell key={uuid()} align='center'>
                  <span className='text-xs text-textgray font-nunitoRegular'>{item}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 &&
              data?.map((item: any) => (
                <TableRow key={uuid()} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align='center'>
                    <p>{item.date}</p>
                    <p>{item.time}</p>
                  </TableCell>

                  <TableCell align='center'>{item?.description}</TableCell>

                  <TableCell align='center'>{item?.location}</TableCell>
                  <TableCell align='center'>
                    <Status>{item.trackingStatus}</Status>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className='rounded-lg w-full bg-darkGray p-8'>
          <p className='text-xl font-nunitoRegular text-center text-white '>No POCs Found !</p>
        </div>
      )}
    </TableContainer>
  )
}

export default TrackingInfo
