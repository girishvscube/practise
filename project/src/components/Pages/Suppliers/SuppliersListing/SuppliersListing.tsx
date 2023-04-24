import { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import { useNavigate } from 'react-router-dom';
import BasicTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSupplierList, fetchSupplierStats } from '../../../../features/suppliers/supplierSlice';
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from '../../../../assets/images/NotFound.svg';
import SuppliersCount from '../../../../assets/images/SuppliersCount.svg';
import Distributors from '../../../../assets/images/Distributors.svg';
import Terminal from '../../../../assets/images/Terminal.svg';
import Card from '../../leads/LeadListing/Card';
import FilterLight from '../../../../assets/images/FilterLight.svg';
import { InputAdornments } from '../../leads/LeadListing/SearchText';
import Plus from '../../../../assets/images/PlusBlack.svg';
import Pagination from '../../../common/Pagination/Pagination';
import Badge from '@mui/material/Badge';

const cols = [
  {
    title: 'ID No.',
  },
  {
    title: 'Name',
  },
  {
    title: 'Address',
  },
  {
    title: 'Email&Phone',
  },
  {
    title: 'Action',
  },
];

const SuppliersListing = () => {
  const { suppliersList, isLoading, supplierStats, metadata } = useSelector(
    (state: any) => state.supplier,
  );
  const { totalSuppliers, totalPages } = metadata;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const initalStates: any = {
    search_key: '',
  };
  const [params, setParams] = useState(initalStates);

  const handleActivateFilter = () => {
    setFilter(!filter);
  };
  const handleCancel = () => {
    setParams({
      ...params,
      search_key: '',
    });
    setCurrentPage(1)
    dispatch(fetchSupplierList(1, ''));
    setApplyFilter(false);
    setFiltersCount(0)
  };

  const handleSubmit = () => {
    setApplyFilter(true);
    setCurrentPage(1)
    dispatch(fetchSupplierList(1, params.search_key));
    setFiltersCount(1)
  };

  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
    setApplyFilter(false);
  };

  const handleCreate = () => {
    navigate('/suppliers/create');
  };

  useMemo(() => {
    dispatch(fetchSupplierList(currentPage, params.search_key));
    dispatch(fetchSupplierStats());
  }, [currentPage]);

  return (
    <div className="users-section">
      <div className="flex lg:flex-row justify-between flex-col ">
        <p className="text-white font-nunitoBold text-xl	">Supplier Analytics</p>
      </div>

      <div className="mt-4 flex flex-col lg:flex-row gap-6">
        <Card text="Total Suppliers" value={supplierStats?.total || 0} image={SuppliersCount} />
        <Card
          text="Total Distributors"
          value={supplierStats?.distributor || 0}
          image={Distributors}
        />
        <Card text="Total Terminals" value={supplierStats?.terminal || 0} image={Terminal} />
      </div>

      <div className="mt-5 flex justify-between">
        <div>
          <p className="text-xl	 font-extrabold text-white font-nunitoRegular">
            List of Suppliers
          </p>
          <div className="w-full border-b border-border" />
          <p className="text-xs font-nunitoRegular mt-1 font-normal	">
            Total Suppliers:
            {' '}
            {totalSuppliers}
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
            borderRadius="0.5rem"
            icon={<img src={Plus} alt="" />}
          >
            <p className="font-bold text-darkGray font-nunitoRegular text-sm ">
              Create New Supplier
            </p>
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
          borderRadius="0.5rem"
          icon={<img src={Plus} alt="" />}
        >
          <p className="font-bold  font-nunitoRegular text-sm ">
            Create New Supplier
          </p>
        </CustomButton>
      </div>

      {filter === true ? (
        <>
          <div className="mt-6 flex flex-col items-center lg:flex-row gap-6 pr-0 lg:pr-20 w-full filters">
            <div className="w-full lg:w-[30%]">
              <InputAdornments
                handleChange={handleSearch}
                label="Search"
                name="search_key"
                value={params.search_key}
                width="w-full"
              />
            </div>
            <div className="flex w-full lg:w-48  justify-end ">

              <div className='flex justify-center gap-4'>
                <CustomButton
                  onClick={handleSubmit}
                  width="w-[130px]"
                  variant="outlined"
                  size="large"
                  borderRadius="8px"
                  disabled={!(params.search_key?.length > 0)}
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

      {suppliersList?.length > 0 ? (
        <p className="mt-4 text-textgray text-xs font-nunitoRegular font-normal">
          Showing
          {' '}
          <span className="text-white">
            {suppliersList.length + (currentPage - 1) * 10}
          </span>
          {' '}
          out of
          {' '}
          <span className="text-white">{totalSuppliers}</span>
          {' '}
          results
        </p>
      ) : null}

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : suppliersList?.length > 0 ? (
        <div>
          <div className="w-full  bg-border rounded-lg	 mt-4">
            <BasicTable cols={cols} data={suppliersList} />
          </div>

          <div className="w-full pt-2 flex justify-center">
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={metadata.total}
              pageSize={10}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-4 mt-6">
          <img src={NotFound} alt="" />
          <p className="text-lg	 font-nunitoBold">No Results found !!</p>
        </div>
      )}
    </div>
  );
};

export default SuppliersListing;
