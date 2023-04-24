import TripStatusTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const TripStatus = () => {
  const [params, setParams] = useState(initialValues);
  const [TripStatus, setTripStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [TripId, setTripId] = useState();
  const [button, setButton] = useState(false)
  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  const handleClickOpen = (id: any) => {
    setTripId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchTripStatus();
  }, [])

  const fetchTripStatus = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/trips/status')
      .then((res) => {
        setTripStatus(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/trips/status/${TripId}`).then((res) => {
      showToastMessage('Successfully deleted', 'success')
      fetchTripStatus();
      setButton(false)
      setOpen(false)
    }).catch((err) => {
      setButton(false)
      showToastMessage('Error in delete', 'error')
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/trips/status', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchTripStatus();
      setParams(initialValues)
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Trip Status" sub_title="Add/Remove Items to the List of Trip Status." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : TripStatus.length > 0 ? <TripStatusTable rows={TripStatus} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button = {button}/> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default TripStatus;

