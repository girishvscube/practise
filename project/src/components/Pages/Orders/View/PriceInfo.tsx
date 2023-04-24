import { uuid } from './../../../../utils/helpers'
interface Props {
  orderByid: any
}
const PriceInfo: React.FC<Props> = ({ orderByid }) => {
  // console.log(orderByid, 'orderByiddasdsaooopop');
  const customerData = [
    {
      name: 'Actual Order Value',
      value: orderByid?.order?.total_amount,
    },
    {
      name: 'Discounted Price',

      /* eslint-disable */
      value:
        orderByid?.order?.discount === 'Percentage'
          ? (orderByid?.order?.total_amount * orderByid?.order?.discount) / 100
          : orderByid?.order?.discount,
    },
    /* eslint-enable */
    {
      name: 'Edited Price Value',
      value: '',
    },
  ]
  const priceinfo = [
    {
      name: 'Sl No.',
      value: 1,
    },
    {
      name: 'Product Name',
      value: 'ATD Diesel',
    },
    {
      name: 'Price Per Litre',
      value: orderByid?.order?.per_litre_cost,
    },
    {
      name: 'Order Quantity',
      value: orderByid?.order?.fuel_qty,
    },
    {
      name: 'Total',
      value: orderByid?.order?.grand_total,
    },
  ]

  const finalprice = [
    {
      name: 'Fuel Price',
      value: `₹${orderByid?.order?.total_amount}`,
    },
    {
      name: 'Delivery Charges',
      value: `₹${orderByid?.order?.delivery_charges}`,
    },
    {
      name: 'Discount 5%',
      value: `-  ₹ ${
        orderByid?.order?.discount_type === 'Percentage'
          ? (orderByid?.order?.total_amount * orderByid?.order?.discount) / 100
          : orderByid?.order?.discount
      }`,
    },
    {
      name: 'Grand Total',
      value: `₹ ${orderByid?.order?.grand_total}`,
    },
  ]

  return (
    /* eslint-disable */
    <div className='divstyles bg-lightbg mb-4'>
      <p className='subheading'>Price info</p>
      <div className='subdiv grid grid-flow-row sm:grid-flow-col  grid-cols-1 sm:grid-cols-3 gap-x-8 w-full items-baseline'>
        {customerData?.length > 0 &&
          customerData?.map((item: any) => (
            <div key={uuid()} className='flex sm:block justify-between'>
              <p className='text-textgray text-sm '>{item?.name}</p>
              <p className='break-all'>{item?.value || '--'}</p>
            </div>
          ))}
      </div>

      <br className='block sm:hidden' />

      {/*price info for mobile */}
      <div className='grid gap-4  sm:hidden bg-darkbg subdiv  gap-y-6 rounded-lg  font-nunitoRegular '>
        {priceinfo.map((item) => {
          return (
            <div key={uuid()} className='flex justify-between '>
              <p className='text-textgray text-sm'>{item.name}</p>
              <p className='break-all'>{item.value || '--'}</p>
            </div>
          )
        })}
        <div className='pt-1 border-t border-border '></div>

        {finalprice.map((item) => {
          return (
            <div key={uuid()} className='flex justify-between '>
              <p className='text-textgray text-sm'>{item.name}</p>
              <p className='break-all'>{item.value || '--'}</p>
            </div>
          )
        })}
      </div>

      <br />

      {/*price info for desktop */}
      <div className='sm:block hidden bg-darkbg  gap-y-6 rounded-lg  font-nunitoRegular'>
        <div className=' grid grid-cols-5 justify-evenly  w-full'>
          {priceinfo?.length > 0 &&
            priceinfo?.map((item: any) => (
              <div key={uuid()} className='py-4 border-b border-border flex justify-evenly '>
                <p className='text-xs text-textgray '>{item?.name}</p>
              </div>
            ))}
        </div>
        <div className=' grid grid-cols-5 justify-evenly  w-full'>
          {priceinfo?.length > 0 &&
            priceinfo?.map((item: any) => (
              <div key={uuid()} className='py-8 border-b border-border flex justify-evenly '>
                <p className=''>{item?.value}</p>
              </div>
            ))}
        </div>

        <div className=' flex   w-full'>
          <div className=' w-7/12' />
          <div className=' border-border border-l w-5/12'>
            <div className='p-5'>
              <div className=' flex justify-between '>
                <p className='text-xs text-textgray '>Fuel Price</p>
                <p>{orderByid?.order?.total_amount}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-xs text-textgray '>Delivery Charges</p>
                <p>{orderByid?.order?.delivery_charges}</p>
              </div>

              {orderByid?.order?.discount ? (
                <div className=' flex justify-between '>
                  <p className='text-xs text-textgray '>
                    Discount
                    {orderByid?.order?.discount_type === 'Percentage'
                      ? ` ${orderByid?.order?.discount} %`
                      : ''}
                  </p>

                  <p>
                    - ₹
                    {orderByid?.order?.discount_type === 'Percentage'
                      ? (orderByid?.order?.total_amount * orderByid?.order?.discount) / 100
                      : orderByid?.order?.discount}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className='p-5 flex border-t border-border justify-between '>
              <p className='text-xs text-textgray '>Grand Total</p>
              <p>₹{orderByid?.order?.grand_total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    /* eslint-enable */
  )
}

export default PriceInfo
