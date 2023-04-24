import React from 'react';
import Index from '../Index';
import BowserStatus from './BowserStatus/BowserStatus';
import TripStatus from './TripStatus/TripStatus';
import FuelStatus from './FuelStatus/FuelCapacity';

const constTabs = [
  {
    id: 0,
    name: 'Trip Status',
  },
  {
    id: 1,
    name: 'Bowser Status',
  },
  {
    id: 2,
    name: 'Fuel Capacity of Bowsers',
  },
];
const Fleets = () => (
  <div>
    <Index constTabs={constTabs} pages={[<TripStatus />, <BowserStatus />, <FuelStatus />]} cols="grid grid-cols-3" length={2} />
  </div>
);
export default Fleets;
