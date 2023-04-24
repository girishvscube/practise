import CustomButton from '../../../common/Button';
import { toast } from 'react-toastify';
import EditIcon from '../../../../assets/images/EditIcon.svg';
import { useEffect, useState, useMemo } from 'react';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SelectInput } from '../../../common/input/Select';
import { TimeandDatePicker } from '../../../common/DateTimePicker';
import TextArea from '../../../common/input/TextArea';
import { fetchLead } from '../../../../features/leads/leadSlice';
import moment from 'moment';
import Status from '../../../common/Status';
import axiosInstance from '../../../../utils/axios';
import Validator from 'validatorjs';
import { decryptData } from '../../../../utils/encryption';
import Tab from './Tab/Tab';
import ActivityLogs from './Tab/ActivityLogs/Log';
import ScheduleInfo from './ScheduleInfo'
import { fetchTrip } from '../../../../features/trips/tripsSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Logs from '../../../common/Logs'

const status = [
  {
    id: 'IN_TRANSIT', name: 'IN_TRANSIT',
  },
  {
    id: 'NOT_SCHEDULE', name: 'NOT_SCHEDULE',
  },
  {
    id: 'SCHEDULE', name: 'SCHEDULE',
  },
  {
    id: 'TRIP_COMPLETED', name: 'TRIP_COMPLETED',
  },
];

const initalStates: any = {
  status: '',
  additional_notes: '',
  start_time: '',
  end_time: '',
};
const TripsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // const { leads } = useSelector((state: any) => state.lead);
  const { trips, response, isLoading } = useSelector((state: any) => state.trip);

  useEffect(() => {
    dispatch(fetchTrip(decryptData(id))); 
  }, []);

  // console.log(decryptData(id), 'nnnn');

  const [value, setValue] = useState<Date>();
  const [params, setParams] = useState(initalStates);
  const [formErrors, setFormErrors] = useState(initalStates);

  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };
  const basicinfo = [
    {
      name: 'Trip Number',
      value: trips?.id,
    },
    {
      name: 'Trip Start Time & Date',
      value: `${moment(trips?.start_time).format('HH:mm, DD/MM/YYYY')}`,
    },
    {
      name: 'Trip End Time & Date',
      value: `${moment(trips?.end_time).format('HH:mm, DD/MM/YYYY')}`,
    },
    {
      name: 'No of Delivered/ Total No of Orders',
      value: trips?.orders_linked+'/'+trips.orders_delivered ,
    },
    {
      name: 'PO No',
      value: trips?.po_id,
    },
    {
      name: 'Bowser',
      value: trips?.purchase_order?.bowser?.name,
    },
  ];

  const TabConstants = [
    {
      title: 'Trip Scheduled Info',
    },
    {
      title: 'Activity Logs',
    },
  ];

  const handleDate = (newValue) => {
    setFormErrors({ ...params, callback_time: '' });
    setValue(newValue);
    const newDate = moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss');
    setParams({ ...params, callback_time: newDate });
  };

  // useEffect(() => {
  //   setParams({
  //     ...params,
  //     status: leads?.data?.status,
  //     assigned_to: leads?.data?.assigned_to,
  //   });
  // }, [leads]);

  const handleClick = () => {
    navigate(`/sales/leads/edit/${id}`);
  };

  const handleConvert = () => {
    navigate(`/customers/create/${id}`);
  };

  const handleStatus = async () => {
    const validation = new Validator(params, {
      required: '* required',
    });
    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });

      setFormErrors(fieldErrors);
      return false;
    }
    await axiosInstance
      .patch(`/admin/trips/update-status/${decryptData(id)}`, params)
      .then((response) => {
        showToastMessage(response.data.data.message, 'success');
        dispatch(fetchLead(decryptData(id)));
        navigate('/fleet_manage/trips');
      })
      .catch((error) => {
        showToastMessage(error.data.data.message, 'error');
      });
    return true;
  };

  const showToastMessage = (message: string, type: string) => {
    if (type === 'error') {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // console.log(trips, 'rrrrr')

  return (
    <>
      <BreadCrumb
        links={[
          { path: 'Trips', url: '/fleet_manage/trips' },
          { path: 'View Trips', url: '' },
        ]}
      />

      <p className="font-black mb-7"> View Trips</p>
      {
        isLoading ?
          <div className="w-full h-80 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : <div className="flex flex-col  sm:flex-row gap-5">
            <div className="flex flex-col w-full sm:w-[450px]">
              <div className="flex flex-col gap-6">

                <div className="bg-lightbg p-4 border border-border rounded-lg">
                  <p className="subheading">Trip Info</p>
                  <div className="bg-darkbg  flex flex-col gap-y-6 rounded-lg p-4 font-nunitoRegular">

                    {basicinfo.map((item) => (
                      <div className="flex justify-between">
                        <p className=" text-xs text-textgray">{item.name}</p>
                        <p className="text-sm text-white  text-right">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="bg-lightbg p-4 border border-border rounded-lg">
                  <p className="subheading">Trip Status</p>
                  <div className="bg-darkbg  flex flex-col gap-y-6 rounded-lg p-4 font-nunitoRegular">
                    <div className="flex justify-between pb-3 border-b border-border">
                      <p className="text-textgray text-xs">Current Trip status:</p>
                      <Status>{trips?.status}</Status>
                    </div>

                    <div>
                      <SelectInput
                        options={status}
                        handleChange={handleChange}
                        value={params?.status}
                        label="Select Status"
                        name="status"
                      />
                    </div>

                    <TextArea rows={5} handleChange={handleChange} name="additional_notes" value={params?.additional_notes} placeholder="Additional Info" />

                    <div className="clearfix">
                      <div className="float-right">
                        <CustomButton
                          onClick={handleStatus}
                          borderRadius="1rem"
                          width="m-auto w-fit "
                          variant="outlined"
                          size="medium"
                          icon={(
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.92632 5.98919H4.30432C2.94766 5.98919 1.84766 7.08919 1.84766 8.44586V11.6959C1.84766 13.0519 2.94766 14.1519 4.30432 14.1519H11.7243C13.081 14.1519 14.181 13.0519 14.181 11.6959V8.43919C14.181 7.08652 13.0843 5.98919 11.7317 5.98919H11.103" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M8.01449 1.45997V9.4873" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M6.07031 3.4126L8.01365 1.4606L9.95765 3.4126" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                          )}
                        >
                          Update Status
                        </CustomButton>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className='flex flex-col w-full gap-5 '>
              <Tab
                cols={TabConstants}
                data={[<ScheduleInfo response={response} />,
                <Logs logs={trips?.logs}  />]}
              />
            </div>

          </div>
      }

    </>
  );
};

export default TripsView;
