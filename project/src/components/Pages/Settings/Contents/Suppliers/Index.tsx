import React, { useState } from 'react';
import PaymentTerm from './SupplierPayments/PaymentsTerms';
import SupplierType from './SupplierType/SupplierType';
// import Industry from './Industry/Industry'
// import Address from './Address/Address'
const constTabs = [
  {
    id: 0,
    name: 'Supplier Type',
  }
];
const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (id: any) => {
    setActiveIndex(id);
  };

  const pages: any = [<SupplierType />];
  return (
    <div className="border border-border rounded-lg bg-lightbg">
      <div className="grid grid-cols-2">
        {
          constTabs.map((item, index) => (

            <div className={index === 1 ? 'border-none flex justify-center' : 'border-r border-border flex justify-center'}>
              {
                index === activeIndex ? <p className="mb-1 py-2 px-4 text-yellow font-nunitoRegular font-semibold cursor-pointer" onClick={() => { handleClick(item?.id); }}>{item?.name}</p> : <p className="mb-1 py-2 px-4 cursor-pointer" onClick={() => { handleClick(item?.id); }}>{item?.name}</p>

              }

            </div>

          ))
        }

      </div>

      <div className="w-full border-b border-border mb-1 font-nunitoRegular font-semibold" />
      {
        pages[activeIndex]
      }

    </div>
  );
};

export default Index;
