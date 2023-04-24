import { uuid } from '../../../../utils/helpers'
interface Props {
  customerDetails?: any
  PoById: any
}
const SupplierDetails: React.FC<Props> = ({ customerDetails, PoById }) => {
  const customerData = [
    {
      name: 'Supplier Name',
      value: PoById?.supplier?.name,
    },
    {
      name: 'Supplier ID',
      value: PoById?.supplier?.id,
    },
    {
      name: 'Phone Number',
      value: PoById?.supplier?.phone,
    },
    {
      name: 'Email ID',
      value: PoById?.supplier?.email,
    },

    {
      name: 'Address line',
      value: `${PoById?.supplier?.address},`,
      city: `${PoById?.supplier?.city},`,
      state: `${PoById?.supplier?.state},`,
      pincode: `${PoById?.supplier?.pincode}.`,
    },
  ]

  return (
    <div className='divstyles bg-lightbg mb-4'>
      <p className='subheading'>Supplier Info</p>
      <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full'>
        {customerData?.length > 0 &&
          customerData?.map((item: any) => (
            <div
              key={uuid()}
              className='flex sm:flex-col flex-row sm:items-start items-center  justify-between'
            >
              <p className='text-xs text-textgray'>{item?.name}</p>
              <p className='break-all sm:text-left text-right'>
                {item?.value}
                {item.name === 'Address line' && (
                  <>
                    <br />
                    {item?.city}
                    <br />
                    {item?.state}
                    <br />
                    {item?.pincode}
                  </>
                )}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default SupplierDetails
