import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';
import React, { useState, useEffect, useMemo } from 'react';
import CustomButton from '../../../common/Button';
import { InputAdornments } from '../../leads/LeadListing/SearchText';
import BasicTable from './Table';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../assets/images/NotFound.svg';
import { FetchOrderList } from '../../../../features/support/supportSlice';
import { useDispatch } from 'react-redux';
// import axiosInstance from '../../../../utils/axios';
import { useSelector } from 'react-redux';
import Pagination from '../../../common/Pagination/Pagination';

const cols = [
  {
    title: 'Order ID',
  },
  {
    title: 'Order Date',
  },
  {
    title: 'Customer Name/Phone',
  },
  {
    title: 'Delivery Address',
  },
  {
    title: 'Action',
  },
];
const Supports = () => {
  const dispatch = useDispatch();

  const { ordersList, isLoading, metadata } = useSelector((state: any) => state.support);

  const initialValues = {
    searchText: '',
    currentPage: 1,
  };

  const [params, setParams] = useState(initialValues);
  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  useMemo(() => {
    dispatch(FetchOrderList(params.currentPage, params.searchText));
  }, [params.currentPage]);

  const SearchOrder = () => {
    dispatch(FetchOrderList(1, params.searchText));
  };

  const handleCancel = () => {
    setParams({
      ...params, searchText: '', currentPage: 1
    });
    dispatch(FetchOrderList(1, ''));

  };

  return (
    <div>
      <BreadCrumb
        links={[
          { path: 'Support', url: '/support' },
          { path: 'Search Orders', url: '' },
        ]}
      />

      <p className="font-black mb-7"> Search Orders</p>

      <div>
        <div className="px-3 lg:px-4 py-6 border border-border rounded-lg bg-lightbg">
          <div className="bg-darkbg p-2 rounded-lg">
            <p>Select to Create the Order</p>
          </div>

          <div className="flex lg:flex-row flex-col gap-6 mt-6">
            <div className="lg:w-1/2 w-full ">
              <InputAdornments
                handleChange={handleSearch}
                label="Search Order Id/Name/Phone Number"
                name="searchText"
                value={params.searchText}
                width="w-full"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <div className='flex gap-4'>
                <CustomButton
                  onClick={SearchOrder}
                  borderRadius="8px"
                  width="w-fit"
                  variant="outlined"
                  size="medium"
                  disabled={!(params?.searchText.length > 0)}
                >
                  Search
                </CustomButton>
                <div className='mt-2 cursor-pointer' onClick={handleCancel}>
                  <p><u>Reset</u></p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div>
          {isLoading
            ? (
              <div className="w-full h-96 flex justify-center items-center">
                <CircularProgress />
                <span className="text-3xl">Loading...</span>
              </div>
            ) : ordersList?.data?.length > 0
              ? (
                <div>
                  <div className="w-full  bg-border rounded-lg mt-4">
                    <BasicTable cols={cols} data={ordersList.data} />
                  </div>
                  <div className="w-full pt-10 flex justify-center gap-10">
                    <Pagination
                      className="pagination-bar"
                      currentPage={params.currentPage}
                      totalCount={metadata.totalOrders}
                      pageSize={10}
                      onPageChange={(page) => setParams({ ...params, currentPage: page })}
                    />
                  </div>
                </div>
              )
              : (
                <div className="flex justify-center items-center flex-col gap-4 mt-6">
                  <img src={NotFound} alt="" />
                  <p className="text-4 font-nunitoBold">No Results found !!</p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default Supports;
