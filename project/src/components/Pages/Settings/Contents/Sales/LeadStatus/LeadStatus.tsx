import LeadStatusTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const LeadStatus = () => {
  const [params, setParams] = useState(initialValues);
  const [leadStatus, setleadStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [leadstatusId, setleadstatusId] = useState()
  const [button, setButton] = useState(false)
  
  const handleClickOpen = (id: any) => {
    setleadstatusId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchLeadsStatus();
  }, [])

  const fetchLeadsStatus = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/leads/status')
      .then((res) => {
        setleadStatus(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/leads/status/${leadstatusId}`).then((res) => {
      showToastMessage('Successfully deleted', 'success')
      fetchLeadsStatus();
      setButton(false)
      setOpen(false)
    }).catch((err) => {
      showToastMessage('Error', 'error')
      setButton(false)
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/leads/status', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchLeadsStatus();
      setParams(initialValues)
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Lead Status" sub_title="Add/Remove Items to the List of Lead Status." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : leadStatus.length > 0 ? <LeadStatusTable rows={leadStatus} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default LeadStatus;

