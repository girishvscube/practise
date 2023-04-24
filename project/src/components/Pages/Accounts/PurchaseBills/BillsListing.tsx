import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import { SelectInput } from '../../../common/input/Select';
import BasicTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchpurchaseBillsList, fetchpurchaseBillsStats } from '../../../../features/accounts/purchaseBillsSlice';
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import InvoiceCreated from '../../../../assets/images/InvoiceCreated.svg';
import PoPaid from '../../../../assets/images/PoPaid.svg';
import PoNotPaid from '../../../../assets/images/PoNotPaid.svg';
import Card from '../CashIn/Card';
import { DateRangePicker } from '../../../common/input/DateRangePicker';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import moment from 'moment';
import { InputAdornments } from '../Expenses/SearchText';
import { Pagination } from '../../../common/Pagination/Pagination';
import { CountItems } from '../../../../utils/helpers';
import Badge from '@mui/material/Badge';
import { DateFiter } from '../../../../components/common/DateFiter';
const cols = [
  {
    title: 'PO No',
  },
  {
    title: 'Purchase Bill Created Date',
  },
  {
    title: 'Supplier Name',
  },
  {
    title: 'Bill Amount',
  },
  {
    title: 'Amount Paid',
  },
  {
    title: 'Balance',
  },
  {
    title: 'Status',
  },
  {
    title: 'Action',
  },
];

const Status = [
  {
    id: 'paid', name: 'Paid',
  },
  {
    id: 'unpaid', name: 'UnPaid',
  },
];



const BillsListing = () => {
  const { purchaseBillsList, Loading, metadata, purchaseBillStats } = useSelector((state: any) => state.purchaseBill);
  const { totalBills, total } = metadata;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const initalStates: any = {
    search_key: '',
    status: '',
    start_date: '',
    end_date: '',
  };
  const [params, setParams] = useState(initalStates);

  const [date, setDate] = useState({
    start_date: '',
    end_date: ''
  })

  const handleActivateFilter = () => {
    setFilter(!filter);
  };
  const handleCancel = () => {
    setParams({ ...params, search_key: '', status: '', start_date: '', end_date: '' });
    let reset: any = null;
    setEndDate(reset)
    setStartDate(reset)
    setCurrentPage(1)
    dispatch(fetchpurchaseBillsList(1, '', '', '', ''));
    setFiltersCount(0)
  };

  const handleSubmit = () => {
    setCurrentPage(1)
    dispatch(fetchpurchaseBillsList(1, params.start_date, params.end_date, params.search_key, params.status));
    const count = CountItems(params)
    { count > 3 ? setFiltersCount(count - 1) : setFiltersCount(count) }

  };

  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };



  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    const sDate = moment(start).format('YYYY-MM-DD');
    const eDate = moment(end).format('YYYY-MM-DD');
    setParams({ ...params, start_date: sDate, end_date: eDate });
  };


  useMemo(() => {
    dispatch(fetchpurchaseBillsStats(date.start_date, date.end_date));
  }, [date]);

  const onDateSelect = (date: any) => {
    setDate(date)
  };

  useMemo(() => {
    dispatch(fetchpurchaseBillsList(currentPage, params.start_date, params.end_date, params.search_key, params.status));
  }, [currentPage]);

  return (
    <div className="users-section">
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Bills Analytics</p>
        <div className='hidden sm:block'>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>
      <div className='w-full sm:hidden '>
        <br />
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <Card text="Total PO Created" value={purchaseBillStats?.total || 0} image={InvoiceCreated} />
        <Card text="Total PO Paid" value={purchaseBillStats?.paid || 0} image={PoPaid} />
        <Card text="Total PO Not Paid" value={purchaseBillStats?.unpaid || 0} image={PoNotPaid} />

      </div>

      <div className="mt-7 flex justify-between">
        <div>
          <p className="text-xl font-extrabold text-white font-nunitoRegular">
            List of Purchase Bills
          </p>
          <div className="w-full border-b border-border" />
          <p className="text-xs font-nunitoRegular mt-1 font-normal">
            Total Number Of Purchase Bills:
            {' '}
            {totalBills}
          </p>
        </div>

        <div className=" gap-6 hidden lg:flex">
          <Badge color="secondary" className='text-black' badgeContent={filtersCount}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <CustomButton
              onClick={handleActivateFilter}
              variant="outlined"
              size="large"
              icon={<img src={FilterLight} alt="" />}
              borderRadius="0.5rem"
              width="w-fit"
            >
              <p className="font-bold text-yellow font-nunitoRegular text-sm	">Filter</p>
            </CustomButton>
          </Badge>
        </div>
      </div>

      <div className=" w-full justify-end mt-6 gap-6 lg:hidden flex">
        <Badge color="secondary" className='text-black' badgeContent={filtersCount}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <CustomButton
            onClick={handleActivateFilter}
            variant="outlined"
            size="large"
            icon={<img src={FilterLight} alt="" />}
            borderRadius="0.5rem"
            width="w-fit"
          >
            <p className="font-bold text-yellow font-nunitoRegular text-sm	">Filter</p>
          </CustomButton>
        </Badge>
      </div>

      {
        filter === true ? (
          <>
            <div className="mt-6 flex flex-col lg:flex-row gap-6 pr-0 lg:pr-20 w-full filters">
              <div className="w-full lg:w-[300px]">
                <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
              </div>

              <div className="w-full lg:w-[300px]">
                <SelectInput
                  width="100%"
                  options={Status}
                  handleChange={handleSearch}
                  value={params.status}
                  label="Status"
                  name="status"
                />
              </div>
              <div className="w-full lg:w-[30%]">
                <InputAdornments handleChange={handleSearch} label="Search" name="search_key" value={params.search_key} width="w-full" />
              </div>
              <div className="mt-2 flex justify-end ">

                <div className='flex justify-center gap-4'>
                  <CustomButton
                    disabled={CountItems(params) === 0}
                    onClick={handleSubmit}
                    width="w-[130px]"
                    variant="outlined"
                    size="large"
                    borderRadius="0.5rem"
                  >
                    Apply Filter
                  </CustomButton>

                  <div className='mt-3 cursor-pointer' onClick={handleCancel}>
                    <p><u>Reset</u></p>
                  </div>
                </div>

              </div>
            </div>

          </>
        ) : null
      }

      {purchaseBillsList?.length > 0 ? (
        <p className="mt-[16px] text-textgray text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">
            {' '}
            {purchaseBillsList.length + (currentPage - 1) * 10}
          </span>
          {' '}
          out
          of
          {' '}
          <span className="text-white">{totalBills}</span>
          {' '}
          results
        </p>
      ) : null}

      {Loading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : purchaseBillsList?.length > 0 ? (
        <div>
          <div className="w-full  bg-[#404050] rounded-lg mt-[16px]">
            <BasicTable cols={cols} data={purchaseBillsList} />
          </div>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={metadata.totalBills}
            pageSize={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-4 mt-6">
          <img src={NotFound} alt="" />
          <p className="text-[18px] font-nunitoBold">No Results found !!</p>
        </div>
      )}

    </div>
  );
};

export default BillsListing;
