interface Props {
  customerDetails?: any
}
const CustomerDetails: React.FC<Props> = ({ customerDetails }) => {
  const customerData = [
    {
      name: 'Company Name',
      value: customerDetails?.data?.support_ticket?.order?.customer.company_name,
    },
    {
      name: 'Customer ID',
      value: customerDetails?.data?.support_ticket?.order?.customer.id,
    },
    {
      name: 'Phone Number',
      value: `+91 ${customerDetails?.data?.support_ticket?.order?.customer?.phone}`,
    },
    {
      name: 'Email ID',
      value: `${customerDetails?.data?.support_ticket?.order?.customer.email || 'NA'}`,
    },
    {
      name: 'Industry Type',
      value: `${customerDetails?.data?.support_ticket?.order?.customer?.industry_type || 'NA'}`,
    },
    {
      name: 'Address line',
      value: `${customerDetails?.email || 'NA'}`,
    },
  ]

  return (
    <div className='mobileView bg-lightbg mb-4'>
      <p className='subheading'>Customer Details</p>
      <div className='grid-temp grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full '>
        {customerData?.length > 0 &&
          customerData?.map((item: any) => (
            <div className='flex sm:flex-col flex-row sm:items-start items-center  justify-between'>
              <p className='text-xs text-textgray'>{item?.name}</p>
              <p className='break-all'>{item?.value}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CustomerDetails
