import BowserStatusTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const BowserStatus = () => {
  const [params, setParams] = useState(initialValues);
  const [BowserStatus, setBowserStatus] = useState([])
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
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchBowserStatus();
  }, [])

  const fetchBowserStatus = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/bowsers/status')
      .then((res) => {
        setBowserStatus(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/bowsers/status/${bowserId}`).then((res) => {
      setButton(false)
      showToastMessage('Successfully deleted', 'success')
      setOpen(false)
      fetchBowserStatus();
    }).catch((err) => {
      setButton(false)
      showToastMessage('Error', 'error')
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/bowsers/status', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchBowserStatus();
      setParams(initialValues)
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Bowser Status" sub_title="Add/Remove Items to the List of Bowser Status." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : BowserStatus.length > 0 ? <BowserStatusTable rows={BowserStatus} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button = {button}/> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default BowserStatus;

