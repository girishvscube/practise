import { useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import Status from '../../../common/Status'
import moment from 'moment'
import CustomMenu from '../../../common/CustomMenu/CustomMenu'
import { encryptData } from '../../../../utils/encryption'
import axiosInstance from './../../../../utils/axios'

interface BasicTableProps {
  cols: any
  data: any
}

const width = window.innerWidth

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

const OrderTable = ({ cols, data }: BasicTableProps) => {
  const classes = useStyles()

  const [actionIcon, setactionIcon] = useState(1)

  const getMenuOptions = (item: any) => {
    let options = [
      { title: 'View PO', link: `/purchase-orders/\view/${actionIcon}` },

      { title: 'Download PO', link: '' },
    ]

    if (item.payment_status === 'PAID') {
      options = [
        ...options,
        ...[
          { title: 'Send PO to Supplier', link: '' },
          { title: 'Download PO', link: '' },
        ],
      ]
    }
    if (item.status === 'PO_CANCELLED') options.pop()

    if (item.status !== 'PO_CONFIRMED') {
      options.push({ title: 'Supplier Confirm PO', link: '' })
    }

    if (item.status === 'PO_CANCELLED') options.pop()

    return options
  }
  const [anchorEl, setAnchorEl] = useState(null as any)

  const handleMenu = (index, event: any) => {
    setAnchorEl({ [index]: event.currentTarget })
  }

  const CloseMenu = () => {
    setAnchorEl(null)
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
          padding: width < 768 ? '12px' : '24px',
          '& .css-zvlqj6-MuiTableCell-root': {
            padding: 0,
          },
          '& .MuiTableCell-head': {
            padding: 0,
          },
        }}
        className={classes.root}
        aria-label='simple table'
      >
        <TableHead>
          <TableRow>
            {cols.map((header: any) => (
              <TableCell align='center' sx={{ color: '#6A6A78' }}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item: any, index: number) => (
            <TableRow sx={{ height: '16px', backgroundColor: '#151929' }} className={classes.tr}>
              <TableCell align='center'>{item?.id}</TableCell>

              <TableCell align='center'>
                {moment(item?.created_at).format('LT')}
                <br />
                {moment(item?.created_at).format('YYYY/MM/DD')}
              </TableCell>

              <TableCell align='center'>{item?.supplier?.name}</TableCell>

              <TableCell align='center'>{item?.fuel_qty}</TableCell>

              <TableCell align='center'>NA</TableCell>

              <TableCell align='center'>
                <div className='flex justify-center'>
                  <Status>{item?.status}</Status>
                </div>
              </TableCell>
              {
                <TableCell align='right'>
                  <div className='flex justify-center'>
                    <CustomMenu
                      MenuOptions={getMenuOptions(item)}
                      defaultId={actionIcon}
                      Open={Boolean(anchorEl && anchorEl[index])}
                      anchorEl={anchorEl && anchorEl[index]}
                      handleMenu={(e: any) => handleMenu(index, e)}
                      CloseMenu={CloseMenu}
                    >
                      <svg
                        onClick={() => {
                          // console.log(item.id);
                          setactionIcon(item?.id)
                        }}
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M5.67 0H14.34C17.73 0 20 2.38 20 5.92V14.09C20 17.62 17.73 20 14.34 20H5.67C2.28 20 0 17.62 0 14.09V5.92C0 2.38 2.28 0 5.67 0ZM5.52031 11.2C4.86031 11.2 4.32031 10.66 4.32031 10C4.32031 9.33999 4.86031 8.80099 5.52031 8.80099C6.18031 8.80099 6.72031 9.33999 6.72031 10C6.72031 10.66 6.18031 11.2 5.52031 11.2ZM8.80078 10C8.80078 10.66 9.34078 11.2 10.0008 11.2C10.6608 11.2 11.2008 10.66 11.2008 10C11.2008 9.33999 10.6608 8.80099 10.0008 8.80099C9.34078 8.80099 8.80078 9.33999 8.80078 10ZM13.2812 10C13.2812 10.66 13.8212 11.2 14.4812 11.2C15.1413 11.2 15.6713 10.66 15.6713 10C15.6713 9.33999 15.1413 8.80099 14.4812 8.80099C13.8212 8.80099 13.2812 9.33999 13.2812 10Z'
                          fill={`${
                            item.id === actionIcon && Boolean(anchorEl && anchorEl[index])
                              ? '#FFCD2C'
                              : '#FFFFFF'
                          }`}
                        />
                      </svg>
                    </CustomMenu>
                  </div>
                </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default OrderTable
