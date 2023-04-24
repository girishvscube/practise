import SupplierTypeTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const SupplierType = () => {
  const [params, setParams] = useState(initialValues);
  const [SupplierType, setSupplierType] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [supplierId, setsupplierId] = useState()
  const [button, setButton] = useState(false)
  const handleClickOpen = (id: any) => {
    setsupplierId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchSupplierType();
  }, [])

  const fetchSupplierType = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/suppliers/type')
      .then((res) => {
        setSupplierType(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/suppliers/type/${supplierId}`).then((res) => {
      showToastMessage('Successfully deleted', 'success')
      fetchSupplierType();
      setOpen(false)
      setButton(false)
    }).catch((err) => {
      setButton(false)
      showToastMessage('error in delete', 'error')
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/suppliers/type', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchSupplierType();
      setParams(initialValues)
    }).catch((err) => {
      showToastMessage('error', 'error')
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Supplier Type" sub_title="Add/Remove Items to the List of Supplier types." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : SupplierType.length > 0 ? <SupplierTypeTable rows={SupplierType} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default SupplierType;

