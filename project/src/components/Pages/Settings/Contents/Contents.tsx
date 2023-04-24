import React, { useState } from 'react';
import Users from './Users/Users';
import Customer from './Customers/Customer';
import Suppliers from './Suppliers/Suppliers';
import Sales from './Sales/Sales';
import Fleets from './Fleets/Fleets';
import Supports from './Supports/Support';
import Accounts from './Accounts/Accounts';

const Contents = () => {
  const content = [
    {
      id: 0,
      name: 'Users',
    },
    {
      id: 1,
      name: 'Customers',
    },
    {
      id: 2,
      name: 'Suppliers',
    },
    {
      id: 3,
      name: 'Sales',
    },
    {
      id: 4,
      name: 'Fleets',
    },
    {
      id: 5,
      name: 'Supports',
    },
    {
      id: 6,
      name: 'Accounts',
    },
  ];

  const pages: any = [<Users />, <Customer />, <Suppliers />, <Sales />, <Fleets />, <Supports />, <Accounts />];

  const [Activeindex, setActiveIndex] = useState(0);

  const handleClick = (id: any) => {
    setActiveIndex(id);
  };
  return (
    <div className="grid grid-cols-[12rem,minmax(700px,_1fr)] gap-6">
      <div className="border-border border rounded-lg bg-lightbg">
        {
          content.map((item, index) => (
            <div>
              {
                index === Activeindex ? <p className="mb-1 py-2 px-4 text-yellow font-nunitoRegular font-semibold cursor-pointer" onClick={() => { handleClick(item?.id); }}>{item?.name}</p> : <p className="mb-1 py-2 px-4 cursor-pointer" onClick={() => { handleClick(item?.id); }}>{item?.name}</p>

              }
              <div className="w-full border-b border-border mb-1 font-nunitoRegular font-semibold" />
            </div>
          ))
        }
      </div>
      {
        pages[Activeindex]
      }

    </div>

  );
};

export default Contents;
