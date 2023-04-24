import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import DriversDetailsTable from './DriversDetailsTable';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Pagination } from '../../../common/Pagination/Pagination';
import { DateFiter } from '../../../../components/common/DateFiter';
import CustomButton from '../../../common/Button';
import Popup from './Popup';
import { showToastMessage } from '../../../../utils/helpers';
import axiosInstance from '../../../../utils/axios';
import { CircularProgress } from '@mui/material';


interface DriversDetailsProps {
  // cust_id: any
  driverId: any,
  params: any,
  driverNames: any,
  setParams: any,
}
const DriversDetails = ({ driverNames, driverId, params, setParams }: DriversDetailsProps) => {


  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState({
    start_date: '',
    end_date: ''
  })
  const [button, setButton] = useState(false)
  const [open, setOpen] = useState(false);
  const [assignDriver, setAssignDriver] = useState({
    driver_id: null,
  });
  const [loading, setLoading] = useState(false)
  const [driverDetails, setDriverDetails] = useState([] as any)
  const [metadata, setMetaData] = useState({
    total: 0

  })
  let { id } = useParams();

  useEffect(() => {
    fetchDriverDetails(currentPage, id, date.start_date, date.end_date);
  }, [currentPage, date]);

  const fetchDrivers = () => {
    fetchDriverDetails(1, id, '', '');
  }

  const onDateSelect = (date: any) => {
    // console.log(date, 'date');
    setDate(date)
  };



  // console.log(driverNames, 'filteredNames')
  const handleClickOpen = (id) => {
    // setAssignId(id);
    setOpen(true);
  };

  const handleFormChanges = (event: any) => {
    setAssignDriver({ ...assignDriver, driver_id: event.target.value });
  };


  const submitAssignForm = async () => {
    setButton(true)
    await axiosInstance
      .put(`/admin/bowser/view/assign-driver/${id}`, assignDriver)
      .then((response) => {
        showToastMessage(response.data.message, 'success');
        setOpen(false);
        fetchDrivers();
        setButton(false)
      })
      .catch((error) => {
        showToastMessage(error.data.message, 'error');
        setButton(false)
      });
    return true;
  };


  const fetchDriverDetails = (page: any, id: any, start_date: any, end_date: any) => {
    setLoading(true)
    axiosInstance.get(`/admin/bowser/view/driver-detail/${id}?page=${page}&start_date=${start_date}&end_date=${end_date}`).then((res) => {
      setDriverDetails(res?.data?.data?.data)
      console.log(res?.data?.data?.meta?.total);
      setMetaData({ ...metadata, total: res?.data?.data?.meta?.total })
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }
  return (
    <div className="w-full rounded flex flex-col gap-6">
      <div className="divstyles bg-lightbg ">
        <div className="flex justify-between mb-5">
          <div className="my-auto">
            <p className="subheading">Drivers Record</p>
          </div>
          <div className="flex flex-row gap-6">
            <div className='flex flex-row'>
              <CustomButton
                borderRadius="1rem"
                width="m-auto w-fit "
                variant="outlined"
                size="medium"
                onClick={handleClickOpen}
                icon={(
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.76191 7.87109C2.51958 7.87109 0.604492 8.21001 0.604492 9.56801C0.604492 10.926 2.50791 11.2772 4.76191 11.2772C7.00483 11.2772 8.91933 10.9377 8.91933 9.58026C8.91933 8.22284 7.01649 7.87109 4.76191 7.87109Z" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.76273 5.9348C6.23448 5.9348 7.4274 4.74189 7.4274 3.27014C7.4274 1.79839 6.23448 0.605469 4.76273 0.605469C3.29157 0.605469 2.09865 1.79839 2.09865 3.27014C2.0934 4.73664 3.27757 5.92955 4.74465 5.9348H4.76273Z" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.2018 4.05859V6.39776" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.3966 5.22917H9.01074" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              >
                Add New Driver
              </CustomButton>
            </div>
            <div>
              <DateFiter onDateRangeSelect={onDateSelect} />
            </div>

          </div>
        </div>
        <div className=" flex flex-col gap-4  justify-center ">
          <div>
            {
              loading ? <div className='w-full h-96 flex justify-center items-center'>
                <CircularProgress />
                <span className='text-3xl'>Loading...</span>
              </div> : <>
                {
                  driverDetails.length > 0 ? <DriversDetailsTable
                    rows={driverDetails}
                    params={params}
                    driverId={driverId}
                    driverNames={driverNames}
                    fetchDrivers={fetchDrivers}
                  /> : <p className='text-[18px] text-center font-nunitoBold'>No Results found !!</p>
                }
              </>
            }
          </div>
          <div />
        </div>


        <div className="w-full pt-10 flex justify-center gap-10">
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={metadata.total}
            pageSize={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

      </div>

      <Popup
        open={open}
        handleClose={() => setOpen(false)}
        roles={driverNames}
        title="Assign Driver"
        type="assign"
        name="driver"
        params={assignDriver}
        setParams={handleFormChanges}
        submit={submitAssignForm}
        button={button}
      />
    </div>
  );
};
export default DriversDetails;
