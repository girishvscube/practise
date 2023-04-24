import TripStatusTable from './Table';
import HeaderCommon from './Header';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  capacity: '',
  name: ''
};
const TripStatus = () => {
  const [params, setParams] = useState(initialValues);
  const [TripStatus, setTripStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [bowserId, setbowserId] = useState()
  const [button, setButton] = useState(false)
  const handleClickOpen = (id: any) => {
    setbowserId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: any) => {

    if (event.target.name === 'capacity') {
      const re = /^[0-9\b]+$/
      if (event.target.value && !re.test(event.target.value)) {
        return
      }
    }
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchTripStatus();
  }, [])

  const fetchTripStatus = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/bowsers/fuel-capacity')
      .then((res) => {
        setTripStatus(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/bowsers/fuel-capacity/${bowserId}`).then((res) => {
      setButton(false)
      showToastMessage('Successfully deleted', 'success')
      fetchTripStatus();
      setOpen(false)
    }).catch((err) => {
      setButton(false)
      showToastMessage('error in deleted', 'error')

    })
  }

  const handleSubmit = () => {
    let name = `${params.capacity} L`
    const postData = { ...params, name: name }
    axiosInstance.post('/admin/settings/bowsers/fuel-capacity', postData).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchTripStatus();
      setParams(initialValues)
    }).catch((err) => {
      showToastMessage(err, 'success')
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Fuel Capacity of Bowser" sub_title="Add/Remove Items to the List of Capacity Bowser." handleChange={handleChange} params={params} handleSubmit={handleSubmit} />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : TripStatus.length > 0 ? <TripStatusTable rows={TripStatus} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button = {button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default TripStatus;

