import POTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const PO = () => {
  const [params, setParams] = useState(initialValues);
  const [PO, setPO] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchPO();
  }, [])

  const fetchPO = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/po/status')
      .then((res) => {
        setPO(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = (id) => {
    axiosInstance.delete(`/admin/settings/po/status/${id}`).then((res) => {
      showToastMessage('Successfully deleted', 'success')
      fetchPO();
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/po/status', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchPO();
      setParams(initialValues)
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="PO Status" sub_title="Add/Remove Items to the List of PO Status." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : PO.length > 0 ? <POTable rows={PO} handleDelete={handleDelete} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default PO;

