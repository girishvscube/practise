import OrderStatusTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const OrderStatus = () => {
  const [params, setParams] = useState(initialValues);
  const [OrderStatus, setOrderStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [orderStatusId, setorderStatusId] = useState()
  const [button, setButton] = useState(false)
  const handleClickOpen = (id: any) => {
    setorderStatusId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchOrderStatus();
  }, [])

  const fetchOrderStatus = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/orders/status')
      .then((res) => {
        setOrderStatus(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/orders/status/${orderStatusId}`).then((res) => {
      setButton(false)
      showToastMessage('Successfully deleted', 'success')
      fetchOrderStatus();
      setOpen(false)
    }).catch((err) => {
      setButton(false)
      showToastMessage('Error in delete', 'error')
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/orders/status', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchOrderStatus();
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
          </div> : OrderStatus.length > 0 ? <OrderStatusTable rows={OrderStatus} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default OrderStatus;

