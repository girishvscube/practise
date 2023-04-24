import React from 'react';
import Index from '../Index';
import SupplierType from './SupplierType/SupplierType';

const constTabs = [
  {
    id: 0,
    name: 'Supplier Type',
  },
];
const Supplier = () => (
  <div>
    <Index constTabs={constTabs} pages={[<SupplierType />]} cols="grid grid-cols-1" length={1} />
  </div>
);
export default Supplier;
