import { useState } from 'react';
import { DateRangePicker } from '../../../../common/input/DateRangePicker';
import OrderTable from './Table';
import { SelectInput } from '../../../../common/input/Select';
import TablePagination from '../../../User/Pagination';

const Payments = () => {
  const [startDate] = useState();
  const [endDate] = useState(null);
  const onChange = () => {};

  const rows = [
    {
      id: 1,
    },
  ];

  const options = [
    {
      id: 'All',
      name: 'All',
    },
  ];
  return (
    <div className="divstyles bg-lightbg flex flex-col gap-6">
      <div className="flex justify-between">
        <div>
          <p className="subheading"> Transactions</p>
        </div>

        <div className="flex gap-2">
          <div className="w-[150px]">
            <SelectInput options={options} label="All" width="w-full" />
          </div>
          <div>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className="bg-darkbg  rounded-lg">
        <OrderTable rows={rows} />
      </div>
      <TablePagination onChange={onChange} page={1} count={10} />
    </div>
  );
};

export default Payments;
