import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import Profile from '../../../../assets/images/PlusBlack.svg';
import { SelectInput } from '../../../common/input/Select';
import BasicTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchcashInHandList, fetchcashInHandStats } from '../../../../features/accounts/cashInHandSlice';
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import CashInHand from '../../../../assets/images/CashInHand.svg';
import CashIn from '../../../../assets/images/CashIn.svg';
import CashOut from '../../../../assets/images/CashOut.svg';
import Card from './Card';
import { DateRangePicker } from '../../../common/input/DateRangePicker';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import moment from 'moment';
import PopUp from './Popup';
import { getSaleExecutiveList, fetchCashTypeDropdown } from '../../../../features/dropdowns/dropdownSlice';
import { InputAdornments } from '../Expenses/SearchText';
import { Pagination } from '../../../common/Pagination/Pagination';
import { CountItems, showToastMessage } from '../../../../utils/helpers';
import { DateFiter } from '../../../../components/common/DateFiter';
import Badge from '@mui/material/Badge';
import Validator from 'validatorjs';
import axiosInstance from '../../../../utils/axios';
const cols = [
  {
    title: 'Date Of Transaction',
  },
  {
    title: 'Type',
  },
  {
    title: 'Name',
  },
  {
    title: 'Amount Paid',
  },
  {
    title: 'Action',
  },
];

const initialValues = {
  amount: '',
  type: '',
  adjustment_date: ''
}

const CashInHandListing = () => {
  const { cashTypeDropdown } = useSelector((state: any) => state.dropdown);
  const { cashInHandList, Loading, metadata, cashInHandStats } = useSelector((state: any) => state.cashInHand);
  const { totalcashInHand } = metadata;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const [cashId, setcashId] = useState()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState({
    create: false,
    update: false
  });
  const [filtersCount, setFiltersCount] = useState(0);
  const initalStates: any = {
    search_key: '',
    type: '',
    start_date: '',
    end_date: '',
  };


  const [params, setParams] = useState(initalStates);
  const [Popupparams, setPopupParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)
  const [date, setDate] = useState({
    start_date: '',
    end_date: ''
  })
  const [disabledButton, setdisabledButton] = useState(false)

  const handleAdd = (name, id, data) => {
    setcashId(id)
    setPopupParams(data)
    setOpen({ ...open, [name]: true });
  };

  const handleChange = (event: any) => {
    setPopupParams({ ...Popupparams, [event.target.name]: event.target.value })
    setErrors({ ...errors, [event.target.name]: '' })
  }

  const handleActivateFilter = () => {
    setFilter(!filter);
  };
  const handleCancel = () => {
    setParams({ ...params, search_key: '', type: '', start_date: '', end_date: '', });
    setCurrentPage(1)
    dispatch(fetchcashInHandList(1, '', '', '', '',));
    let reset: any = null
    setStartDate(reset)
    setEndDate(reset)
    setApplyFilter(false);
    setFiltersCount(0)

  };


  const handleSubmit = () => {
    setApplyFilter(true);
    setCurrentPage(1)
    dispatch(fetchcashInHandList(1, params.type, params.search_key, params.start_date, params.end_date));
    const count = CountItems(params)
    { count > 3 ? setFiltersCount(count - 1) : setFiltersCount(count) }

  };

  const handleSearch = (event: any) => {
    setErrors(initialValues)
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  const handleCreate = () => {
    setOpen({ ...open, create: true });
  };


  const handleDate = (date) => {
    setErrors(initialValues)
    setPopupParams({ ...Popupparams, adjustment_date: moment(date).format('YYYY-MM-DD') })
  }


  useEffect(() => {
    dispatch(getSaleExecutiveList());
    dispatch(fetchCashTypeDropdown());
  }, []);

  // DateRange picker for List Filter
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    const sDate = moment(start).format('YYYY-MM-DD');
    const eDate = moment(end).format('YYYY-MM-DD');
    setParams({ ...params, start_date: sDate, end_date: eDate });
  };

  const handleClose = () => {
    setParams(initialValues);
    setErrors(initialValues)
    setOpen({ ...open, create: false, update: false });
    dispatch(fetchcashInHandList(currentPage, params.type, params.search_key, params.start_date, params.end_date));
  }

  useMemo(() => {
    dispatch(fetchcashInHandStats(date.start_date, date.end_date));
  }, [date]);


  const onDateSelect = (date: any) => {
    setDate(date)
  };


  useMemo(() => {
    dispatch(fetchcashInHandList(currentPage, params.type, params.search_key, params.start_date, params.end_date));
  }, [currentPage]);

  const handleSubmitForm = () => {
    const rules = {
      amount: 'required',
      type: 'required',
      adjustment_date: 'required',
    };


    const validation = new Validator(Popupparams, rules)
    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });
      setErrors(fieldErrors);
      return false;
    }

    setdisabledButton(true)

    const postdata = { ...Popupparams, adjustment_date: moment(Popupparams.adjustment_date).format('YYYY-MM-DD') }

    {
      cashId ? axiosInstance.put(`/admin/cash-in-hand/${cashId}`, postdata).then((res) => {
        showToastMessage('Updated Successfully', 'success')
        handleClose();
        setPopupParams(initialValues)
        setLoading(false)
        setdisabledButton(false)
      }).catch(() => {
        setLoading(false);
      }) : axiosInstance.post(`/admin/cash-in-hand/`, postdata).then((res) => {
        showToastMessage('Created Successfully', 'success')
        handleClose();
        setPopupParams(initialValues)
        setLoading(false)
      }).catch(() => {
        setLoading(false);
      })
    }

  }

  return (
    <div className="users-section">
      <div className="flex lg:flex-row justify-between flex-col ">
        <p className="text-white font-nunitoBold text-xl">Cash In Hand Analytics</p>
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <Card text="Total Cash In Hand" value={`₹ ${cashInHandStats?.total === null ? 0 : cashInHandStats?.total}` || 0} image={CashInHand} />
        <Card text="Total Cash Obtained In" value={`₹ ${cashInHandStats?.cash_in === null ? 0 : cashInHandStats?.cash_in}` || 0} image={CashIn} />
        <Card text="Total Cash Given Out" value={`₹ ${cashInHandStats?.cash_out === null ? 0 : cashInHandStats?.cash_out}` || 0} image={CashOut} />
      </div>

      <div className="mt-7 flex justify-between">
        <div>
          <p className="text-xl font-extrabold text-white font-nunitoRegular">
            List of Cash Transactions
          </p>
          <div className="w-full border-b border-border" />
          <p className="text-xs font-nunitoRegular mt-1 font-normal">
            Total Number Of Cash Transactions:
            {' '}
            {totalcashInHand}
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
            <p className="font-bold font-nunitoRegular text-sm ">Adjust Cash In Hand</p>
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
          <p className="font-bold  font-nunitoRegular text-sm ">Adjust Cash In Hand</p>
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
                  options={cashTypeDropdown}
                  handleChange={handleSearch}
                  value={params.type}
                  label="Type"
                  name="type"
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

      {cashInHandList?.length > 0 ? (
        <p className="mt-[16px] text-textgray text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">
            {' '}
            {cashInHandList.length + (currentPage - 1) * 10}
          </span>
          {' '}
          out
          of
          {' '}
          <span className="text-white">{totalcashInHand}</span>
          {' '}
          results
        </p>
      ) : null}

      {Loading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : cashInHandList?.length > 0 ? (
        <div>
          <div className="w-full  bg-[#404050] rounded-lg mt-[16px]">
            <BasicTable cols={cols} data={cashInHandList}
              handleClose={handleClose}
              params={Popupparams}
              handleChange={handleChange}
              errors={errors}
              handleSubmit={handleSubmitForm}
              handleDate={handleDate}
              open={open?.update}
              handleAdd={handleAdd}
            />

          </div>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalcashInHand}
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
        open={open?.create}
        handleClose={handleClose}
        title="Adjust Cash In Hand"
        type="create"
        name=""
        params={Popupparams}
        handleChange={handleChange}
        errors={errors}
        handleSubmit={handleSubmitForm}
        handleDate={handleDate}
        disabledButton = {Loading}
      />
    </div>
  );
};

export default CashInHandListing;
