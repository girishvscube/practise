interface Props {
  customerDetails?: any
  orderByid: any
}
const PaymentsAndInvoice: React.FC<Props> = ({ orderByid }) => {
  const customerData = [
    {
      name: 'Payment Term',
      value: orderByid?.data?.support_ticket?.order?.payment_type,
    },
    {
      name: 'Payment Status',
      value: orderByid?.data?.support_ticket?.order?.payment_status || 'NA',
    },
    {
      name: 'Total Amount Paid',
      value: '',
    },
    {
      name: 'Total Amount Due',
      value: '',
    },
    {
      name: 'Date of Payment',
      value: '',
    },
    {
      name: 'Invoice',
      value: '',
    },
  ];

  return (
    <div className='mobileView bg-lightbg mb-4'>
      <p className='subheading'>Payments and Invoice</p>
      <div className='subdiv grid grid-cols-1  sm:grid-cols-4 gap-x-8 w-full'>
        {customerData?.length > 0 &&
          customerData?.map((item: any) => (
            <div className='sm:block flex justify-between items-center'>
              <p className='text-xs text-textgray '>{item?.name}</p>
              <p className='break-all'>{item?.value || '--'}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PaymentsAndInvoice;
