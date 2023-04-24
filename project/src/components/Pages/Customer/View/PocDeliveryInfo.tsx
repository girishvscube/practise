import React, { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import PopUp from './DeliveryPopUp'
import AddpocForm from './AddPocForm'
import UpCircle from '../../../../assets/icons/lightArrows/UpCircleLight.svg'
import Link from '../../../../assets/images/Link.svg'
import BasicTable from './PocTable'
import { useSelector, useDispatch } from 'react-redux'
import { getCustomerPocList, resetProgress } from '../../../../features/customer/pocSlice'
import {
  getDeliveryList,
  DeleteDelivery,
  resetDelivery,
  resetDelete,
} from '../../../../features/customer/deliverySlice'
import { getpocDropdown } from '../../../../features/dropdowns/dropdownSlice'
import Popup from '../../../common/Popup'
import { Tooltip } from '@mui/material'
import { uuid } from './../../../../utils/helpers'
const useStyles = makeStyles(() => ({
  root: {
    // backgroundColor: '#151929 !important',
    paddingY: '30px',
    '&:before': {
      backgroundColor: 'transparent',
    },
  },
  details: {
    margin: ' 24px',
    backgroundColor: '#151929',
    borderRadius: '1rem',
  },

  summary: {
    backgroundColor: '#151929 !important',
    borderRadius: '8px !important',
    margin: '0px',

    padding: '0px',
    // maxHeight: '25px',
  },
}))
interface PocDeliveryInfoProps {
  cust_id: any
}
const PocDeliveryInfo = ({ cust_id }: PocDeliveryInfoProps) => {
  const dispatch = useDispatch()
  const { deliveryList, iscreateSuccess, isdeliverySuccess, delivery, isdeleteDelSuccess } =
    useSelector((state: any) => state.delivery)
  const { pocDropdown } = useSelector((state: any) => state.dropdown)
  const { createSuccess, pocList, editSuccess } = useSelector((state: any) => state.poc)

  const initialValues = {
    customer_id: '',
    poc_name: '',
    phone: '',
    email: '',
    designation: '',
    image: '',
    image_file: '',
  }
  const initialDeliveryFormValues = {
    location_name: '',
    address_1: '',
    address_2: '',
    pincode: '',
    address_type: '',
    city: '',
    state: '',
    phone: '',
    landmark: '',
    location: '',
    customer_poc_id: '',
    fuel_price: '',
    is_fuel_price_checked: false,
  }

  const [formErrors, setFormErrors] = useState(initialValues)
  const [params, setParams] = useState(initialValues)

  const [delId, setDelId] = useState()
  const [deliveryParams, setDeliveryParams] = useState(initialDeliveryFormValues)
  console.log('deliveryParams:', deliveryParams)
  const [deliveryFormErrors, setDeliveryFormErrors] = useState(initialDeliveryFormValues)

  const [open, setOpen] = React.useState({
    deliveryPopup: false,
    updateLocationPopup: false,
    pocPopUp: false,
    updatePocPopUp: false,
  })

  const [updateLocationId, setUpdateLocationId] = useState()

  const [confirmationPopup, setConfirmationPopup] = useState({
    deletePocPopUp: false,
    deleteLocationPopUp: false,
  })

  const DeliveryDeleteYes = () => {
    dispatch(DeleteDelivery(delId))
  }
  const DeliveryDeleteNo = () => {
    OpenDeliveryDeletePopup('warning', false)
  }

  const [deletePopup, setDeletePopup] = useState({
    success: false,
    warning: false,
    question: false,
  })

  const OpenDeliveryDeletePopup = (key: any, value: any) => {
    setDeletePopup({ ...deletePopup, [key]: value })
  }

  const handleClickOpen = () => {
    setOpen({ ...open, deliveryPopup: true })
    setDeliveryParams(initialDeliveryFormValues)
  }
  const CloseCreateDelivery = () => {
    setOpen({ ...open, deliveryPopup: false })
  }

  const handleClickOpenLocationUpdate = (locationId: any) => {
    setOpen({ ...open, updateLocationPopup: true })
    setUpdateLocationId(locationId)
  }
  const handleClose = () => {
    setOpen({ ...open, updateLocationPopup: false })
  }

  const classes = useStyles()

  const closePocPopUp = () => {
    setOpen({ ...open, pocPopUp: false })
  }

  useEffect(() => {
    if (cust_id) {
      dispatch(getCustomerPocList(cust_id))
      dispatch(getDeliveryList(cust_id))
    }
  }, [cust_id])

  useEffect(() => {
    cust_id && dispatch(getpocDropdown(cust_id))
  }, [pocList])

  useEffect(() => {
    if (createSuccess === true || editSuccess === true) {
      closePocPopUp()
      dispatch(getCustomerPocList(cust_id))
      dispatch(resetProgress())
    }
  }, [createSuccess, editSuccess])

  useEffect(() => {
    if (iscreateSuccess === true) {
      CloseCreateDelivery()
      dispatch(getDeliveryList(cust_id))
      dispatch(resetDelivery())
    }
  }, [iscreateSuccess])

  useEffect(() => {
    if (isdeliverySuccess === true) {
      setDeliveryParams(delivery)
      dispatch(resetDelivery())
    }
  }, [delivery])

  useEffect(() => {
    if (isdeleteDelSuccess === true) {
      dispatch(getDeliveryList(cust_id))
      dispatch(resetDelete())
      OpenDeliveryDeletePopup('warning', false)
    }
  }, [isdeleteDelSuccess])

  const setOpenPocForm = () => {
    setOpen({ ...open, pocPopUp: true })
    setParams(initialValues)
  }

  const handleRemoveLocation = async (locationId: any) => {
    OpenDeliveryDeletePopup('warning', true)
    setDelId(locationId)
  }

  return (
    <div className='w-full rounded flex flex-col gap-6'>
      <div className='divstyles bg-lightbg '>
        <p className='subheading'>List of POCs</p>

        <div className=' flex flex-col gap-4  justify-center '>
          <div>
            <BasicTable
              rows={pocList}
              open={open.pocPopUp}
              handleClose={() => {
                closePocPopUp()
              }}
              params={params}
              setFormParams={setParams}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              customer_id={cust_id}
              initialValues={initialValues}
            />
          </div>
          <div>
            <AddpocForm
              open={open.pocPopUp}
              handleClickOpen={setOpenPocForm}
              handleClose={closePocPopUp}
              params={params}
              setFormParams={setParams}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              customer_id={cust_id}
              type='create'
              pocId=''
            />
          </div>
        </div>
      </div>

      <div className='divstyles bg-lightbg'>
        <p className='subheading'>Delivery Location</p>

        <div className='flex flex-col gap-6'>
          {deliveryList?.length > 0 ? (
            deliveryList?.map((item: any) => (
              <Accordion
                key={uuid()}
                defaultExpanded
                elevation={0}
                className={classes.root}
                sx={{ border: 'none', borderRadius: '8px' }}
              >
                <AccordionSummary
                  expandIcon={<img src={UpCircle} alt='icon' className='mx-3' />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                  className={classes.summary}
                >
                  <Typography>
                    <p className=' font-nunitoRegular my-2 mx-3 text-white'>
                      {' '}
                      {item.location_name} ({item.address_type})
                    </p>
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography>
                    <div className='font-nunitoRegular   flex flex-col gap-y-6 rounded-lg mt-4 '>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        <div className='bg-darkbg rounded-lg p-[10px] '>
                          <div className='grid grid-cols-2 gap-[17px] p-[2px]'>
                            <div className='text-[#6A6A78]'>Delivery Location </div>
                            <div className='text-white'>
                              {item?.address_1}
                              <br />
                              {item?.address_2}
                              <span>, </span>
                              {/* <br /> */}
                              {item?.city}
                              <br />
                              {item?.state} <>, </>
                              {item?.pincode}
                            </div>

                            {item?.location !== '' && (
                              <>
                                <div className='text-[#6A6A78]'>Location Link </div>

                                <Tooltip title='Delivery Location Link'>
                                  {/* <div className='text-[#57CD53] flex gap-2'>
                                    <div>
                                      <a href={item?.location} target='_blank' rel='noreferrer'>
                                        Link
                                      </a>
                                    </div>

                                    <a href={item?.location} target='_blank' rel='noreferrer'>
                                      <img src={Link} alt='' />
                                    </a>
                                  </div> */}
                                  <a
                                    className='text-green flex '
                                    href={item?.location}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    Link <img src={Link} alt='location_link' />
                                  </a>
                                </Tooltip>
                              </>
                            )}

                            <div className='text-[#6A6A78]'>Location wise Price Difference </div>
                            <div className='text-white'>+ ₹{item?.fuel_price}</div>
                          </div>
                        </div>
                        <div className='bg-darkbg rounded-lg p-[10px]'>
                          {' '}
                          <div className='grid grid-cols-2 gap-[17px] p-[2px]'>
                            <div className='text-[#6A6A78]'>Location Contact Number </div>
                            <div className='text-white'>{item.phone}</div>

                            <div className='text-[#6A6A78]'>POC Name </div>
                            <div className='text-white'>{item.poc.poc_name}</div>

                            <div className='text-[#6A6A78]'>POC Number </div>
                            <div className='text-white'>{item.poc.phone}</div>
                          </div>
                          <div className='w-full mt-[24px]'>
                            <hr className='border-border' />
                          </div>
                          <div className='flex gap-2 justify-end mt-[24px] pb-[24px]'>
                            <Tooltip title='Edit Delivery Location'>
                              <svg
                                className='cursor-pointer'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                onClick={() => {
                                  handleClickOpenLocationUpdate(item?.id)
                                }}
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

                            <p className='pTag font-nunitoRegular'>Edit</p>

                            <span className='text-[#404050]'>|</span>

                            <Tooltip title='Delete Delivery Location'>
                              <svg
                                className='cursor-pointer'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                onClick={() => {
                                  handleRemoveLocation(item?.id)
                                }}
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

                            {/* Delete Location Popup to add */}

                            <Popup
                              Confirmation={DeliveryDeleteYes}
                              handleNo={DeliveryDeleteNo}
                              open={confirmationPopup.deleteLocationPopUp}
                              handleClickOpen=''
                              popup='warning'
                              subtitle={'Changes are not saved '}
                              popupmsg={'Do you want to Proceed without Saving the Details ?'}
                            />

                            <p className='pTag font-nunitoRegular'>Delete </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <div className='rounded-lg w-full bg-darkGray p-8'>
              <p className='text-xl font-nunitoRegular text-center text-white '>
                No Delivery Locations Found !
              </p>
            </div>
          )}
        </div>

        <div className='flex justify-center mt-6 '>
          <PopUp
            open={open.deliveryPopup}
            handleClickOpen={handleClickOpen}
            handleClose={CloseCreateDelivery}
            customer_id={cust_id}
            params={deliveryParams}
            setFormParams={setDeliveryParams}
            formErrors={deliveryFormErrors}
            setFormErrors={setDeliveryFormErrors}
            type='create'
            pocId=''
            dropdownOptions={pocDropdown}
          />
        </div>
      </div>
      <PopUp
        open={open.updateLocationPopup}
        handleClickOpen=''
        handleClose={handleClose}
        customer_id={cust_id}
        params={deliveryParams}
        setFormParams={setDeliveryParams}
        formErrors={deliveryFormErrors}
        setFormErrors={setDeliveryFormErrors}
        type='update'
        pocId={updateLocationId}
        dropdownOptions={pocDropdown}
      />

      <Popup
        Confirmation={DeliveryDeleteYes}
        handleNo={DeliveryDeleteNo}
        // open={true}
        open={deletePopup.warning}
        handleClickOpen={OpenDeliveryDeletePopup}
        popup='warning'
        subtitle='Are you Sure?'
        popupmsg=' Do you really want to delete Delivery Location ?'
      />
    </div>
  )
}
export default PocDeliveryInfo
