import CustomButton from '../../../common/Button'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import userDefault from '../../../../assets/icons/user/user_default.svg'
import DownCircle from '../../../../assets/icons/lightArrows/DownCircleLight.svg'
import Tab from './Tab/Tab'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PocDeliveryInfo from './PocDeliveryInfo'

import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import { useParams, Link } from 'react-router-dom'
import { ViewCustomer } from '../../../../features/customer/customerSlice'
import CustomerPayments from './CustomerPayments'
import CustomerOrders from './CustomerOrders'
import CircularProgress from '@mui/material/CircularProgress'
import Logs from '../../../common/Logs'
import { decryptData, encryptData } from '../../../../utils/encryption'
import { uuid } from './../../../../utils/helpers'
const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#262938 !important',
  },

  details: {
    border: '1px solid red',
    margin: ' 24px',
    backgroundColor: '#151929',
    borderRadius: '1rem',
  },

  AccordionSummary: {
    borderRadius: '15px',
    margin: '0px',
    padding: '0px',
    maxHeight: '25px',
  },

  //
}))

const CustomerView = () => {
  const dispatch = useDispatch()
  const { customerDetails, isLoading } = useSelector((state: any) => state.customer)
  let { id } = useParams()
  id = decryptData(id)

  const TabConstants = [
    {
      title: 'POC & DeliveryInfo',
    },
    {
      title: 'Orders',
    },
    {
      title: 'Activity Logs',
    },
  ]

  const [customer] = useState({
    id: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    company_name: '',
    bank_name: '',
    account_name: '',
    account_number: '',
    ifsc_code: '',
    cancelled_cheque: '',
    gst_no: '',
    gst_certificate: '',
    credit_limit: '',
    credit_net_due_id: '',
    credit_pan: '',
    credit_aadhaar: '',
    credit_bank_statement: '',
    credit_blank_cheque: '',
    credit_cibil: '',
  })

  useEffect(() => {
    // fetchCustomer()
    id && dispatch(ViewCustomer(id))
  }, [id])

  const creditInfo = [
    {
      doc: true,
      name: 'Pan Card',
      value: 'Download',
      downloadlink: customerDetails?.credit_pan,
    },
    {
      name: 'Bank Statement',
      value: 'Download',
      downloadlink: customerDetails?.credit_bank_statement,
      doc: true,
    },
    {
      name: 'Aadhar Card',
      value: 'Download',
      downloadlink: customerDetails?.credit_aadhaar,
      doc: true,
    },
    {
      name: 'Bank Statement',
      value: 'Download',
      downloadlink: customerDetails?.credit_aadhaar,
      doc: true,
    },
    {
      name: 'Blank Cheque',
      value: 'Download',
      downloadlink: customerDetails?.credit_blank_cheque,
      doc: true,
    },
    {
      name: 'CIBIL Request Form',
      value: 'Download',
      downloadlink: customerDetails?.credit_cibil,
      doc: true,
    },
  ]
  const companyInfo = [
    {
      name: 'Company Name',
      value: customerDetails?.company_name ?? '--',
    },
    {
      name: 'Customer ID',
      value: customerDetails?.id ?? '--',
    },
    {
      name: 'Phone Number',
      value: customerDetails?.phone ?? '--',
    },
    {
      name: 'Email Id',
      value: customerDetails?.email ?? '--',
    },
    {
      name: 'Industry Type',
      value: customerDetails?.industry_type ?? '--',
    },
    {
      name: 'Address Line',
      value: customerDetails?.address ?? '--',
    },
  ]
  const bankinfo = [
    { name: 'Bank Name', value: customerDetails?.bank_name ?? '--' },
    { name: 'Account Number', value: customerDetails?.account_number ?? '--' },
    { name: 'IFSC Code', value: customerDetails?.ifsc_code ?? '--' },
    { name: 'Account Name', value: customerDetails?.account_name ?? '--' },
  ]

  const gstinfo = [
    { name: 'GST Number', value: customerDetails?.gst_no ?? '--' },
    { name: 'State', value: customerDetails?.state ?? '--' },
    {
      name: 'GST Certificate',
      value: 'Download',
      downloadlink: customerDetails?.gst_certificate ?? '--',
      doc: true,
    },
  ]

  const downloadPdf = (name: any, value: any) => {
    const downloadLink = document.createElement('a')
    const fileName = `${name}.pdf`
    downloadLink.href = value
    downloadLink.download = fileName
    downloadLink.click()
  }
  // console.log(gstinfo, 'gstinfo')

  const classes = useStyles()
  return (
    <>
      <BreadCrumb
        links={[
          { path: 'Customers', url: '/customers' },
          { path: 'View Profile', url: '' },
        ]}
      />

      <p className='font-black sm:mb-7 mb-4 '> View Customer Profile</p>
      {isLoading ? (
        <div className='w-full h-80 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : (
        <div className='flex flex-col  sm:flex-row gap-5'>
          <div className='flex flex-col   p-4 bg-lightbg w-full sm:w-1/3	 rounded-lg border border-border	'>
            <div className='flex items-center  justify-between sm:gap-0 flex-row sm:flex-col mt-0 sm:mt-10 mb-4 '>
              <img
                className='sm:m-auto border border-yellow rounded-lg  sm:h-[174px] sm:w-[173px] h-[101px] w-[102px]'
                src={customerDetails?.image ? customerDetails.image : userDefault}
                alt='user profile'
              />
              <div className=''>
                <p className='mb-1 mt-4 pl-1 sm:pl-0 sm:text-center font-bold text-lg '>
                  {customerDetails?.company_name}
                </p>
                <CustomButton
                  // onClick={handleClick}
                  borderRadius='1rem'
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
                        d='M6.87402 10.2214H10.5003'
                        stroke='#FFCD2C'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M6.39 1.8974C6.77783 1.43389 7.47499 1.36593 7.94811 1.74587C7.97427 1.76648 8.81474 2.41939 8.81474 2.41939C9.33449 2.7336 9.49599 3.40155 9.1747 3.91129C9.15764 3.93859 4.40597 9.88224 4.40597 9.88224C4.24789 10.0794 4.00792 10.1959 3.75145 10.1987L1.93176 10.2215L1.52177 8.48616C1.46433 8.24215 1.52177 7.98589 1.67985 7.78867L6.39 1.8974Z'
                        stroke='#FFCD2C'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M5.51074 3.00049L8.23687 5.09405'
                        stroke='#FFCD2C'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  }
                >
                  <Link to={`/customers/edit/${encryptData(id)}`}>Edit Profile</Link>
                </CustomButton>
              </div>
            </div>

            <div className='flex flex-col '>
              <Accordion elevation={0} className={classes.root}>
                <AccordionSummary
                  expandIcon={<img src={DownCircle} alt='icon' />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <Typography>
                    <p className=' font-nunitoRegular my-2 text-white'>Company Details</p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div className='bg-darkbg  flex flex-col gap-y-6 rounded-lg p-[24px] font-nunitoRegular '>
                      {companyInfo.map((item, index) => (
                        <div key={uuid()} className='flex justify-between'>
                          <p className=' text-xs text-textgray'>{item.name}</p>
                          <p className='text-sm text-white font-medium  text-right'>
                            {item.value}
                            {companyInfo.length - 1 === index ? (
                              <div>
                                {customer.city}
                                <br />
                                {customer.pincode}
                                <br />
                                {customer.state}
                              </div>
                            ) : null}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={0} className={classes.root}>
                <AccordionSummary
                  expandIcon={<img src={DownCircle} alt='icon' />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <Typography>
                    <p className=' font-nunitoRegular my-2 text-white'>Bank Details</p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div className='font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] '>
                      {bankinfo.map((item) => {
                        return (
                          <div key={uuid()} className='flex justify-between'>
                            <p className=' text-xs text-textgray'>{item.name}</p>
                            <p className='text-sm text-white  text-right'>{item.value}</p>
                          </div>
                        )
                      })}

                      {customerDetails?.cancelled_cheque ? (
                        <div key={uuid()} className='flex justify-between'>
                          <p className=' text-xs text-textgray'>Cancelled Cheque</p>
                          <button
                            onClick={(e) => {
                              downloadPdf('cancelled_cheque', customerDetails?.cancelled_cheque)
                            }}
                            className='text-green'
                          >
                            Download
                            <svg
                              className=' pb-1 inline-block'
                              width='20'
                              height='20'
                              viewBox='0 0 14 14'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M7.08097 9.2907L7.08097 1.26337'
                                stroke='#3AC430'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M9.02466 7.33887L7.08066 9.29087L5.13666 7.33887'
                                stroke='#3AC430'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M10.1693 4.41864H10.7913C12.148 4.41864 13.2473 5.51797 13.2473 6.87531L13.2473 10.1313C13.2473 11.4846 12.1506 12.5813 10.7973 12.5813L3.37065 12.5813C2.01398 12.5813 0.913982 11.4813 0.913982 10.1246L0.913982 6.86797C0.913982 5.51531 2.01132 4.41864 3.36398 4.41864H3.99198'
                                stroke='#3AC430'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={0} className={classes.root}>
                <AccordionSummary
                  expandIcon={<img src={DownCircle} alt='icon' />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <Typography>
                    <p className=' font-nunitoRegular my-2 text-white'>Gst Details</p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div className='font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] '>
                      <div key={uuid()} className='flex justify-between'>
                        <p className=' text-xs text-textgray'>GST Number</p>
                        <p className='text-sm text-white  text-right'>
                          {customerDetails?.gst_no ?? '--'}
                        </p>
                      </div>
                      <div key={uuid()} className='flex justify-between'>
                        <p className=' text-xs text-textgray'>State </p>
                        <p className='text-sm text-white  text-right'>
                          {customerDetails?.state ?? '--'}
                        </p>
                      </div>

                      {customerDetails?.gst_certificate ? (
                        <div key={uuid()} className='flex justify-between'>
                          <p className=' text-xs text-textgray'>GST Certificate</p>
                          <button
                            onClick={(e) => {
                              downloadPdf('gst_certificate', customerDetails?.gst_certificate)
                            }}
                            className='text-green'
                          >
                            Download
                            <svg
                              className=' pb-1 inline-block'
                              width='20'
                              height='20'
                              viewBox='0 0 14 14'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M7.08097 9.2907L7.08097 1.26337'
                                stroke='#3AC430'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M9.02466 7.33887L7.08066 9.29087L5.13666 7.33887'
                                stroke='#3AC430'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                              <path
                                d='M10.1693 4.41864H10.7913C12.148 4.41864 13.2473 5.51797 13.2473 6.87531L13.2473 10.1313C13.2473 11.4846 12.1506 12.5813 10.7973 12.5813L3.37065 12.5813C2.01398 12.5813 0.913982 11.4813 0.913982 10.1246L0.913982 6.86797C0.913982 5.51531 2.01132 4.41864 3.36398 4.41864H3.99198'
                                stroke='#3AC430'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {customerDetails.is_credit_availed ? (
                <Accordion elevation={0} className={classes.root}>
                  <AccordionSummary
                    expandIcon={<img src={DownCircle} alt='icon' />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography>
                      <p className=' font-nunitoRegular my-2 text-white'>Credit Options</p>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div className='font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] '>
                        <div key={uuid()} className='flex justify-between'>
                          <p className=' text-xs text-textgray'>Credit Limit</p>
                          <p className='text-sm text-white  text-right'>
                            {customerDetails?.credit_limit ?? '--'}
                          </p>
                        </div>
                        <div key={uuid()} className='flex justify-between'>
                          <p className=' text-xs text-textgray'>Net D</p>
                          <p className='text-sm text-white  text-right'>
                            {customerDetails?.credit_net_due?.name ?? '--'}
                          </p>
                        </div>

                        {creditInfo.map((item) => (
                          <>
                            {item.downloadlink ? (
                              <div key={uuid()} className='flex justify-between'>
                                <p className=' text-xs text-textgray'>{item.name}</p>
                                <button
                                  onClick={(e: any) => {
                                    downloadPdf(item.name, item.downloadlink)
                                  }}
                                  className='text-green'
                                >
                                  {item.value}
                                  <svg
                                    className=' pb-1 inline-block'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 14 14'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M7.08097 9.2907L7.08097 1.26337'
                                      stroke='#3AC430'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                    <path
                                      d='M9.02466 7.33887L7.08066 9.29087L5.13666 7.33887'
                                      stroke='#3AC430'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                    <path
                                      d='M10.1693 4.41864H10.7913C12.148 4.41864 13.2473 5.51797 13.2473 6.87531L13.2473 10.1313C13.2473 11.4846 12.1506 12.5813 10.7973 12.5813L3.37065 12.5813C2.01398 12.5813 0.913982 11.4813 0.913982 10.1246L0.913982 6.86797C0.913982 5.51531 2.01132 4.41864 3.36398 4.41864H3.99198'
                                      stroke='#3AC430'
                                      strokeWidth='1.5'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : null}
                          </>
                        ))}
                      </div>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ) : null}
            </div>
          </div>

          <div className='flex flex-col w-full '>
            <div className='bg-lightbg  rounded-lg custom-tab'>
              <Tab
                cols={TabConstants}
                data={[
                  <PocDeliveryInfo cust_id={customerDetails?.id} />,
                  <CustomerOrders cust_id={customerDetails?.id} />,
                  // <CustomerPayments cust_id={customerDetails?.id} />,
                  <Logs logs={customerDetails?.logs} />,
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CustomerView
