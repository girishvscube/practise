import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import Profile from '../../../../assets/images/PlusBlack.svg';
import { SelectInput } from '../../../common/input/Select';
import BasicTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchaccountsDropdown } from '../../../../features/dropdowns/dropdownSlice';

import { fetchexpenseList, fetchexpenseStats } from '../../../../features/accounts/expenseSlice';
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import Expense from '../../../../assets/images/Expense.svg';
import DirectExpense from '../../../../assets/images/DirectExpense.svg';
import IndirectExpense from '../../../../assets/images/IndirectExpense.svg';
import Card from './Card';
import { DateRangePicker } from '../../../common/input/DateRangePicker';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import moment from 'moment';
import PopUp from './Popup';

import { InputAdornments } from './SearchText';
import { Pagination } from '../../../common/Pagination/Pagination';
import { CountItems } from '../../../../utils/helpers';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';
import { DateFiter } from '../../../../components/common/DateFiter';
import Badge from '@mui/material/Badge';

const cols = [
  {
    title: 'Expense No',
  },
  {
    title: 'Expended Date',
  },
  {
    title: 'Direct/Indirect',
  },
  {
    title: 'Category',
  },
  {
    title: 'Item',
  },
  {
    title: 'Payee',
  },
  {
    title: 'Account',
  },
  {
    title: 'Amount Paid',
  },
  {
    title: 'Action',
  },
]



const expenseType = [
  {
    id: 'Direct',
    name: 'Direct'
  },
  {
    id: 'Indirect',
    name: 'Indirect'
  }
]

const initialValues = {
  expense_type: '',
  sub_category: '',
  item_name: '',
  payee: '',
  amount: '',
  account_id: '',
  reference_img: '',
  date_of_expense: ''
}
const ExpenseListing = () => {
  const { accountsDropdown, categoryDropdown } = useSelector((state: any) => state.dropdown);
  const { expenseList, Loading, metadata, expenseStats } = useSelector((state: any) => state.expense);
  const [date, setDate] = useState({
    start_date: '',
    end_date: ''
  })
  const { totalexpense } = metadata;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState({
    create: false,
    edit: false,
  });

  const [filtersCount, setFiltersCount] = useState(0);
  const initalStates: any = {
    expense_type: '',
    account_id: '',
    search_key: '',
    start_date: '',
    end_date: '',
  };
  const [params, setParams] = useState(initalStates);




  const handleActivateFilter = () => {
    setFilter(!filter);
  };
  const handleCancel = () => {
    setParams({
      ...params,
      expense_type: '',
      account_id: '',
      search_key: '',
      start_date: '',
      end_date: '',
    });
    let reset: any = null
    setStartDate(reset)
    setEndDate(reset)
    setFiltersCount(0)
    dispatch(fetchexpenseList(1, '', '', '', '', ''));
    setApplyFilter(false);
  };

  const handleSubmit = () => {
    setApplyFilter(true);
    dispatch(fetchexpenseList(currentPage, params.expense_type, params.account_id, params.search_key, params.start_date, params.end_date));
    const count = CountItems(params)
    { count > 4 ? setFiltersCount(count - 1) : setFiltersCount(count) }
  };

  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
    setApplyFilter(false);
  };

  const handleCreate = () => {
    setOpen({ ...open, create: true });
  };





  useEffect(() => {
    dispatch(fetchaccountsDropdown())
  }, []);


  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    const sDate = moment(start).format('YYYY-MM-DD');
    const eDate = moment(end).format('YYYY-MM-DD');
    setParams({ ...params, start_date: sDate, end_date: eDate });
  };

  const onDateSelect = (date: any) => {
    setDate(date)
  };



  useMemo(() => {
    dispatch(fetchexpenseStats(date.start_date, date.end_date));
  }, [date]);



  useMemo(() => {
    dispatch(fetchexpenseList(currentPage, params.expense_type, params.account_id, params.search_key, params.start_date, params.end_date));
  }, [currentPage]);

  const handleClose = () => {
    setOpen({ ...open, create: false });
    dispatch(fetchexpenseList(currentPage, params.expense_type, params.account_id, params.search_key, params.start_date, params.end_date));
  }

  return (
    <div className="users-section">
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Invoice Analytics</p>
        <div className='hidden sm:block'>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>
      <div className='w-full sm:hidden '>
        <br />
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <Card text="Total Expense Made" value={`₹ ${expenseStats?.total || 0}`} image={Expense} />
        <Card text="Direct Expense" value={`₹ ${expenseStats?.direct || 0}`} image={DirectExpense} />
        <Card text="Indirect Expense" value={`₹ ${expenseStats?.indirect || 0}`} image={IndirectExpense} />
      </div>

      <div className="mt-7 flex justify-between">
        <div>
          <p className="text-xl font-extrabold text-white font-nunitoRegular">
            List of Expenses
          </p>
          <div className="w-full border-b border-border" />
          <p className="text-xs font-nunitoRegular mt-1 font-normal">
            Total Payment Out:
            {' '}
            {totalexpense}
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
            <p className="font-bold font-nunitoRegular text-sm ">Add Expense</p>
          </CustomButton>
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
        <CustomButton
          onClick={handleCreate}
          width="w-fit"
          variant="contained"
          size="large"
          icon={<img src={Profile} alt="" />}
          borderRadius="8px"
        >
          <p className="font-bold  font-nunitoRegular text-sm ">Add Expense</p>
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
                  options={expenseType}
                  handleChange={handleSearch}
                  value={params.expense_type}
                  label="Expense Type"
                  name="expense_type"
                />
              </div>

              <div className="w-full lg:w-[300px]">
                <SelectInput
                  width="100%"
                  options={accountsDropdown}
                  handleChange={handleSearch}
                  value={params.account_id}
                  label="Bank Account"
                  name="account_id"
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

      {expenseList?.length > 0 ? (
        <p className="mt-[16px] text-textgray text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">
            {' '}
            {expenseList.length + (currentPage - 1) * 10}
          </span>
          {' '}
          out
          of
          {' '}
          <span className="text-white">{totalexpense}</span>
          {' '}
          results
        </p>
      ) : null}

      {Loading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : expenseList?.length > 0 ? (
        <div>
          <div className="w-full  bg-border rounded-lg mt-[16px]">
            <BasicTable cols={cols} data={expenseList} accountsDropdown={accountsDropdown}
              categoryDropdown={categoryDropdown} handleClose={handleClose} />
          </div>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={metadata.totalexpense}
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

      <PopUp
        open={open.create}
        handleClose={handleClose}
        title="Record Expense"
        type="create"
        name=""
        accountsDropdown={accountsDropdown}
        categoryExpense={categoryDropdown}
        expenseId=''
      />
    </div>
  );
};

export default ExpenseListing;
