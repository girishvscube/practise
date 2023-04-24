import React from 'react';
import Index from '../Index';
import LeadStatus from './LeadStatus/LeadStatus';
import OrderStatus from './OrderStatus/OrderStatus';
import DeliveryStatus from './DeliveryTime/DeliveryTime';
import LeadSource from './LeadSource/LeadSource';

const constTabs = [
  {
    id: 0,
    name: 'Lead Status',
  },
  {
    id: 1,
    name: 'Order Status',
  },
  {
    id: 2,
    name: 'Delivery Time Slots',
  },
  {
    id: 3,
    name: 'Lead Source',
  },
];
const Customer = () => (
  <div>
    <Index constTabs={constTabs} pages={[<LeadStatus />, <OrderStatus />, <DeliveryStatus />, <LeadSource />]} cols="grid grid-cols-4" length={3} />
  </div>
);
export default Customer;
