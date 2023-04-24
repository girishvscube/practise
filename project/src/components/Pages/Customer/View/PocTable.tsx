import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import AddPocForm from './AddPocForm'
import { makeStyles } from '@mui/styles'
import userDefault from '../../../../assets/icons/user/user_default.svg'
import { showToastMessage } from './../../Suppliers/SupplierCreation/Toast'
import { useSelector, useDispatch } from 'react-redux'
import { uuid } from './../../../../utils/helpers'
import { Tooltip } from '@mui/material'
import Popup from './../../../common/Popup'
import {
  getPoc,
  DeletePoc,
  getCustomerPocList,
  resetDeleteProgress,
  resetProgress,
} from '../../../../features/customer/pocSlice'

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
const PocTable = ({
  rows,
  // handleClickOpen,
  // handleClose,
  // initialValues,
  params,
  setFormParams,
  formErrors,
  setFormErrors,
  customer_id,
}: any) => {
  const dispatch = useDispatch()
  const { ispocSuccess, poc, isdeleteSuccess, islistPending } = useSelector(
    (state: any) => state.poc,
  )

  const classes = useStyles()
  const [openUpdate, setOpenUpdate] = useState(false)
  const [PocId, setPocId] = useState()

  const handleClickOpen = (id: any) => {
    // console.log(id);
    setOpenUpdate(true)
    setPocId(id)
    dispatch(getPoc(id))
  }

  useEffect(() => {
    // console.log(poc, 'poc');
    if (ispocSuccess === true) {
      dispatch(resetProgress())
      setFormParams({
        ...params,
        customer_id: poc?.data?.customer_id,
        poc_name: poc?.data?.poc_name,
        designation: poc?.data?.designation,
        phone: poc?.data?.phone,
        email: poc?.data?.email,
        image: poc?.data?.image,
      })
    }
  }, [poc])

  // useEffect(() => {
  //   if (ispocSuccess === true) {
  //     setFormParams({
  //       ...params,
  //       customer_id: poc?.data?.customer_id,
  //       poc_name: poc?.data?.poc_name,
  //       designation: poc?.data?.designation,
  //       phone: poc?.data?.phone,
  //       email: poc?.data?.email,
  //       image: poc?.data?.image,
  //     })
  //     dispatch(resetProgress())
  //     console.log(poc, 'poc')
  //   }
  // }, [ispocSuccess])

  const handleClose = () => {
    setOpenUpdate(false)
  }

  useEffect(() => {
    if (isdeleteSuccess === true) {
      dispatch(getCustomerPocList(customer_id))
      dispatch(resetDeleteProgress())
      OpenDeletePopup('warning', false)
    }
  }, [isdeleteSuccess])

  const deletePoc = async (id: any) => {
    setPocId(id)
    OpenDeletePopup('warning', true)
  }

  const DeleteYes = async () => {
    dispatch(DeletePoc(PocId))
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

  return (
    <>
      <TableContainer component={Paper}>
        {islistPending ? (
          'Loading'
        ) : rows.length > 0 ? (
          <Table
            aria-label='simple table'
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: '1px solid #404050',
              },
              minWidth: 650,
              //   border: '1px solid #404050',
              borderCollapse: 'separate',
              borderSpacing: '0px 5px',
              px: '24px',
              background: '#151929',
              borderRadius: '8px',
              '& .css-zvlqj6-MuiTableCell-root': {
                padding: 0,
              },
              padding: 0,
            }}
            className={classes.root}
          >
            <TableHead>
              <TableRow>
                <TableCell align='center'>
                  <span>Sl No.</span>
                </TableCell>
                <TableCell align='center'>
                  <span>POC Image</span>
                </TableCell>
                <TableCell align='center'>
                  <span>POC Name</span>
                </TableCell>
                <TableCell align='center'>
                  <span>Designation</span>
                </TableCell>
                <TableCell align='center'>
                  <span>Contact Details</span>
                </TableCell>
                <TableCell align='center'>
                  <span>Action</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 &&
                rows?.map((row: any) => (
                  <TableRow key={uuid()} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='center'>{row.id}</TableCell>

                    <TableCell align='center'>
                      <div className='flex justify-center'>
                        {/* <img
                          src={row.image}
                          alt='Poc img'
                          className='w-[48px] h-[48px]  rounded-full'
                        /> */}

                        <img
                          className='w-[48px] h-[48px]  rounded-full'
                          src={row?.image ? row?.image : userDefault}
                          alt='user profile'
                        />
                      </div>
                    </TableCell>
                    <TableCell align='center'>{row.poc_name}</TableCell>
                    <TableCell align='center'>{row.designation}</TableCell>
                    <TableCell align='center'>
                      {row.phone}
                      <span>
                        <br />
                      </span>
                      {row.email}
                    </TableCell>
                    <TableCell align='center'>
                      <div className='flex justify-center'>
                        <span className='flex gap-2'>
                          <Tooltip title='Edit POC'>
                            <svg
                              className='cursor-pointer'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                              onClick={() => handleClickOpen(row?.id)}
                            >
                              <path
                                d='M13.748 20.4428H21.0006'
                                stroke='#FE9705'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M12.78 3.79479C13.5557 2.86779 14.95 2.73186 15.8962 3.49173C15.9485 3.53296 17.6295 4.83879 17.6295 4.83879C18.669 5.46719 18.992 6.80311 18.3494 7.82259C18.3153 7.87718 8.81195 19.7645 8.81195 19.7645C8.49578 20.1589 8.01583 20.3918 7.50291 20.3973L3.86353 20.443L3.04353 16.9723C2.92866 16.4843 3.04353 15.9718 3.3597 15.5773L12.78 3.79479Z'
                                stroke='#FE9705'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M11.0215 6.00098L16.4737 10.1881'
                                stroke='#FE9705'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </Tooltip>

                          <span className='text-[#404050]'>|</span>
                          <Tooltip title='Delete POC'>
                            <svg
                              className='cursor-pointer'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                              onClick={() => deletePoc(row?.id)}
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
                        </span>
                      </div>
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
        <AddPocForm
          open={openUpdate}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          params={params}
          setFormParams={setFormParams}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          customer_id={customer_id}
          type='update'
          pocId={PocId}
        />
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
      </TableContainer>
    </>
  )
}
export default PocTable
