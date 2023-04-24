import LeadSourceTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const LeadSource = () => {
  const [params, setParams] = useState(initialValues);
  const [LeadSource, setLeadSource] = useState([])
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
    axiosInstance.get('/admin/settings/leads/source')
      .then((res) => {
        setLeadSource(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/leads/source/${leadstatusId}`).then((res) => {
      setButton(false)
      showToastMessage('Successfully deleted', 'success')
      fetchLeadsStatus();
      setOpen(false);
    }).catch((err) => {
      setButton(false)
      showToastMessage('error in delete', 'error')
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/leads/source', params).then((res) => {
      showToastMessage(res?.data?.data?.message, 'success')
      fetchLeadsStatus();
      setParams(initialValues)
    }).catch((err) => {
      showToastMessage('Error', 'error')
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Lead Source" sub_title="Add/Remove Items to the List of Lead Source." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : LeadSource.length > 0 ? <LeadSourceTable rows={LeadSource} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default LeadSource;

