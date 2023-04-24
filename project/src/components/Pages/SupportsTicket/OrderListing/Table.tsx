import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { ToolTip } from './ToolTip'
import { Tooltip } from '@mui/material'

interface BasicTableProps {
  cols: any
  data: any
}

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

let paddingX = '24px'
if (window.innerWidth < 1024) {
  paddingX = '10px'
}

const BasicTable = ({ cols, data }: BasicTableProps) => {
  const navigate = useNavigate()
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const Open = Boolean(anchorEl)
  const [order, setOrder] = React.useState()
  const handleMenu = (event: any, item: any) => {
    setAnchorEl(event.currentTarget)
    setOrder(item)
  }
  const CloseMenu = () => {
    setAnchorEl(null)
  }

  const handleNavigate = (id: any) => {
    navigate(`/sales/orders/view/${id}`)
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
          borderSpacing: '0px 20px',
          px: paddingX,
          borderRadius: '8px',
          '& .css-zvlqj6-MuiTableCell-root': {
            padding: 0,
          },
        }}
        className={classes.root}
        aria-label='simple table'
      >
        <TableHead>
          <TableRow>
            {cols.map((header: any) => (
              <TableCell align='center' sx={{ color: '#6A6A78', padding: 0 }}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow sx={{ height: '16px', backgroundColor: '#151929' }} className={classes.tr}>
              <TableCell align='center'>{item.id}</TableCell>
              <TableCell align='center'>{moment(item?.created_at).format('DD/MM/YYYY')}</TableCell>
              <TableCell align='center'>
                {item?.customer?.company_name}
                <br />{' '}
                {item?.customer?.phone ? (
                  <div>
                    +91
                    {item?.customer?.phone}
                  </div>
                ) : null}
              </TableCell>
              <TableCell align='center'>
                <div className='flex items-center justify-center'>
                  <div>{item?.customer_delivery_detail?.state}</div>
                  <div>
                    <ToolTip value={item} />
                  </div>
                </div>
              </TableCell>

              <TableCell align='center'>
                <div className='flex justify-center'>
                  <Tooltip title='View'>
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BasicTable
