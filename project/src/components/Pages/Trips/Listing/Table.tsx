import Table from '@mui/material/Table'
import { useState, useEffect } from 'react'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import Status from '../../../common/Status'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import Eye from '../../../../assets/images/Eye.svg'
import ClockYellow from '../../../../assets/images/ClockYellow.svg'
import MultiUser from '../../../../assets/images/MultiUser.svg'
import { encryptData } from '../../../../utils/encryption'
import ArrowDownCircle from '../../../../assets/images/ArrowDownCircle.svg'
import UpCircleLight from '../../../../assets/icons/lightArrows/UpCircleLight.svg'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import { indexOf } from 'lodash'
import ArrowUpCircleYellow from '../../../../assets/images/ArrowUpCircleYellow.svg'
import InfoSquare from '../../../../assets/images/InfoSquare.svg'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import TripsDownloadIcon from '../../../../assets/images/TripsDownloadIcon.svg'
import axiosInstance from '../../../../utils/axios'
import { showToastMessage } from '../../../../utils/helpers'

interface BasicTableProps {
  cols_2: any
  cols: any
  data: any
}

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

  forArrow: {
    '&:hover': {
      cursor: 'pointer',
    },
  },

  insideTable: {
    '& td': {
      padding: '10px !important',
    },
    '& th': {
      padding: '10px !important',
    },
  },

  tooltip: {
    padding: '8px',
    backgroundColor: '#fff',
  },

  purchaseStatus: {
    color: '#3AC430',
  },
}))

const BasicTable = ({ cols, cols_2, data }: BasicTableProps) => {
  console.log('data:', data)
  const navigate = useNavigate()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [rotateArrow, setRotateArrow] = useState(false)
  const [infoDropdown, setInfoDropdown] = useState(false)
  const [inputs, setInputs] = useState(1)

  const [linkedOrders, setLinkedOrders] = useState([])

  // const[numberofpages,setnumberofpages] = useState(1)

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(21, 25, 41, 1)',
      boxShadow: theme.shadows[1],
      fontSize: 14,
      background: '#ffffff',
    },
  }))

  const navigateToView = (id: any) => {
    navigate(`/fleet_manage/trips/view/${encryptData(id)}`)
  }

  const navigateToSchedule = (id: any) => {
    navigate(`/fleet_manage/trips/schedule/${encryptData(id)}`)
  }

  const rotate = rotateArrow ? 'rotate(180deg)' : 'rotate(0)'

  const handleDropdown = (itm) => {
    data.map((e) => {
      // console.log(e.id, itm.id, 'bbbb')
      if (e.id === itm.id) {
        setRotateArrow((rotateArrow) => !rotateArrow)
        setInfoDropdown((infoDropdown) => !infoDropdown)
        // console.log(infoDropdown, 'bbbb')
      }
    })
  }

  const DownloadPOInvoice = (id: any) => {
    axiosInstance
      .get(`/admin/purchase-bill/download/${id}`)
      .then((response) => {
        console.log('response:', response)
        const linkSource = `data:application/pdf;base64,${response.data.data.base64String}`
        const downloadLink = document.createElement('a')
        const fileName = `PurchaseOrder${id}.pdf`
        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()

        showToastMessage('Invoice Downloaded Successfully.', 'success')
      })
      .catch((error) => {
        showToastMessage(error?.response?.data?.errors?.message, 'success')
      })
  }

  const DownloadSOInvoice = (id: any) => {
    axiosInstance
      .get(`/admin/orders/performa-invoice/${id}`)
      .then((response) => {
        console.log('response:', response)
        const linkSource = `data:application/pdf;base64,${response.data.data.base64String}`
        const downloadLink = document.createElement('a')
        const fileName = `Order${id}.pdf`
        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()

        showToastMessage('Invoice Downloaded Successfully.', 'success')
      })
      .catch((error) => {
        showToastMessage(error?.response?.data?.errors?.message, 'success')
      })
  }

  const DownloadInvoices = (id: any, type: string) => {
    console.log('sa', id, type)
    type === 'po' ? DownloadPOInvoice(id) : DownloadSOInvoice(id)
  }

  useEffect(() => {
    axiosInstance
      .get('/admin/trips/associated/10')
      .then((response) => {
        // console.log('response:', response.data.data)
        setLinkedOrders(response.data.data)
      })
      .catch((error) => {
        console.log('error:', error)
      })
  }, [])

  const handleAddStatus = () => {}

  return (
    <div>
      <TableContainer component={Paper}>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: 'none',
            },
            minWidth: 650,
            border: '1px solid #404050',
            borderCollapse: 'separate',
            borderSpacing: '0px 15px',
            px: '24px',
            borderRadius: '8px',
            '& .MuiTableCell-head': {
              padding: 0,
            },
          }}
          className={classes.root}
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              {cols.map((header: any, index: number) => (
                <TableCell key={index} align='center' sx={{ color: '#6A6A78' }}>
                  {header.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item: any, index: any) => (
              <>
                <TableRow
                  key={index}
                  sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }}
                  className={classes.tr}
                >
                  <TableCell align='center'>{item?.id}</TableCell>
                  <TableCell align='center' sx={{ padding: '0px' }}>
                    {item?.po_id}
                  </TableCell>
                  <TableCell align='center'>{item?.bowser_name}</TableCell>
                  <TableCell align='center'>
                    {item?.start_time === '' || item?.start_time === null
                      ? '--'
                      : moment(item?.start_time).format('LT') !== 'Invalid date' &&
                        moment(item?.start_time).format('LT')}
                    <br />
                    {item?.start_time === '' || item?.start_time === null
                      ? '--'
                      : moment(item?.start_time).format('DD/MM/YYYY') !== 'Invalid date' &&
                        moment(item?.start_time).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell align='center'>
                    {item?.end_time === '' || item?.end_time === null
                      ? '--'
                      : moment(item?.end_time).format('LT') !== 'Invalid date' &&
                        moment(item?.end_time).format('LT')}
                    <br />
                    {item?.end_time === '' || item?.end_time === null
                      ? '--'
                      : moment(item?.end_time).format('DD/MM/YYYY') !== 'Invalid date' &&
                        moment(item?.end_time).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell align='center'>
                    {item?.no_orders_delivered + '/' + item?.no_orders_linked}
                  </TableCell>
                  <TableCell align='center'>
                    {' '}
                    {item?.delivered_fuel + '/' + item?.remaining_fuel}
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex justify-center'>
                      <Status>{item?.trip_status}</Status>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex justify-center'>
                      {item?.status === 'SCHEDULED' || item?.status === 'IN_TRANSIT' ? (
                        <Tooltip title='View'>
                          <img
                            src={Eye}
                            alt='action'
                            className='cursor-pointer'
                            onClick={() => {
                              navigateToView(item.id)
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <>
                          <Tooltip title='View'>
                            <img
                              src={Eye}
                              alt='action'
                              className='cursor-pointer'
                              onClick={() => {
                                navigateToView(item.id)
                              }}
                            />
                          </Tooltip>
                          <div className='hidden lg:block h-4 border-r border-border m-1' />
                          <Tooltip title='Schedule'>
                            <img
                              src={ClockYellow}
                              alt='action'
                              className='cursor-pointer'
                              onClick={() => {
                                navigateToSchedule(item.id)
                              }}
                            />
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell align='right'>
                    <div className={classes.forArrow}>
                      <img
                        src={ArrowDownCircle}
                        style={{ transform: rotate, transition: 'all 0.2s linear' }}
                        onClick={() => handleDropdown(item)}
                        alt='arrow'
                      />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={10}
                    sx={{ padding: '0px !important' }}
                  >
                    <Collapse in={infoDropdown} timeout='auto' unmountOnExit>
                      <Box
                        aria-label='simple table'
                        sx={{
                          [`& .${tableCellClasses.root}`]: {
                            borderBottom: '1px solid #404050',
                          },
                          minWidth: 650,
                          //   border: '1px solid #404050',
                          borderCollapse: 'separate',
                          background: '#151929',
                          borderRadius: '8px',
                          '& .css-zvlqj6-MuiTableCell-root': {
                            padding: 0,
                          },
                        }}
                        className={classes.insideTable}
                      >
                        <div className='flex flex-row'>
                          <Table size='small' aria-label='purchases'>
                            <TableHead>
                              <TableRow>
                                {cols_2.map((header: any, index: number) => (
                                  <TableCell key={index} align='center' sx={{ color: '#6A6A78' }}>
                                    {header.title}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* PO */}

                              {/* <TableRow>







                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>

                                <TableCell align='center'>{'item?.purchase_order?.id'}</TableCell>
                              </TableRow> */}

                              {/* So Mapping */}
                              {item?.all_orders?.map((itm: any, indx: any) => (
                                <TableRow
                                  key={indx + 1}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell align='center'>
                                    {itm?.type.toUpperCase()}
                                    {itm?.id}
                                  </TableCell>

                                  <TableCell align='center'>
                                    {moment(itm?.created_at).format('DD-MM-YYYY')}
                                  </TableCell>

                                  <TableCell align='center'>{itm?.name}</TableCell>

                                  <TableCell align='center'>{itm?.fuel_qty} L</TableCell>

                                  <TableCell align='center'>
                                    ₹ {itm?.total_amount.toFixed(2)}
                                  </TableCell>

                                  <TableCell align='center'>
                                    <div className='flex justify-center items-center cursor-pointer '>
                                      {itm?.delivery_location?.city}
                                      <div className='my-auto mx-1'>
                                        <LightTooltip
                                          title={`${itm?.delivery_location?.address}, ${itm?.delivery_location?.city} ${itm?.delivery_location?.pincode}`}
                                          placement='bottom'
                                        >
                                          <img src={InfoSquare} alt='' />
                                        </LightTooltip>
                                      </div>
                                    </div>
                                  </TableCell>

                                  <TableCell align='center'>
                                    {moment(itm?.purchase_or_delivery_date).format('DD-MM-YYYY')}
                                  </TableCell>

                                  <TableCell align='center'>{itm?.status}</TableCell>

                                  <TableCell align='center'>
                                    <div
                                      onClick={() => {
                                        DownloadInvoices(itm.id, itm.type)
                                      }}
                                      className=' flex justify-center cursor-pointer'
                                    >
                                      <img src={TripsDownloadIcon} alt='' />
                                    </div>
                                  </TableCell>

                                  {/* <TableCell align='center' sx={{ padding: '0px' }}>
                                    {moment(item?.start_time).format('LT') !== 'Invalid date' &&
                                      moment(item?.start_time).format('LT')}
                                    <br />
                                    {moment(item?.start_time).format('DD/MM/YYYY') !==
                                      'Invalid date' &&
                                      moment(item?.start_time).format('DD/MM/YYYY')}
                                  </TableCell>
                                  <TableCell align='center'>
                                    <div className='flex justify-center items-center '>
                                      <p className='truncate'>
                                        {item?.purchase_order?.supplier?.name}
                                      </p>
                                      <div className='my-auto mx-1'>
                                        <LightTooltip title='Supplier name' placement='bottom'>
                                          <img src={InfoSquare} alt='' />
                                        </LightTooltip>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell align='center'>
                                    {itm?.purchase_order?.fuel_qty} litres
                                  </TableCell>
                                  <TableCell align='center'>
                                    ₹ {itm?.purchase_order?.total_amount}
                                  </TableCell>
                                  <TableCell align='center'>
                                    <div className='flex justify-center items-center '>
                                      {item?.purchase_order?.supplier?.city}
                                      <div className='my-auto mx-1'>
                                        <LightTooltip title='XYZ' placement='bottom'>
                                          <img src={InfoSquare} alt='' />
                                        </LightTooltip>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell align='center'>
                                    {moment(itm?.purchase_order?.purchase_date).format('LT') !==
                                      'Invalid date' &&
                                      moment(itm?.purchase_order?.purchase_date).format('LT')}
                                    <br />
                                    {moment(itm?.purchase_order?.purchase_date).format(
                                      'DD/MM/YYYY',
                                    ) !== 'Invalid date' &&
                                      moment(itm?.purchase_order?.purchase_date).format(
                                        'DD/MM/YYYY',
                                      )}
                                  </TableCell>
                                  <TableCell align='center'>
                                    {item?.purchase_order?.status.includes('Purchase') ||
                                    item?.purchase_order?.status.includes('Delivered') ? (
                                      <p className={classes.purchaseStatus}>
                                        {item?.purchase_order?.status}
                                      </p>
                                    ) : (
                                      <p style={{ color: '#ffffff' }}>
                                        {item?.purchase_order?.status}
                                      </p>
                                    )}
                                  </TableCell> */}
                                  {/* <TableCell align='center'>
                                    <div className='flex justify-center cursor-pointer'>
                                      <img src={TripsDownloadIcon} alt='' />
                                    </div>
                                  </TableCell> */}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BasicTable
