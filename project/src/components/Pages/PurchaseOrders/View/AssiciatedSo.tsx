import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import CustomCheckbox from './../../../common/input/Checkbox'
import CustomButton from './../../../common/Button'
import { Link } from 'react-router-dom'
import LinkSoModal from './LinkSoModal'
import { ToolTip } from './ToolTip'
import axiosInstance from './../../../../utils/axios'
import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress'
import { showToastMessage, uuid } from '../../../../utils/helpers'

interface Props {
  PoId: any
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
}))
const AssiciatedSo: React.FC<Props> = ({ PoId }) => {
  const [linkModalOpen, setLinkModalOpen] = useState(false)

  const [linkedSos, setLinkedSos] = useState([])
  console.log('linkedSos:', linkedSos)
  const [loading, setLoading] = useState(true)
  console.log('loading:', loading)

  const openModal = () => {
    setLinkModalOpen(true)
  }
  const closeModal = () => {
    setLinkModalOpen(false)
  }

  const classes = useStyles()

  const getLinkedSOs = () => {
    axiosInstance
      .get(`admin/purchase-sales-order/${PoId}`)
      .then((response) => {
        // console.log('response:', response.data.data)
        setLinkedSos(response?.data?.data)
        setLoading(false)
        console.log(loading, 'res')
      })
      .catch((error) => {
        console.log('error:', error, loading)
        setLoading(false)
      })
  }

  const handleDelete = async (id: any) => {
    setLoading(true)
    axiosInstance
      .delete(`/admin/purchase-sales-order/${id}`)
      .then((response) => {
        getLinkedSOs()

        showToastMessage(response.data.data.message, 'success')
      })
      .catch((error) => {
        console.log('error:', error)
      })
  }

  useEffect(() => {
    getLinkedSOs()
  }, [PoId])

  return (
    <>
      {linkedSos ? (
        <div className='divstyles bg-lightbg mb-4'>
          <p className='subheading'>Link with SOs</p>
          <TableContainer component={Paper}>
            {loading ? (
              <div className='w-full h-96 flex justify-center items-center'>
                <CircularProgress />
                <span className='text-white text-3xl'>Loading...</span>
              </div>
            ) : linkedSos?.length > 0 ? (
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
                      'SO  No ',
                      'Order Linked On',
                      'Order Quantity',
                      'Delivery Location ',
                      'Delivery Time / Date',
                      'Action',
                    ].map((item) => (
                      <TableCell key={uuid()} align='center'>
                        <span className='text-xs text-textgray font-nunitoRegular'>{item}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {linkedSos?.length > 0 &&
                    linkedSos?.map((item: any) => (
                      <TableRow
                        key={uuid()}
                        sx={{
                          '&:last-child td, &:last-child th': {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell align='center'>{item?.so_id}</TableCell>
                        <TableCell align='center'>
                          {moment(item?.created_at)?.format('DD-MM-YYYY')}
                        </TableCell>
                        <TableCell align='center'>{item?.order?.fuel_qty}</TableCell>
                        <TableCell align='center'>
                          <p className='flex justify-center items-center'>
                            {item?.order?.customer_delivery_details?.city}
                            &nbsp;
                            <ToolTip value={item?.order?.customer_delivery_details} />
                          </p>
                        </TableCell>
                        <TableCell align='center'>
                          {moment(item?.order?.delivery_date)?.format('DD-MM-YYYY')}
                        </TableCell>
                        <TableCell align='center'>
                          <div className='flex justify-center '>
                            <Link to={`/sales/orders/view/${item?.order?.id}`}>
                              <svg
                                width='30'
                                height='30'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                // onClick={() => {}}
                                className='cursor-pointer pr-2'
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

                            <svg
                              onClick={() => {
                                handleDelete(item.id)
                              }}
                              className='pl-2 cursor-pointer'
                              width='30'
                              height='30'
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M14.3955 9.59375L9.60352 14.3857'
                                stroke='#EF4949'
                                stroke-width='1.5'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                              <path
                                d='M14.3956 14.3907L9.59961 9.59375'
                                stroke='#EF4949'
                                stroke-width='1.5'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                              <path
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                                d='M16.334 2.75H7.665C4.644 2.75 2.75 4.889 2.75 7.916V16.084C2.75 19.111 4.635 21.25 7.665 21.25H16.333C19.364 21.25 21.25 19.111 21.25 16.084V7.916C21.25 4.889 19.364 2.75 16.334 2.75Z'
                                stroke='#EF4949'
                                stroke-width='1.5'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                              />
                            </svg>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className='rounded-lg w-full bg-darkGray p-8'>
                <p className='text-xl font-nunitoRegular text-center text-white '>
                  No Linked Orders Found !
                </p>
              </div>
            )}
          </TableContainer>
          <br />
          <CustomButton
            onClick={openModal}
            borderRadius='5rem'
            width='m-auto w-fit '
            variant='outlined'
            size='medium'
            icon={
              <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6.05492 7.69261L4.11492 9.63261C3.88004 9.85929 3.56635 9.98598 3.23992 9.98598C2.91349 9.98598 2.5998 9.85929 2.36492 9.63261C2.24972 9.51786 2.15831 9.3815 2.09594 9.23135C2.03357 9.08119 2.00147 8.9202 2.00147 8.75761C2.00147 8.59501 2.03357 8.43402 2.09594 8.28387C2.15831 8.13371 2.24972 7.99735 2.36492 7.88261L4.30492 5.94261C4.39907 5.84845 4.45196 5.72076 4.45196 5.58761C4.45196 5.45445 4.39907 5.32676 4.30492 5.23261C4.21077 5.13845 4.08307 5.08556 3.94992 5.08556C3.81677 5.08556 3.68907 5.13845 3.59492 5.23261L1.65492 7.17761C1.2641 7.603 1.05273 8.16294 1.06496 8.74048C1.07718 9.31802 1.31206 9.86851 1.72053 10.277C2.12901 10.6855 2.6795 10.9203 3.25704 10.9326C3.83458 10.9448 4.39452 10.7334 4.81992 10.3426L6.76492 8.40261C6.85907 8.30845 6.91196 8.18076 6.91196 8.04761C6.91196 7.91445 6.85907 7.78676 6.76492 7.69261C6.67077 7.59845 6.54307 7.54556 6.40992 7.54556C6.27677 7.54556 6.14907 7.59845 6.05492 7.69261ZM10.3449 1.65261C9.92431 1.23461 9.35541 1 8.76242 1C8.16943 1 7.60053 1.23461 7.17992 1.65261L5.23492 3.59261C5.1883 3.63923 5.15132 3.69457 5.12609 3.75548C5.10086 3.81639 5.08787 3.88168 5.08787 3.94761C5.08787 4.01354 5.10086 4.07882 5.12609 4.13973C5.15132 4.20064 5.1883 4.25599 5.23492 4.30261C5.28154 4.34922 5.33688 4.38621 5.39779 4.41144C5.4587 4.43667 5.52399 4.44965 5.58992 4.44965C5.65585 4.44965 5.72113 4.43667 5.78204 4.41144C5.84295 4.38621 5.8983 4.34922 5.94492 4.30261L7.88492 2.36261C8.1198 2.13592 8.43349 2.00923 8.75992 2.00923C9.08635 2.00923 9.40004 2.13592 9.63492 2.36261C9.75012 2.47735 9.84152 2.61371 9.90389 2.76387C9.96626 2.91402 9.99837 3.07501 9.99837 3.23761C9.99837 3.4002 9.96626 3.56119 9.90389 3.71135C9.84152 3.8615 9.75012 3.99786 9.63492 4.11261L7.69492 6.05261C7.64805 6.09909 7.61086 6.15439 7.58547 6.21532C7.56009 6.27625 7.54702 6.3416 7.54702 6.40761C7.54702 6.47361 7.56009 6.53896 7.58547 6.59989C7.61086 6.66082 7.64805 6.71612 7.69492 6.76261C7.7414 6.80947 7.7967 6.84667 7.85763 6.87205C7.91856 6.89744 7.98391 6.9105 8.04992 6.9105C8.11592 6.9105 8.18128 6.89744 8.24221 6.87205C8.30314 6.84667 8.35844 6.80947 8.40492 6.76261L10.3449 4.81761C10.7629 4.397 10.9975 3.82809 10.9975 3.23511C10.9975 2.64212 10.7629 2.07322 10.3449 1.65261ZM4.41492 7.58261C4.46164 7.62895 4.51705 7.66561 4.57797 7.69049C4.63888 7.71537 4.70411 7.72799 4.76992 7.72761C4.83572 7.72799 4.90095 7.71537 4.96187 7.69049C5.02279 7.66561 5.0782 7.62895 5.12492 7.58261L7.58492 5.12261C7.67907 5.02845 7.73196 4.90076 7.73196 4.76761C7.73196 4.63445 7.67907 4.50676 7.58492 4.41261C7.49077 4.31845 7.36307 4.26556 7.22992 4.26556C7.09677 4.26556 6.96907 4.31845 6.87492 4.41261L4.41492 6.87261C4.36805 6.91909 4.33086 6.97439 4.30547 7.03532C4.28009 7.09625 4.26702 7.1616 4.26702 7.22761C4.26702 7.29361 4.28009 7.35896 4.30547 7.41989C4.33086 7.48082 4.36805 7.53612 4.41492 7.58261Z'
                  fill='#FFCD2C'
                />
              </svg>
            }
          >
            Link Orders
          </CustomButton>

          <LinkSoModal
            setLoading={setLoading}
            getLinkedSOs={getLinkedSOs}
            linkedSos={linkedSos}
            PoId={PoId}
            handleClickOpen={openModal}
            handleClose={closeModal}
            open={linkModalOpen}
          />
        </div>
      ) : (
        <div className='divstyles bg-lightbg mb-4'>
          <p className='subheading'>Link with SOs</p>
        </div>
      )}
    </>
  )
}

export default AssiciatedSo
