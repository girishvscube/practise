import React from 'react';
import Index from '../Index';
import Equipment from './Equipment/Equipment';
import Industry from './Industry/Industry';
import Address from './Address/Address';

const constTabs = [
  {
    id: 0,
    name: 'Industry Type',
  },
  {
    id: 1,
    name: 'Equipment Type',
  },
  {
    id: 2,
    name: 'Address Type',
  },
];
const Customer = () => (
  <div>
    <Index constTabs={constTabs} pages={[<Industry />, <Equipment />, <Address />]} cols="grid grid-cols-3" length={2} />
  </div>
);
export default Customer;
