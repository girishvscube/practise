import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import { Tooltip } from '@mui/material'

import { useNavigate } from 'react-router-dom'
import { encryptData } from '../../../../utils/encryption'
import { uuid } from './../../../../utils/helpers'
interface BasicTableProps {
  cols: any
  data: any
}

const width = window.innerWidth
// console.log('width:', width);

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#FFFFFF',
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

const BasicTable = ({ cols, data }: BasicTableProps) => {
  const navigate = useNavigate()
  const classes = useStyles()

  const handleNavigate = (id: any) => {
    navigate(`/customers/view/${encryptData(id)}`)
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#404050', alignItems: 'center' }}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: 'none',
          },
          minWidth: 650,
          border: '1px solid #404050',
          borderCollapse: 'separate',
          borderSpacing: width < 768 ? '0px 3px' : '0px 20px',
          px: '24px',
          borderRadius: '8px',

          paddingTop: 0,
          paddinBottom: width < 768 ? '12px' : '24px',
          paddingRight: width < 768 ? '12px' : '24px',
          paddingLeft: width < 768 ? '12px' : '24px',
          // padding: width < 768 ? '12px' : '24px',
          // padding: width < 768 && '12px',
          '& .css-zvlqj6-MuiTableCell-root': {
            padding: ' 0 !important',
          },
          '& .MuiTableCell-head': {
            padding: ' 0 !important',
          },
        }}
        className={classes.root}
        aria-label='simple table'
      >
        <TableHead>
          <TableRow>
            {cols.map((header: any) => (
              <TableCell
                key={uuid()}
                align='center'
                sx={{ color: '#6A6A78', paddingBottom: width < 768 ? '1rem' : 0 }}
              >
                <p className='text-xs'>{header.title}</p>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length ? (
            data.map((item: any) => (
              <TableRow
                key={uuid()}
                sx={{ height: '16px', backgroundColor: '#151929', padding: 0 }}
                className={classes.tr}
              >
                <TableCell sx={{ padding: '8px' }} align='center'>
                  {item.id}
                </TableCell>
                <TableCell sx={{ padding: '8px' }} align='center'>
                  {item.company_name}
                </TableCell>
                <TableCell sx={{ padding: '8px' }} align='center'>
                  {item.customer_type}
                </TableCell>
                <TableCell sx={{ padding: '8px' }} align='center'>
                  {item?.email}
                  <br />
                  +91 {item.phone}
                </TableCell>
                <TableCell sx={{ padding: '8px' }} align='center'>
                  {item?.user_name}
                </TableCell>
                <TableCell sx={{ padding: '8px' }} align='center'>
                  {item?.order_count}
                </TableCell>

                <TableCell sx={{ padding: '8px' }} align='center'>
                  {item.total_revenue ?? '--'}
                </TableCell>

                <TableCell sx={{ padding: '8px' }} align='center'>
                  <div className='flex justify-center'>
                    <Tooltip title='View Customer'>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        onClick={() => {
                          handleNavigate(item.id)
                        }}
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
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>
              <p>No Results found !!</p>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BasicTable
