import { uuid } from '../../../../utils/helpers';
interface Props {
  customerDetails?: any
  orderByid?: any
  PoById: any
}
const PriceInfo: React.FC<Props> = ({ orderByid, PoById }) => {
  // console.log(orderByid, 'orderByiddasdsaooopop');

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
      value: PoById?.price_per_litre,
    },
    {
      name: 'Order Quantity',
      value: PoById?.fuel_qty,
    },
    {
      name: 'Total',
      value: PoById?.total_amount,
    },
  ]

  const finalprice = [
    {
      name: 'Sub Total:',
      value: `₹ ${PoById?.total_amount}`,
    },
    {
      name: 'Total Tax:',
      value: `Inclusive of All Taxes`,
    },
    {
      name: 'Total:',
      value: `₹ ${PoById?.total_amount}`,
    },
    {
      name: 'Grand Total',
      value: `₹${PoById?.total_amount}`,
    },
  ]

  return (
    /* eslint-disable */
    <div className='divstyles bg-lightbg mb-4'>
      <p className='subheading'>PO Price info</p>

      <br className='block sm:hidden' />

      {/*price info for mobile */}
      <div className='grid  sm:hidden bg-darkbg subdiv  rounded-lg  font-nunitoRegular '>
        {priceinfo.map((item) => {
          return (
            <div key={uuid()} className='flex justify-between '>
              <p className='text-textgray text-sm'>{item.name}</p>
              <p className='break-all'>{item.value}</p>
            </div>
          )
        })}
        {/* <div className='pt-1 border-t border-border '></div> */}

        {finalprice.map((item) => {
          return (
            <div key={uuid()}className='flex justify-between border-t border-border '>
              <p className='text-textgray text-sm pt-4'>{item.name}</p>
              <p className='break-all pt-4'>{item.value}</p>
            </div>
          )
        })}
        <div className='border-t border-border pt-4'>
          <p>Additional Information:</p>
          <p className='text-2xl'>NA</p>
        </div>
      </div>

      {/*price info for desktop */}

      <div className=' hidden sm:block bg-darkbg  gap-y-6 rounded-lg  font-nunitoRegular'>
        <div className=' grid grid-cols-5 justify-evenly  w-full'>
          {priceinfo?.length > 0 &&
            priceinfo?.map((item: any) => (
              <div key={uuid()}className='py-4 border-b border-border flex justify-evenly '>
                <p className='text-xs text-textgray '>{item?.name}</p>
              </div>
            ))}
        </div>
        <div className=' grid grid-cols-5 justify-evenly  w-full'>
          {priceinfo?.length > 0 &&
            priceinfo?.map((item: any) => (
              <div  key={uuid()} className='py-8 border-b border-border flex justify-evenly '>
                <p className=''>{item?.value}</p>
              </div>
            ))}
        </div>

        <div className=' flex   w-full'>
          <div className='p-5 w-7/12 '>
            <p className='text-xs text-textgray '>Additional Information</p>
            <p>NA</p>
          </div>
          <div className=' border-border border-l   w-5/12'>
            <div className='p-5'>
              <div className=' flex justify-between '>
                <p className='text-xs text-textgray '>Sub Total:</p>
                <p>₹ {PoById?.total_amount}</p>
              </div>
              <div className='  flex justify-between'>
                <p className='text-xs text-textgray '>Total Tax:</p>
                <p>(Inclusive of All Taxes)</p>
              </div>
            </div>
            <div className='p-5 flex border-t border-border justify-between '>
              <p className='text-xs text-textgray '>Grand Total</p>
              <p className=' text-2xl font-extrabold'>₹ {PoById?.total_amount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    /* eslint-enable */
  )
}

export default PriceInfo
