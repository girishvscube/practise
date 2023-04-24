import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import { SelectInput } from '../../../common/input/Select';
import { Input } from '../../../common/input/Input';
import { useNavigate } from 'react-router-dom';
import BasicTable from './Table';
import { Pagination } from '../../../common/Pagination/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrowsersList, BowsersStats } from '../../../../features/browser/browserSlice';
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import BrowserIcon1 from '../../../../assets/images/BrowserIcon1.svg';
import BrowserIcon2 from '../../../../assets/images/BrowserIcon2.svg';
import BrowserIcon3 from '../../../../assets/images/BrowserIcon3.svg';
import BrowserIcon4 from '../../../../assets/images/BrowserIcon4.svg';
import Plus from '../../../../assets/images/Plus.svg';
import Card from '../../leads/LeadListing/Card';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import axiosInstance from '../../../../utils/axios';
import { MenuItem } from '@mui/material';
import { CountItems } from '../../../../utils/helpers';
import Badge from '@mui/material/Badge';

const cols = [
  {
    title: 'Bowser ID',
  },
  {
    title: 'Bowser Name',
  },
  {
    title: 'Assigned Driver',
  },
  {
    title: 'Capacity',
  },
  {
    title: 'Last Trip Number',
  },
  {
    title: 'Fuel Left Over',
  },
  {
    title: 'Status',
  },
  {
    title: 'Action',
  },
];

const statusList = [
  { id: 'On Trip', name: 'On Trip' },
  { id: 'Available', name: 'Available' },
  { id: 'On Hold', name: 'On Hold' },
  { id: 'Out Of Service', name: 'Out Of Service' },
];

const noDriversList = [{ id: 1, name: 'No Drivers Found..' }];

const BrowserListing = () => {
  // const { assignedDrivers } = useSelector((state: any) => state.dropdown);
  const { browserList, isLoading, metadata, bowserStats, totalBrowsers } = useSelector((state: any) => state.browser);
  const { totalPages, total } = metadata;
  // console.log('dada', leadsList.data, metadata, totalleads, totalPages)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [gotoPage, setGotoPage] = useState(0);
  const [filtersCount, setFiltersCount] = useState(0);
  const [, setOpen] = useState(false);
  const initalStates = {
    searchText: '',
    status: '',
    driver: '',
  };

  const [currentPage, setCurrentPage] = useState(1);

  const [params, setParams] = useState(initalStates);

  const handleActivateFilter = () => {
    setFilter(filter => !filter);
  };
  const handleCancel = () => {
    setCurrentPage(1)
    setParams({ ...params, driver: '', status: '', searchText: '' });
    dispatch(fetchBrowsersList(1, '', '', '',));
    setFiltersCount(0)
  };

  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    setCurrentPage(1)
    dispatch(fetchBrowsersList(1, params.driver, params.status, params.searchText));
    const counts = CountItems(params)
    setFiltersCount(counts)
  };

  const handleCreate = () => {
    navigate('/fleet_manage/bowser/create');
  };

  useMemo(() => {
    dispatch(fetchBrowsersList(currentPage, params.driver, params.status, params.searchText));
  }, [currentPage]);

  useEffect(() => {
    dispatch(BowsersStats());
  }, []);

  const driversList: string[] = [];
  const mapDrivers = browserList.map(data => {
    driversList.push(data.driver)
  })
  const driverNames = driversList.filter(i => i === null ? '' : i)

  return (
    <div className="">
      <div className="flex lg:flex-row justify-between flex-col ">
        <p className="text-white font-nunitoBold text-xl">Bowser Analytics</p>
      </div>
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <Card text="Total Number Of Browsers" value={bowserStats?.total || 0} image={BrowserIcon1} />
        <Card text="Bowsers On Trip" value={bowserStats?.on_trip || 0} image={BrowserIcon2} />
        <Card text="Bowsers Are Free" value={bowserStats?.available || 0} image={BrowserIcon3} />
        <Card text="Bowsers Out Of Service" value={bowserStats?.out_of_service || 0} image={BrowserIcon4} />
      </div>
      <div className="mt-7 flex justify-between">
        <div>
          <p className="text-xl font-extrabold text-white font-nunitoRegular">
            Bowsers List
          </p>
          <div className='w-full border border-border'></div>
          <p className="text-xs font-nunitoRegular mt-1 font-normal">
            Total Bowsers:
            {' '}
            {totalBrowsers}
          </p>
        </div>

        <div className="gap-6 hidden lg:flex">
          <Badge color="secondary" className='text-black' badgeContent={filtersCount}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <CustomButton
              borderRadius="7px"
              onClick={handleActivateFilter}
              width="w-fit"
              variant="outlined"
              size="large"
              icon={<img src={FilterLight} alt="" />}
            >
              <p className="font-bold text-yellow font-nunitoRegular text-sm">Filter</p>
            </CustomButton>
          </Badge>
          <CustomButton
            borderRadius="7px"
            onClick={handleCreate}
            width="w-fit"
            variant="contained"
            size="large"
            icon={<img src={Plus} alt="" />}
          >
            <p className="font-bold text-darkbg font-nunitoRegular text-sm ">
              Create New Bowser
            </p>
          </CustomButton>
        </div>
      </div>
      <div className="w-full  mt-6 gap-4 lg:hidden flex flex-col justify-end">
        <div className="flex w-full justify-end">
          <Badge color="secondary" className='text-black' badgeContent={filtersCount}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <CustomButton
              onClick={handleActivateFilter}
              width="w-fit"
              variant="outlined"
              size="large"
              icon={<img src={FilterLight} alt="" />}
              borderRadius="0.5rem"
            >
              <p className="font-bold text-yellow font-nunitoRegular text-sm">Filter</p>
            </CustomButton>
          </Badge>
        </div>

        <div className="flex w-full justify-end">
          <CustomButton
            onClick={handleCreate}
            width="w-fit"
            variant="contained"
            size="large"
            icon={<img src={Plus} alt="" />}
            borderRadius="0.5rem"
          >
            <p className="font-bold  font-nunitoRegular text-sm ">Create New Bowser</p>
          </CustomButton>
        </div>
      </div>

      {
        filter === true ? (
          <>
            <div className="mt-6 flex flex-col lg:flex-row gap-6 pr-0 lg:pr-20 w-full filters">
              <div className="w-full lg:w-[200px]">
                <SelectInput
                  width="100%"
                  options={driverNames}
                  handleChange={handleSearch}
                  value={params?.driver}
                  label="Assigned Driver"
                  name="driver"
                />
              </div>

              <div className="w-full lg:w-[200px]">
                <SelectInput
                  width="100%"
                  options={statusList}
                  handleChange={handleSearch}
                  value={params.status}
                  label="Status"
                  name="status"
                />
              </div>
              <div className="w-full lg:w-[20%]">
                <Input
                  rows={1}
                  // width="w-full"
                  disabled={false}
                  readOnly={false}
                  value={params.searchText}
                  handleChange={handleSearch}
                  label="Search"
                  name="searchText"
                />
              </div>
              <div className="mt-2 flex justify-end ">
                <div className='flex justify-center gap-4'>
                  <CustomButton
                    disabled={CountItems(params) === 0}
                    onClick={handleSubmit}
                    width="w-[130px]"
                    variant="outlined"
                    size="large"
                    borderRadius={'0.5rem'}
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
        ) : null}

      {browserList?.length > 0 ? (
        <p className="mt-[16px] text-[#6A6A78] text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">{browserList.length + (currentPage - 1) * 10}</span>
          {' '}
          out
          of
          {' '}
          <span className="text-white">{totalBrowsers}</span>
          {' '}
          results
        </p>
      ) : null}

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : browserList?.length > 0 ? (
        <div>
          <div className="w-full  bg-[#404050] rounded-lg mt-[16px]">
            <BasicTable cols={cols} data={browserList} />
          </div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={total}
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

export default BrowserListing;
