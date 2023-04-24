import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import DownCircleLight from '../../../../assets/icons/lightArrows/DownCircleLight.svg'
import AccordionDetails from '@mui/material/AccordionDetails'
import Link from '../../../../assets/images/Link.svg'
// import CircularProgress from '@mui/material/CircularProgress';

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
interface Props {
  deliveryList: any
  orderByid: any
}
const DelLocationsList: React.FC<Props> = ({ orderByid }) => {
  const classes = useStyles()

  console.log(orderByid?.data?.support_ticket?.order, 'orderByid')
  return (
    <div className='mobileView bg-lightbg'>
      <p className='subheading'>Delivery Location</p>

      <div className=' flex flex-col gap-6'>
        <div className='bg-darkGray mobileView border border-none flex flex-col lg:flex-row  gap-6 lg:gap-60'>
          <div className='flex w-full flex-row justify-between lg:flex-col lg:gap-1 px-3 lg:px-0'>
            <p className='text-xs text-textgray'>Delivery Term</p>
            <p className='text-sm'>Paid Delivery</p>
          </div>
          <div className='flex w-full flex-row justify-between lg:flex-col lg:gap-1 px-3 lg:px-0'>
            <p className='text-xs text-textgray'>Delivery Fee</p>
            <p className='text-sm'>₹ {orderByid?.data?.payment_details?.delivery_charges || 0}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-darkGray mobileView border border-none flex flex-col gap-4'>
            <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
              <p className='text-xs text-textgray'>Address Type</p>
              <p className='text-sm'>
                {orderByid?.data?.support_ticket?.order?.customer_delivery_details?.address_type}
              </p>
            </div>

            <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
              <p className='text-xs text-textgray'>Industry Type</p>
              <p className='text-sm'>
                {orderByid?.data?.support_ticket?.order?.customer?.industry_type || 'NA'}
              </p>
            </div>

            <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
              <p className='text-xs text-textgray'>Delivery Location</p>
              <div className='wrap ml-10 lg:ml-0'>
                {orderByid?.data?.support_ticket?.order?.customer_delivery_details?.street_address}
                <br />
                {orderByid?.data?.support_ticket?.order?.customer_delivery_details.city}
                <br />
                {orderByid?.data?.support_ticket?.order?.customer_delivery_details.state}{' '}
                {orderByid?.data?.support_ticket?.order?.customer_delivery_details.zipcode}
              </div>
            </div>

            {orderByid?.data?.support_ticket?.order?.customer_delivery_details.location ? (
              <>
                <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
                  <p className='text-xs text-textgray'>Link</p>
                  <p className='text-sm'>
                    <div className='text-[#57CD53] flex gap-2'>
                      <a
                        className='flex items-center'
                        href={
                          orderByid?.data?.support_ticket?.order?.customer_delivery_details.location
                        }
                        target='_blank'
                        rel='noreferrer'
                      >
                        <div className='flex gap-2'>
                          <p>Link</p>
                          <img src={Link} alt='' />
                        </div>
                      </a>
                    </div>
                  </p>
                </div>
              </>
            ) : null}
          </div>

          <div className='bg-darkGray mobileView border border-none flex flex-col gap-4 pt-2'>
            <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
              <p className='text-xs text-textgray'>Loaction Contact Number</p>
              <p className='text-sm'>--</p>
            </div>

            <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
              <p className='text-xs text-textgray'>POC Name</p>
              <p className='text-sm'>
                {orderByid?.data?.support_ticket?.order?.customer_delivery_details?.poc_name ||
                  '--'}
              </p>
            </div>

            <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
              <p className='text-xs text-textgray'>POC Number</p>
              <p className='text-sm'>
                {orderByid?.data?.support_ticket?.order?.customer_delivery_details?.poc_phone ||
                  '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DelLocationsList
