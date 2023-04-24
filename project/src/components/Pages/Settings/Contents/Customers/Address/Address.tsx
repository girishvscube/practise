import IndustryTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: '',
};
const Address = () => {
  const [params, setParams] = useState(initialValues);
  const [Addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [addressId, setaddressId] = useState()
  const [button, setButton] = useState(false)
  const handleClickOpen = (id: any) => {
    setaddressId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchAddresses();
  }, [])

  const fetchAddresses = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/customers/address-type')
      .then((res) => {
        setAddresses(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/customers/address-type/${addressId}`).then((res) => {
      fetchAddresses();
      setButton(false)
      showToastMessage(res?.data.data.message, 'success')
      setOpen(false)
    }).catch((err) => {
      setButton(false)
      showToastMessage('Error', 'error')
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/customers/address-type', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchAddresses();
      setParams(initialValues)
    }).catch((err) => {
      showToastMessage('Error', 'error')
    })
  };

  return (
    <div className="p-6">
      <HeaderCommon title="Address Type" sub_title="Add/Remove Items to the List of Address types." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">
        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : Addresses.length > 0 ? <IndustryTable rows={Addresses} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }

      </div>

    </div>
  );
};

export default Address;
