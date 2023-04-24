import moment from 'moment'
import { uuid } from '../../../../utils/helpers'
interface Props {
  customerDetails?: any
  orderByid?: any
  PoById: any
}
const PaymentsInfo: React.FC<Props> = ({ PoById }) => {
  const customerData = [
    {
      name: 'Date of Payment',
      value: moment(PoById?.purchase_date).format('DD/MM/YYYY') || 'NA',
    },
    {
      name: 'Payment Status',
      value: PoById?.payment_status || 'NA',
    },
    {
      name: 'Total Amount Paid',
      value: PoById?.total_amount || 'NA',
    },
    {
      name: 'Total Amount Due',
      value: PoById?.balance || 'NA',
    },
  ]

  return (
    <div className='divstyles bg-lightbg mb-4'>
      <p className='subheading'>Payments info </p>
      <div className='subdiv grid grid-cols-1  sm:grid-cols-4 gap-x-8 w-full'>
        {customerData?.length > 0 &&
          customerData?.map((item: any) => (
            <div key={uuid()} className='sm:block flex justify-between items-center'>
              <p className='text-xs text-textgray '>{item?.name}</p>
              <p className='break-all'>{item?.value}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default PaymentsInfo
