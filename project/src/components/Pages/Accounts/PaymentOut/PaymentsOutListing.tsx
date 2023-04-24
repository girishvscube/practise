import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import Profile from '../../../../assets/images/PlusBlack.svg';
import { SelectInput } from '../../../common/input/Select';
import { useNavigate } from 'react-router-dom';
import BasicTable from './Table';
import { useDispatch, useSelector } from 'react-redux';

import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import { DateRangePicker } from '../../../common/input/DateRangePicker';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import moment from 'moment';
import { fetchpayoutList } from '../../../../features/accounts/payOutSlice'

import { fetchaccountsDropdown } from '../../../../features/dropdowns/dropdownSlice';
import { InputAdornments } from '../Expenses/SearchText';
import { Pagination } from '../../../common/Pagination/Pagination';
import { CountItems } from '../../../../utils/helpers';
import Badge from '@mui/material/Badge';
const cols = [
  {
    title: 'Pay-out No',
  },
  {
    title: 'Pay-out Date',
  },
  {
    title: 'Supplier Name',
  },
  {
    title: 'Purchase Order No',
  },
  {
    title: 'Payment Account',
  },
  {
    title: 'Notes',
  },
  {
    title: 'Amount Paid',
  },
  {
    title: 'Action',
  },
];


const PaymentsOutListing = () => {

  const { payoutList, Loading, metadata } = useSelector((state: any) => (state.payout))
  const { accountsDropdown } = useSelector((state: any) => state.dropdown);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { totalPayout } = metadata;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);

  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const initalStates: any = {
    search_key: '',
    start_date: '',
    end_date: '',
    bank_account_id: ''
  };
  const [params, setParams] = useState(initalStates);
  const [filtersCount, setFiltersCount] = useState(0);
  const handleActivateFilter = () => {
    setFilter(!filter);
  };
  const handleCancel = () => {
    setParams({ ...params, bank_account_id: '', search_key: '', start_date: '', end_date: '' });
    dispatch(fetchpayoutList(1, '', '', '', ''));
    let reset: any = null;
    setStartDate(reset)
    setEndDate(reset)
    setApplyFilter(false);
    setFiltersCount(0)
  };

  const handleSubmit = () => {
    setApplyFilter(true);
    dispatch(fetchpayoutList(currentPage, params.start_date, params.end_date, params.search_key, params.bank_account_id));
    const count = CountItems(params)
    console.log(isdate(params), 'isdate')
    isdate(params) ? setFiltersCount(count - 1) : setFiltersCount(count)
  }

  const isdate = (params: any) => {
    for (let key in params) {
      if (params[key].toString().includes('-')) return true
    }
  }
  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
    setApplyFilter(false);
  };

  //handle
  const handleCreate = () => {
    navigate('/accounts/create/payments-out');
  };

  useEffect(() => {
    dispatch(fetchaccountsDropdown());
  }, []);

  // DateRange picker for Payin Filter
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    const sDate = moment(start).format('YYYY-MM-DD');
    const eDate = moment(end).format('YYYY-MM-DD');
    setParams({ ...params, start_date: sDate, end_date: eDate });
  };



  useMemo(() => {
    dispatch(fetchpayoutList(currentPage, params.start_date, params.end_date, params.search_key, params.bank_account_id));
  }, [currentPage]);

  return (
    <div className="users-section">
      <div className="mt-6 flex justify-between">
        <div>
          <p className="text-xl font-extrabold text-white font-nunitoRegular">
            List of Payment-Out
          </p>
          <div className="w-full border-b border-border" />
          <p className="text-xs font-nunitoRegular mt-1 font-normal">
            Total Payment Out:
            {' '}
            {totalPayout}
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
          <CustomButton
            onClick={handleCreate}
            width="w-fit"
            variant="contained"
            size="large"
            icon={<img src={Profile} alt="" />}
            borderRadius="8px"
          >
            <p className="font-bold font-nunitoRegular text-sm ">Record Pay-Out</p>
          </CustomButton>
        </div>
      </div>

      <div className=" w-full justify-end mt-6 gap-6 lg:hidden flex">
        <CustomButton
          onClick={handleActivateFilter}
          variant="outlined"
          size="large"
          icon={<img src={FilterLight} alt="" />}
          borderRadius="8px"
        >
          <p className="font-bold font-nunitoRegular text-sm">Filter</p>
        </CustomButton>
        <CustomButton
          onClick={handleCreate}
          width="w-fit"
          variant="contained"
          size="large"
          icon={<img src={Profile} alt="" />}
          borderRadius="8px"
        >
          <p className="font-bold  font-nunitoRegular text-sm ">Record Pay-Out</p>
        </CustomButton>
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
                  options={accountsDropdown}
                  handleChange={handleSearch}
                  value={params.bank_account_id}
                  label="Account"
                  name="bank_account_id"
                />
              </div>

              <div className="w-full lg:w-[30%]">
                <InputAdornments handleChange={handleSearch} label="Search" name="search_key" value={params.search_key} width="w-full" />
              </div>
              <div className="mt-2 flex justify-end ">
                {applyFilter === false ? (
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

                ) : (
                  <div className='flex justify-center gap-4'>
                    <CustomButton
                      onClick={handleCancel}
                      width="w-[110px]"
                      variant="outlined"
                      size="large"
                      borderRadius="8px"
                    >
                      <p className="font-bold text-yellow font-nunitoRegular text-sm">
                        Clear All
                      </p>
                    </CustomButton>
                    <div className='mt-3 cursor-pointer' onClick={handleCancel}>
                      <p><u>Reset</u></p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </>
        ) : null
      }

      {payoutList?.length > 0 ? (
        <p className="mt-[16px] text-textgray text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">
            {' '}
            {payoutList.length + (currentPage - 1) * 10}
          </span>
          {' '}
          out
          of
          {' '}
          <span className="text-white">{totalPayout}</span>
          {' '}
          results
        </p>
      ) : null}

      {Loading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : payoutList?.length > 0 ? (
        <div>
          <div className="w-full  bg-[#404050] rounded-lg mt-[16px]">
            <BasicTable cols={cols} data={payoutList} />
          </div>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={metadata.totalPayout}
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

export default PaymentsOutListing;
