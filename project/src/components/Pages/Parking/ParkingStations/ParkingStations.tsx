import { useState, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import { Input } from '../../../common/input/Input';
import { useNavigate } from 'react-router-dom';
import BasicTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParkingList } from '../../../../features/parking/parkingSlice';
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import Plus from '../../../../assets/images/Plus.svg';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import Pagination from '../../../common/Pagination/Pagination';
import Badge from '@mui/material/Badge';
import { CountItems } from '../../../../utils/helpers';

const cols = [
  {
    title: 'Parking Station Name',
  },
  {
    title: 'Address',
  },
  {
    title: 'Parking Station Capacity',
  },
  {
    title: 'Number of Browser linked',
  },
  {
    title: 'Browser IDs',
  },
  {
    title: 'Action',
  },
];


const Stations = () => {
  const { parkingList, isLoading, metadata } = useSelector((state: any) => state.parking);
  const { totalParking, totalPages } = metadata;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setOpen] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  const initalStates = {
    searchText: '',
  };
  const [params, setParams] = useState(initalStates);

  const handleActivateFilter = () => {
    setFilter(!filter);
  };
  const handleCancel = () => {
    setParams({ ...params, searchText: '' });
    dispatch(fetchParkingList(1, ''));
    setApplyFilter(false);
    setFiltersCount(0);
  };

  const handleSubmit = () => {
    setApplyFilter(true);
    dispatch(fetchParkingList(1, params.searchText));
    const counts = CountItems(params)
    setFiltersCount(counts)
  };

  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  const handleCreate = () => {
    navigate('/fleet_manage/parking-station/create');
  };



  useMemo(() => {
    dispatch(fetchParkingList(currentPage, params.searchText));
  }, [currentPage]);

  const handleAssign = () => {
    setOpen(true);
  };


  return (
    <div >
      <div className="mt-2 flex justify-between">
        <div>
          <p className="text-xl font-extrabold text-white font-nunitoRegular">
            Parking Station List
          </p>
          <hr className="w-32 md:w-full line" />
          <p className="text-xs font-nunitoRegular mt-1 font-normal">
            Total Parking Station:
            {' '}
            {totalParking}
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
            width="w-full"
            variant="contained"
            size="large"
            icon={<img src={Plus} alt="" />}
          >
            <p className="font-bold text-darkbg font-nunitoRegular text-sm ">
              Add Parking Station
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
              borderRadius="7px"
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
            borderRadius="7px"
          >
            <p className="font-bold  font-nunitoRegular text-sm ">Add Parking Station</p>
          </CustomButton>
        </div>
      </div>

      {filter === true ? (
        <>
          <div className="mt-4 flex-col lg:flex-row flex gap-4 filters">
            <div className="w-full lg:w-[30%]">
              <Input
                rows={1}
                width="w-full"
                disabled={false}
                readOnly={false}
                value={params.searchText}
                handleChange={handleSearch}
                label="Search"
                name="searchText"
              />
            </div>
            <div className=" flex justify-end ">

              <div className='flex justify-center items-center gap-4'>
                <CustomButton
                  disabled={CountItems(params) === 0}
                  onClick={handleSubmit}
                  width="w-[130px]"
                  variant="outlined"
                  size="large"
                  borderRadius="7px"
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

      {parkingList?.length > 0 ? (
        <p className="mt-[16px] text-[#6A6A78] text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">{parkingList.length + (currentPage - 1) * 10}</span>
          {' '}
          out
          of
          {' '}
          <span className="text-white">{totalParking}</span>
          {' '}
          results
        </p>
      ) : null}

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : parkingList?.length > 0 ? (
        <div>
          <div className="w-full  bg-[#404050] rounded-lg mt-[16px]">
            <BasicTable cols={cols} data={parkingList} handleClick={handleAssign} />
          </div>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalPages}
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

export default Stations;
