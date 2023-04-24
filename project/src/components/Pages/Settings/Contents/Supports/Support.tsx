import BowserStatusTable from './Table';
import HeaderCommon from '../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../utils/axios';
import { showToastMessage } from '../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const BowserStatus = () => {
  const [params, setParams] = useState(initialValues);
  const [BowserStatus, setBowserStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [supportId, setsupportId] = useState()
  const [open, setOpen] = useState(false);
  const [button, setButton] = useState(false);


  const handleClickOpen = (id: any) => {
    setsupportId(id)
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
    axiosInstance.get('/admin/settings/support-tickets/issues')
      .then((res) => {
        setBowserStatus(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/support-tickets/issues/${supportId}`).then((res) => {
      setButton(false)
      showToastMessage('Successfully deleted', 'success')
      handleClose();
      fetchBowserStatus();
    }).catch((err) => {
      setButton(false)
      showToastMessage('error', 'error')
    })
  }

  const handleSubmit = () => {
    setLoading(true)
    axiosInstance.post('/admin/settings/support-tickets/issues', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      setParams({ ...params, name: '' })
      fetchBowserStatus();
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  };

  return (
    <div className="p-6 bg-lightbg border border-border rounded-lg">
      <HeaderCommon title="Support Ticket Issues" sub_title="Add/Remove Items to the List of Support Ticket Issues." handleChange={handleChange} params={params} handleSubmit={handleSubmit} loading={loading} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : BowserStatus.length > 0 ? <BowserStatusTable rows={BowserStatus} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default BowserStatus;

