import React from 'react'
import CustomButton from '../../../common/Button'
import { Link } from 'react-router-dom'

interface Props {
  orderId: any
  customerName: any
}

const Support: React.FC<Props> = ({ orderId, customerName }) => (
  // <div>
  //   <p className='subheadin'>Price info</p>
  //   <div className='subdiv'>sdaas</div>
  // </div>
  <div className='bg-lightbg p-4 border border-border rounded-lg'>
    <p className='subheading'>Support</p>

    <p className='pb-5 mb-4 border-b border-border'>
      No Support Ticket has been Rasied for this Order.
    </p>
    <div className='  flex justify-center '>
      <div />

      <Link to={`/support/create-ticket/${orderId}?customer_name=${customerName}`}>
        <CustomButton
          //   disabled={CountItems(params) === 0}
          //   onClick={UpdateStatus}
          borderRadius='0.5rem'
          width='w-fit '
          variant='outlined'
          size='medium'
          icon={
            <svg
              width='16'
              height='14'
              viewBox='0 0 16 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9.23324 1.83203V3.44536'
                stroke='#FFCD2C'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9.23324 10.8379V12.1872'
                stroke='#FFCD2C'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9.23324 8.54798V5.33398'
                stroke='#FFCD2C'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12.4682 12.3327C13.683 12.3327 14.6668 11.361 14.6668 10.1614V8.43311C13.863 8.43311 13.2157 7.79382 13.2157 7.00004C13.2157 6.20625 13.863 5.56628 14.6668 5.56628L14.6661 3.83725C14.6661 2.63765 13.6816 1.66602 12.4676 1.66602H3.53277C2.31876 1.66602 1.33419 2.63765 1.33419 3.83725L1.3335 5.62258C2.13728 5.62258 2.78462 6.20625 2.78462 7.00004C2.78462 7.79382 2.13728 8.43311 1.3335 8.43311V10.1614C1.3335 11.361 2.31736 12.3327 3.53208 12.3327H12.4682Z'
                stroke='#FFCD2C'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          }
        >
          Create Ticket
        </CustomButton>
      </Link>
    </div>
  </div>
)

export default Support
