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
  ];

  return (
    <div className="mobileView bg-lightbg mb-4">
      <p className="subheading">Customer Details</p>
      <div className="subdiv grid grid-cols-4 gap-x-8 w-full">
        {customerData?.length > 0
          && customerData?.map((item: any) => (
            <div className="'flex sm:flex-col flex-row sm:items-start items-center  justify-between'">
              <p className="text-xs text-textgray ">{item?.name}</p>
              <p className="break-all">{item?.value}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerDetails;
