import Status from '../../../common/Status';
import moment from 'moment';

interface Props {
  customerDetails?: any
}
const OrderInfo: React.FC<Props> = ({ customerDetails }) => {
  const customerData = [
    {
      name: 'Order ID',
      value: customerDetails?.data?.support_ticket?.order.id,
    },
    {
      name: 'Order Date',
      value: moment(customerDetails?.data?.support_ticket?.order.created_at).format('DD/MM/YYYY'),
    },
    {
      name: 'Order Type',
      value: customerDetails?.data?.support_ticket?.order.order_type,
    },
    {
      name: 'Fuel Quantity',
      value: `${customerDetails?.data?.support_ticket?.order.fuel_qty} L`,
    },
    {
      name: 'Delivery Date',
      value: moment(customerDetails?.data?.support_ticket?.order.delivery_date).format('DD/MM/YYYY'),
    },
    {
      name: 'Delivery TimeSlot',
      value: `${customerDetails?.data?.support_ticket?.order?.time_slot
        }` || 'NA',
    },
    {
      name: 'Order Status',
      value: customerDetails?.data?.support_ticket?.order.status,
    },
  ];

  return (
    <div className='mobileView bg-lightbg mb-4'>
      <p className='subheading'>Order Details</p>
      <div className='grid-temp grid grid-cols-1 sm:grid-cols-4 gap-x-8 w-full '>
        {customerData?.length > 0 &&
          customerData?.map((item: any) => (
            <div className='flex sm:flex-col flex-row sm:items-start items-center  justify-between'>
              <p className='text-xs text-textgray'>{item?.name}</p>
              {
                item?.name.includes('Status') ? <Status>{item?.value}</Status> : <p className='break-all'>{item?.value}</p>
              }

            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderInfo;
