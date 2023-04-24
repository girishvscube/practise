import { uuid } from './../../../../utils/helpers'

interface Props {
  customerDetails?: any
}
const CustomerDetails: React.FC<Props> = ({ customerDetails }) => {
  const customerData = [
    {
      name: 'Company Name',
      value: customerDetails?.company_name,
    },
    {
      name: 'Customer ID',
      value: customerDetails?.id,
    },
    {
      name: 'Phone Number',
      value: customerDetails?.phone,
    },
    {
      name: 'Email ID',
      value: customerDetails?.email,
    },
    {
      name: 'Industry Type',
      value: customerDetails?.industry_type,
    },
    {
      name: 'Address line',
      value: customerDetails?.address,
    },
  ]

  return (
    <div className='divstyles bg-lightbg mb-4'>
      <p className='subheading'>Customer Details</p>
      <div className='grid-temp grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full '>
        {customerData?.length > 0 &&
          customerData?.map((item: any) => (
            <div
              key={uuid()}
              className='flex sm:flex-col flex-row sm:items-start items-center  justify-between'
            >
              <p className='text-xs text-textgray'>{item?.name}</p>
              <p className='break-all'>{item?.value}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CustomerDetails
