import EquipmentTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
const initialValues = {
  name: '',
};
const Equipment = () => {
  const [params, setParams] = useState(initialValues);
  const [Equpiments, setEqupiments] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [equipmentId, setequipmentId] = useState()
  const [button, setButton] = useState(false)
  const handleClickOpen = (id: any) => {
    setequipmentId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  useEffect(() => {
    fetchEqupiments();
  }, [])

  const fetchEqupiments = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/equipments')
      .then((res) => {
        setEqupiments(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/equipments/${equipmentId}`).then((res) => {
      showToastMessage(res?.data.data.message, 'success')
      setOpen(false)
      setButton(false)
      fetchEqupiments();
    }).catch((err) => {
      showToastMessage('Error', 'error')
      setButton(false)
    })
  }

  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/equipments', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchEqupiments();
      setParams(initialValues)
    })
  };


  return (
    <div className="p-6">
      <HeaderCommon title="Equipment Type" sub_title="Add/Remove Items to the List of Equipment types." handleChange={handleChange} params={params} handleSubmit={handleSubmit} name="name" />
      <div className="mt-6">

        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : Equpiments.length > 0 ?
            <EquipmentTable rows={Equpiments} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
              <img src={NotFound} alt="" />
              <p className="text-[18px] font-nunitoBold">No Results found !!</p>
            </div>
        }
      </div>

    </div>
  );
};

export default Equipment;
