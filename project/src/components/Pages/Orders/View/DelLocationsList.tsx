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
  // const { isdeliveryListPending } = useSelector((state: any) => state.delivery);

  console.log(orderByid, 'orderByid')
  return (
    <div className='divstyles bg-lightbg'>
      <p className='subheading'>Delivery Location</p>

      <div className='flex flex-col  gap-6 bg-lightbg'>
        <Accordion
          defaultExpanded
          elevation={0}
          className={classes.root}
          sx={{ border: 'none', borderRadius: '8px' }}
        >
          <AccordionSummary
            expandIcon={<img src={DownCircleLight} alt='icon' className='mx-3' />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            className={classes.summary}
          >
            <Typography>
              <p className=' font-nunitoRegular my-2 mx-3 text-white'>
                {orderByid?.order?.customer_delivery_details?.location_name || '--'} (
                {orderByid?.order?.customer_delivery_details?.address_type || '--'})
              </p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className='font-nunitoRegular bg-lightbg flex flex-col gap-y-6 rounded-lg py-4 '>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                  <div className='bg-darkbg rounded-lg p-[10px] '>
                    <div className='grid grid-cols-2 gap-[17px] p-[2px]'>
                      <div className='text-xs text-textgray'>Industry Type </div>
                      <div className='text-white'>{orderByid?.order?.customer?.industry_type}</div>
                      <div className='text-xs text-textgray'>Delivery Location </div>
                      <div className='text-white'>
                        {orderByid?.order?.customer_delivery_details?.address_1}
                        <br />
                        {orderByid?.order?.customer_delivery_details?.address_2}
                        <span>, </span>
                        {/* <br /> */}
                        {orderByid?.order?.customer_delivery_details?.city}
                        <br />
                        {orderByid?.order?.customer_delivery_details?.state}
                        {orderByid?.order?.customer_delivery_details?.pincode}
                      </div>

                      {orderByid?.order?.customer_delivery_details?.location_url && (
                        <>
                          <div className='text-xs text-textgray'>Location Link </div>
                          <div className='text-[#57CD53] flex gap-2'>
                            <a
                              className='flex items-center'
                              href={orderByid?.order?.customer_delivery_details?.location_url}
                              target='_blank'
                              rel='noreferrer'
                            >
                              <p>Link</p>
                              <img src={Link} alt='' />
                            </a>
                          </div>
                        </>
                      )}

                      <div className='text-xs text-textgray'>Location wise Price Difference </div>
                      <div className='text-white'>
                        {orderByid?.order?.customer_delivery_details?.fuel_price}
                      </div>
                    </div>
                  </div>
                  <div className='bg-darkbg rounded-lg p-[10px]'>
                    {' '}
                    <div className='grid grid-cols-2 gap-[17px] p-[2px]'>
                      <div className='text-xs text-textgray'>Location Contact Number </div>
                      <div className='text-white'>
                        {orderByid?.order?.customer_delivery_details?.phone}
                      </div>

                      <div className='text-xs text-textgray'>POC Name </div>
                      <div className='text-white'>
                        {orderByid?.order?.customer_delivery_details?.poc_name}
                      </div>

                      <div className='text-xs text-textgray'>POC Number </div>
                      <div className='text-white'>
                        {orderByid?.order?.customer_delivery_details?.poc_phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className='flex justify-center mt-6 ' />
    </div>
  )
}

export default DelLocationsList
