import DeliveryTimeTable from './Table';
import HeaderCommon from '../../HeaderCommon';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
import TimePicker from './TimePicker'
import Plus from '../../../../../../assets/icons/filledIcons/Plus.svg';
import moment from 'moment';
import { Dayjs } from 'dayjs';
import CustomButton from '../../../../../../components/common/Button';
const initialValues = {
  name: 'Morning',
  start: '',
  end: '',
};
const DeliveryTime = () => {
  const [start, setstart] = useState<Dayjs | null>(null);
  const [end, setend] = useState<Dayjs | null>(null);
  const [params, setParams] = useState(initialValues);
  const [DeliveryTime, setDeliveryTime] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [deliveryTime, setdeliveryTime] = useState()
  const [button, setButton] = useState(false)
  const handleClickOpen = (id: any) => {
    setdeliveryTime(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  useEffect(() => {
    fetchLeadsStatus();
  }, [])

  const handleTime = (newValue) => {
    setstart(newValue)
  }
  const handleTimeEnd = (newValue) => {
    setend(newValue)
  }

  const fetchLeadsStatus = () => {
    setLoading(true)
    axiosInstance.get('/admin/settings/time-slot')
      .then((res) => {
        setDeliveryTime(res?.data?.data)
        setLoading(false)
      })
  }


  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/time-slot/${deliveryTime}`).then((res) => {
      setButton(false)
      showToastMessage('Successfully deleted', 'success')
      fetchLeadsStatus();
      setOpen(false)
    }).catch((err) => {
      setButton(false)
      showToastMessage('error in deleted', 'error')
    })
  }

  const handleSubmit = () => {
    let postData = { ...params, start: moment(start?.toString()).format('HH:MM'), end: moment(end?.toString()).format('HH:MM') }
    axiosInstance.post('/admin/settings/time-slot', postData).then(() => {
      showToastMessage('Successfully Created', 'success')
      fetchLeadsStatus();
      setParams(initialValues)
    })
  };



  return (
    <div className="p-6">
      <div className="flex flex-col">
        <p className="subheading">Delivery Time</p>
        <p className="text-xs font-nunitoRegular">Add/Remove to the List of Delivery Time </p>
      </div>

      <div className="gap-6 mt-5 flex">
        <div className='flex gap-6'>
          <TimePicker value={start} handleChange={handleTime} label="Start Date" />
          <TimePicker value={end} handleChange={handleTimeEnd} label="End Date" />
        </div>
        <div className="pt-2 w-full">
          <CustomButton
            onClick={handleSubmit}
            width="w-fit"
            variant="outlined"
            size="large"
            borderRadius="8px"
            icon={<img src={Plus} alt="" />}
            disabled={start && end ? false : true}
          >
            Add to List
          </CustomButton>
        </div>


      </div>

      <div className="mt-6">

        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : DeliveryTime.length > 0 ? <DeliveryTimeTable rows={DeliveryTime} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button} /> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }
      </div>

    </div>
  );
};

export default DeliveryTime;

