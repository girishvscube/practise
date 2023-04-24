import CustomButton from '../../../common/Button'
import moment from 'moment'
import { NumInWords } from '../../../../utils/helpers'
import { uuid } from './../../../../utils/helpers'
interface Props {
  order?: any
  handleStep?: any
  GeneratePI?: any
  handleBack?: any
  total_meta: any
  response?: any
  setButtonDisable: any
  buttonDisable: any
}

const Proforma: React.FC<Props> = ({
  response,
  order,
  handleStep,
  GeneratePI,
  handleBack,
  total_meta,
  setButtonDisable,
  buttonDisable,
}) => {
  console.log('response:', response)

  const terms = [
    'Subject to out home jurisdiction.',
    'Our Responibility ceases as soon as goods leaves our premises.',
    'Goods once sold will not taken back.',
    'Delivery Ex-Premises',
  ]

  const data = [
    {
      name: 'Payment Terms',
      value: order?.payment_type || '',
    },
    {
      name: 'Amount Due',
      value: `₹ ${order?.grand_total || 0}`,
    },
    {
      name: 'Due Date',
      value: moment(order.due_date).format('DD-MM-YYYY') || '',
    },
  ]

  return (
    <div>
      <div className='divstyles bg-lightbg mb-4'>
        <p className='subheading'>Basic info</p>
        <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full'>
          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>PI NO</p>
            <p className={`break-normal text-sm`}>PI{order?.id}</p>
          </div>
          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>PI Date</p>
            <p className={`break-normal text-sm`}>
              <p>{moment(order?.created_at).format('DD/MM/YYYY')}</p>
            </p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>SO NO</p>
            <p className={`break-normal text-sm`}>SO{order?.id}</p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Estimated Time of Delivery</p>
            <p className={`break-normal text-sm`}>
              <p>
                {order?.time_slot || '--'}
              </p>
              <p>{moment(order?.delivery_date).format('DD/MM/YYYY')}</p>
            </p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Payment Terms</p>
            <p className={`break-normal text-sm`}>{total_meta?.payment_type}</p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Order type</p>
            <p className={`break-normal text-sm`}>{order?.order_type}</p>
          </div>
        </div>
      </div>

      {/* 2. Customer Details */}
      <div className='divstyles bg-lightbg mb-4'>
        <p className='subheading'>Customer Details</p>
        <div className='subdiv grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full'>
          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Customer ID</p>
            <p className={`  break-normal text-sm`}>{order?.customer_id}</p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Company Name</p>
            <p className={`  break-normal text-sm`}>{response?.customer?.company_name}</p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Company Address</p>
            {response?.customer?.state ? (
              <p className='break-normal text-sm sm:w-full  '>
                {`${response?.customer?.address}, 
              ${response?.customer?.city}, 
              ${response?.customer?.state}, 
              ${response?.customer?.pincode}`}
              </p>
            ) : (
              ''
            )}
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Company Phone</p>
            <p className={`break-normal text-sm w-24  `}>{order?.customer?.phone}</p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Company Email</p>
            <p className={`break-normal text-sm w-24  `}>{order?.customer?.email}</p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>Delivery Address</p>
            {order?.customer_delivery_details?.state ? (
              <p className='break-normal text-sm sm:w-full  '>
                {`${order?.customer_delivery_details?.address_1}, 
              ${order?.customer_delivery_details?.address_2}, 
              ${order?.customer_delivery_details?.city}, 
              ${order?.customer_delivery_details?.state}, 
              ${order?.customer_delivery_details?.pincode}`}
              </p>
            ) : (
              '--'
            )}
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>GST No.</p>
            <p className={`break-normal text-sm w-24  `}>{response?.customer?.gst_no}</p>
          </div>

          <div className='flex flex-row sm:items-start items-center justify-between  sm:flex-col'>
            <p className='text-xs text-textgray '>State</p>
            <p className={`break-normal text-sm w-24  `}>{response?.customer?.state}</p>
          </div>
        </div>
      </div>

      {/* mobile */}

      <div className='sm:hidden  divstyles bg-lightbg mb-4'>
        <div className='grid gap-4  sm:hidden bg-darkbg subdiv  gap-y-6 rounded-lg font-nunitoRegular '>
          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>SNO</p>
            <p className='break-all'>1</p>
          </div>

          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>Product Name</p>
            <p className='break-all'>ATD Diesel</p>
          </div>

          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>Price Per Litre</p>
            <p className='break-all'>{order?.per_litre_cost}</p>
          </div>

          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>Order Quantity</p>
            <p className='break-all'>{order?.fuel_qty} Litres</p>
          </div>
          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>Order Total</p>
            <p className='break-all'>{order?.total_amount}</p>
          </div>

          <div className='pt-1 border-t border-border '></div>

          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>Payment Terms</p>
            <p className='break-all text-sm'>{order?.payment_type}</p>
          </div>

          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>Amount Due:</p>
            <p className='break-all text-sm'>{order?.grand_total}</p>
          </div>

          <div className='flex justify-between '>
            <p className='text-textgray text-xs'>Due Date:</p>
            <p className='break-all text-sm'>{moment(order?.due_date).format('DD-MM-YYYY')}</p>
          </div>

          <div className='pt-1 border-t border-border '></div>

          <div>
            <p className='text-textgray text-xs'>Amount Chargable in Words:</p>
            <p className='text-sm'>
              {order?.total_amount ? NumInWords(order?.grand_total) +'Rupees Only' : '--'}
            </p>
          </div>
        </div>
        <br />

        <div className='subdiv'>
          {data?.map((item) => (
            <div key={uuid()}>
              <div className=' flex items-center justify-between gap-2 my-4'>
                <p className='text-xs text-textgray  '>{item?.name}</p>
                <p className='text-sm '>{item?.value}</p>
              </div>
            </div>
          ))}
        </div>

        <br />

        {/* Terms and Conditions */}

        <div className='subdiv'>
          <div>
            <p className='text-xs border-border pb-3 mb-3 border-b text-textgray'>
              Terms and Conditions
            </p>
            <ol className='p-1'>
              {terms?.map((t: any, index: number) => (
                <li key={uuid()} className='text-sm'>
                  {index + 1}. {t}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <br />
        <div className='subdiv'>
          <p className='text-xs text-textgray border-border pb-3 mb-3 border-b '>Additional Note</p>

          <p className='text-sm '>{order.additional_notes}</p>
        </div>

        <br />

        <CustomButton
          disabled={buttonDisable.proforma}
          borderRadius='0.5rem'
          onClick={GeneratePI}
          width='w-9/12 m-auto'
          variant='contained'
          size='large'
        >
          Confirm and Generate PI
        </CustomButton>
      </div>

      {/* desktop */}
      <div className='hidden sm:flex divstyles bg-lightbg mb-4'>
        <div className='bg-darkbg  gap-y-6 rounded-lg  font-nunitoRegular w-full'>
          <div className=' grid grid-cols-5 justify-evenly  w-full'>
            <div className='py-4 border-b border-border flex justify-evenly '>
              <p className='text-xs text-textgray '>Sl No.</p>
            </div>
            <div className='py-4 border-b border-border flex justify-evenly '>
              <p className='text-xs text-textgray '>Product Name</p>
            </div>

            <div className='py-4 border-b border-border flex justify-evenly '>
              <p className='text-xs text-textgray '>Price Per Litre</p>
            </div>
            <div className='py-4 border-b border-border flex justify-evenly '>
              <p className='text-xs text-textgray '>Order Quantity</p>
            </div>

            <div className='py-4 border-b border-border flex justify-evenly '>
              <p className='text-xs text-textgray '>Order Total</p>
            </div>
          </div>
          <div className=' grid grid-cols-5 justify-evenly  w-full'>
            <div className='py-8 border-b border-border flex justify-evenly '>
              <p className=''>1</p>
            </div>

            <div className='py-8 border-b border-border flex justify-evenly '>
              <p className=''>ATD Diesel</p>
            </div>

            <div className='py-8 border-b border-border flex justify-evenly '>
              <p className=''>{order?.per_litre_cost}</p>
            </div>

            <div className='py-8 border-b border-border flex justify-evenly '>
              <p className=''>{order?.fuel_qty} Litres</p>
            </div>

            <div className='py-8 border-b border-border flex justify-evenly '>
              <p className=''>{order?.total_amount}</p>
            </div>
          </div>

          <div className=' flex   w-full'>
            <div className=' w-8/12'>
              <div className=' border-b border-border p-6'>
                <p className='text-xs text-textgray'>Amount Chargable in Words:</p>
                <p>{order?.total_amount ? NumInWords(order?.total_amount) : '--'}</p>
              </div>
              <div className='grid  grid-cols-2 justify-between border-b border-border'>
                <div className='p-6'>
                  <p className='text-xs text-textgray'>Terms and Conditions</p>
                  <ol className='p-1'>
                    {terms?.map((t: any, index: number) => (
                      <li key={uuid()} className='text-sm'>
                        {index + 1} .{t}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className='p-6 border-border border-l'>
                  <ol className='p-1'>
                    {data?.map((item) => (
                      <div key={uuid()}>
                        <div className=' flex items-center gap-2 my-4'>
                          <p className='text-xs text-textgray  '>{item?.name}</p>
                          <p className='text-sm '>{item?.value}</p>
                        </div>
                      </div>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Additional Notest */}
              <div className='grid grid-cols-2 justify-between '>
                <div className='p-6  '>
                  <p className='text-xs text-textgray '>Additional Notes</p>
                  <p className='text-sm'>Requested on time Delivery</p>
                </div>
              </div>
            </div>
            <div className=' border-border border-l w-4/12'>
              <div className=''>
                <div className=' flex justify-between py-4 px-4 border-b border-border '>
                  <p className='text-xs text-textgray '>Taxable Amount</p>
                  <p className='text-sm'> ₹ {order?.total_amount}</p>
                </div>

                <div className=' flex justify-between py-4 px-4 border-b border-border '>
                  <p className='text-xs text-textgray '>Delivery Charges</p>
                  <p className='text-sm'> ₹ {order?.delivery_charges}</p>
                </div>

                {order.discount ? (
                  <div className=' flex justify-between py-4 px-4 border-b border-border '>
                    <p className='text-xs text-textgray '>
                      Discount Applied{' '}
                      {order?.discount_type === 'Percentage' ? order?.discount + '%' : ''}{' '}
                    </p>
                    <p className='text-sm'>
                      {' '}
                      ₹{' '}
                      {order?.discount_type === 'Percentage'
                        ? (order.total_amount * order.discount) / 100 || 0
                        : order.discount || 0}
                    </p>
                  </div>
                ) : (
                  <></>
                )}

                <div className=' flex justify-between py-4 px-4 border-b border-border '>
                  <p className='text-xs text-textgray '>Total Tax:</p>
                  <p className='text-sm'> (Inclusive of All Taxes)</p>
                </div>
                <div className=' flex justify-between py-4 px-4 border-b border-border '>
                  <p className='text-xs text-textgray '>Total Due Amount</p>
                  <p className='text-sm'> ₹ {order?.grand_total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAavigation Buttons */}
      <div className=' hidden sm:flex items-center justify-center lg:justify-between mt-20 lg:mt-10'>
        <CustomButton
          disabled={buttonDisable.proforma}
          borderRadius='0.5rem'
          onClick={() => {
            handleStep(2)
            handleBack()
          }}
          variant='outlined'
          size='large'
        >
          Go Back
        </CustomButton>

        <div className='flex gap-8'>
          <div className='w-[150px] lg:w-[307px]'>
            <CustomButton
              disabled={buttonDisable.proforma}
              borderRadius='0.5rem'
              onClick={GeneratePI}
              // width="w-[307px]"
              width='w-full'
              variant='contained'
              size='large'
            >
              Confirm and Generate PI
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Proforma
