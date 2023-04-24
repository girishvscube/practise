import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import Profile from '../../../../assets/images/Profile.svg';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import { SelectInput } from '../../../common/input/Select';
import { useNavigate } from 'react-router-dom';
import BasicTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { userList, UserStatus, UserStatusState } from '../../../../features/userInfo/userSlice';
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import { getRoleList } from '../../../../features/dropdowns/dropdownSlice';
import { Pagination } from '../../../common/Pagination/Pagination';
import { InputAdornments } from '../../leads/LeadListing/SearchText';
import { CountItems } from '../../../../utils/helpers';
import Badge from '@mui/material/Badge';

const statusData = [
  {
    id: 'false',
    name: 'InActive',
  },
  {
    id: 'true',
    name: 'Active',
  },
];

const cols = [
  {
    title: 'User ID',
  },
  {
    title: 'Name',
  },
  {
    title: 'Phone',
  },
  {
    title: 'Role',
  },
  {
    title: 'Access',
  },
  {
    title: 'User Status',
  },
  {
    title: 'Action',
  },
];
const UserListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { roles } = useSelector((state: any) => state.dropdown);
  const { usersList, meta, isLoading, updateStatus, total_users } = useSelector((state: any) => state.user);
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersCount, setFiltersCount] = useState(0);
  const initalStates = {
    searchText: '',
    status: '',
    userRoles: '',
  };
  const [params, setParams] = useState(initalStates);
  const handleActivateFilter = () => {
    setFilter(!filter);
  };
  const handleCancel = () => {
    setCurrentPage(1)
    setParams({ ...params, searchText: '', status: '', userRoles: '' });
    dispatch(userList(1, '', '', ''));
    setApplyFilter(false);
    setFiltersCount(0)
  };

  const handleSubmit = () => {
    setApplyFilter(true);
    setCurrentPage(1)
    dispatch(userList(1, params.status, params.searchText, params.userRoles));
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
    setApplyFilter(false);
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  const handleCreate = () => {
    navigate('/users/create');
  };

  const handleToggleChange = (event: any, user: any) => {
    event.preventDefault();
    dispatch(UserStatus(user.id, { status: !user.is_active }));
    handleCancel();
  };

  useEffect(() => {
    dispatch(getRoleList());
  }, []);



  useMemo(() => {
    if (updateStatus === true) {
      dispatch(userList(currentPage, params.status, params.searchText, params.userRoles));
      dispatch(UserStatusState());
    }
  }, [updateStatus]);

  useMemo(() => {
    dispatch(userList(currentPage, params.status, params.searchText, params.userRoles));
  }, [currentPage]);

  return (
    <div className="users-section">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div>
          <p className="text-2xl font-extrabold text-white font-nunitoRegular">
            List of Users
          </p>
          <hr className="w-32 md:w-full line" />
          <p className="text-sm font-nunitoRegular mt-1 ">
            {total_users}
            {' '}
            users
          </p>
        </div>
        <div className="mb-4 md:mb-0 pl-12 md:pl-0 last:flex gap-6 mt-6 md:mt-0 justify-end">
          {' '}
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
          <CustomButton
            onClick={handleCreate}
            width="w-fit"
            variant="contained"
            size="large"
            icon={<img src={Profile} alt="" />}
            borderRadius="8px"
          >
            <p className="font-bold text-darkGray font-nunitoRegular text-sm ">
              Add New User
            </p>
          </CustomButton>
        </div>
      </div>

      {filter ? (
        <div className="mt-4 flex-col lg:flex-row flex gap-4 filters">
          <div className="w-full lg:w-40">
            <SelectInput
              width="100%"
              options={statusData}
              handleChange={handleSearch}
              value={params.status}
              label="Select Status"
              name="status"
            />
          </div>
          <div className="w-full lg:w-40">
            <SelectInput
              width="100%"
              options={roles}
              handleChange={handleSearch}
              value={params.userRoles}
              label="Select Role"
              name="userRoles"
            />
          </div>
          <div className="w-full lg:w-96">

            <InputAdornments
              handleChange={handleSearch}
              label="Search"
              name="searchText"
              value={params.searchText}
              width="w-full"
            />
          </div>

          <div className="mt-2 flex justify-end lg:justify-start">
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
      ) : null}

      {usersList.length ? (
        <p className="mt-[16px] text-[#6A6A78] text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">
            {usersList.length + (currentPage - 1) * 10}
          </span>
          {' '}
          out of
          {' '}
          <span className="text-white">{meta?.total}</span>
          {' '}
          results
        </p>
      ) : null}

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : usersList.length ? (
        <div>
          <div className="w-full  bg-arsenic  rounded-lg mt-4">
            <BasicTable
              cols={cols}
              data={usersList}
              toggleChange={handleToggleChange}
            />
          </div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={meta.total}
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

export default UserListing;
