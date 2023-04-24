import SupplierPaymentTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const paymentsTerm = () => {
  const [params, setParams] = useState(initialValues);
  const [SupplierPayment, setSupplierPayment] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchSupplierPaymentTerm();
  }, [])

  const fetchSupplierPaymentTerm = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/payment-term')
      .then((res) => {
        setSupplierPayment(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = (id) => {
    axiosInstance.delete(`/admin/settings/suppliers/type/${id}`).then((res) => {
      showToastMessage('Successfully deleted', 'success')
      fetchSupplierPaymentTerm();
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/suppliers/type', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchSupplierPaymentTerm();
      setParams(initialValues)
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Supplier Payment Term" sub_title="Add/Remove Items to the List of Supplier Payment types." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : SupplierPayment.length > 0 ? <SupplierPaymentTable rows={SupplierPayment} handleDelete={handleDelete} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default paymentsTerm;

