import CustomButton from '../../../common/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import DownCircle from '../../../../assets/icons/lightArrows/DownCircleLight.svg'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DriversDetails from './DriversDetails';
import Tab from './Tab/Tab';
import BrowserDashboard from './Tab/BrowserDashboard/Dashboard';
import ActivityLogs from './Tab/ActivityLogs/Log';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBrowser, fetchBrowsersList } from '../../../../features/browser/browserSlice';
import InfoSquare from '../../../../assets/images/InfoSquare.svg';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Status from '../../../common/Status';
import { SelectInput } from '../../../common/input/Select';
import { TimeandDatePicker } from '../../../common/DateTimePicker';
import moment from 'moment';
import TextArea from '../../../common/input/TextArea';
import Validator from 'validatorjs';
import axiosInstance from '../../../../utils/axios';
import { toast } from 'react-toastify';

const { fields, rules } = require('../Create/fields');
import CircularProgress from '@mui/material/CircularProgress';
import Logs from '../../../common/Logs'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#262938 !important',
    // border: 'none',import { useDispatch } from 'react-redux';
  },
  details: {
    border: '1px solid red',
    margin: ' 24px',
    backgroundColor: '#151929',
    borderRadius: '1rem',
  },

  AccordionSummary: {
    borderRadius: '15px',
    margin: '0px',
    padding: '0px',
    maxHeight: '25px',
    // borderBottom: '1px solid #404050',
  },

  tooltip: {
    padding: '8px',
    backgroundColor: '#fff',
  },

  //
}));

interface StationProps {
  type: string
}

const initialValues = {
  id: '',
  user: '',
  status: '',
  start_time: '',
  end_time: '',
  notes: '',
  driver: '',
  driver_id: '',
};

const BowserView = (type) => {
  const dispatch = useDispatch();
  const { browserList, browsers, isLoading } = useSelector((state: any) => state.browser);
  const { id } = useParams();
  const [params, setParams] = useState(initialValues);
  const [formErrors, setFormErrors] = useState(initialValues);
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState([] as any)

  const navigate = useNavigate();

  const TabConstants = [
    {
      title: 'Drivers Details',
    },
    {
      title: 'Bowser Dashboard',
    },
    {
      title: 'Activity Logs',
    },
  ];

  const statusList = [
    { id: 'On Trip', name: 'On Trip' },
    { id: 'Available', name: 'Available' },
    { id: 'On Hold', name: 'On Hold' },
    { id: 'Out of Service', name: 'Out of Service' },
  ];

  const [browser] = useState(fields);

  // console.log(browsers);
  useEffect(() => {
    dispatch(fetchBrowser(id));
  }, []);

  useEffect(() => {
    dispatch(fetchBrowsersList(currentPage, params.driver, params.status, ''));
  }, [currentPage]);

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      // backgroundColor: '#6A6A78',
      color: '#6A6A78',
      boxShadow: theme.shadows[2],
      fontSize: 14,
      background: '#151929',
      padding: '10px',
      lineHeight: '25px',
    },
  }));

  const bowserDocuments = [
    {
      doc: true,
      name: 'Registration',
      value: 'Download',
      validity: browsers?.registration_validity,
      downloadlink: browsers?.registration,
    },
    {
      name: 'Pollution Certificate',
      value: 'Download',
      validity: browsers?.pollution_cert_validity,
      downloadlink: browsers?.pollution_cert,
      doc: true,
    },
    {
      name: 'Vehicle Fitness',
      value: 'Download',
      validity: browsers?.vehicle_fitness_validity,
      downloadlink: browsers?.vehicle_fitness,
      doc: true,
    },
    {
      name: 'Heavy Vehicle',
      value: 'Download',
      validity: browsers?.heavy_vehicle_validity,
      downloadlink: browsers?.heavy_vehicle,
      doc: true,
    },
    {
      name: 'Other Documents',
      value: 'Download',
      validity: 'Nothing to show!',
      downloadlink: browsers?.other_doc,
      doc: true,
    },
  ];
  const bowserDetails = [
    {
      name: 'Bowser ID',
      value: browsers?.id,
    },
    {
      name: 'Registration Number',
      value: browsers?.registration_no,
    },
    {
      name: 'Fuel Capacity',
      value: browsers?.fuel_capacity,
    },
  ];

  const linkedParkingStation = [
    {
      name: 'Parking Station',
      value: browsers?.parkingstation?.station_name,
    },
  ];

  const classes = useStyles();

  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  const handleStatus = async () => {
    const validation = new Validator(params, {});
    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });

      setFormErrors(fieldErrors);
      return false;
    }
    await axiosInstance
      .patch(`/admin/bowser/update-status/${id}`, params)
      .then((response) => {
        showToastMessage(response.data.data.message, 'success');
        dispatch(fetchBrowser(id));
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

  // Auto fill form to edit (update) profile's code is in Browser/Create/Form.tsx
  const handleAction = (id: any) => {
    navigate(`/fleet_manage/bowser/${id}`);
  };

  // const driversList: string[] = [];
  // const mapDrivers = browserList.map(data => {
  //   driversList.push(data.driver)
  // })
  // const driverNames = driversList.filter(i => i === null ? '' : i)


  useEffect(() => {
    fetchDrivers();
  }, [])
  // console.log(id, '......');

  const fetchDrivers = () => {
    axiosInstance.get(`/admin/users/dropdown?module=drivers`).then((res) => {
      console.log(res?.data?.data, "drivers");
      setDrivers(res?.data?.data)
    }).catch((err) => {

    })
  }
  return (
    <>
      <BreadCrumb
        links={[
          { path: 'Bowsers', url: '/fleet_manage/bowser' },
          { path: 'View Bowsers', url: '' },
        ]}
      />

      <p className="font-black mb-7"> View Bowsers</p>

      {
        isLoading ?
          <div className="w-full h-80 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> :
          <div className="flex flex-col  sm:flex-row gap-5">
            <div className="flex flex-col gap-5">
              <div className="divstyles bg-lightbg w-full sm:w-[300px]">
                <div className="flex items-center  justify-between sm:gap-0 flex-row sm:flex-col mt-0 sm:mt-10 mb-4">
                  {
                    browsers?.image ? <img src={browsers.image} className="sm:m-auto border border-yellow rounded-lg  sm:h-[174px] sm:w-[173px] h-[101px] w-[102px]" /> : <img
                      className="sm:m-auto border border-yellow rounded-lg  sm:h-[174px] sm:w-[173px] h-[101px] w-[102px]"
                      src="https://i.pinimg.com/originals/ef/ef/05/efef0506561ae74d0e66cd4a14971c8f.jpg"
                      alt=""
                    />
                  }
                  <div className="">
                    <p className="mb-1 mt-4 text-center">{browsers?.name}</p>
                    <CustomButton
                      borderRadius="1rem"
                      width="m-auto w-fit "
                      variant="outlined"
                      size="medium"
                      onClick={() => {
                        handleAction(browsers?.id);
                      }}
                      icon={(
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.87402 10.2214H10.5003"
                            stroke="#FFCD2C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.39 1.8974C6.77783 1.43389 7.47499 1.36593 7.94811 1.74587C7.97427 1.76648 8.81474 2.41939 8.81474 2.41939C9.33449 2.7336 9.49599 3.40155 9.1747 3.91129C9.15764 3.93859 4.40597 9.88224 4.40597 9.88224C4.24789 10.0794 4.00792 10.1959 3.75145 10.1987L1.93176 10.2215L1.52177 8.48616C1.46433 8.24215 1.52177 7.98589 1.67985 7.78867L6.39 1.8974Z"
                            stroke="#FFCD2C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.51074 3.00049L8.23687 5.09405"
                            stroke="#FFCD2C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    >
                      Edit Profile
                    </CustomButton>
                  </div>
                </div>
                <div className="flex flex-col ">
                  <Accordion elevation={0} className={classes.root}>
                    <AccordionSummary
                      expandIcon={<img src={DownCircle} alt="icon" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        {' '}
                        <p className=" font-nunitoRegular my-2 text-white">Bowser Details</p>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className="bg-darkbg  flex flex-col gap-y-6 rounded-lg p-[24px] font-nunitoRegular ">
                          {bowserDetails.map((item, index) => (
                            <div className="flex justify-between">
                              <p className=" text-xs text-textgray my-auto">{item.name}</p>
                              <p className="text-sm text-white text-right">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion elevation={0} className={classes.root}>
                    <AccordionSummary
                      expandIcon={<img src={DownCircle} alt="icon" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        {' '}
                        <p className=" font-nunitoRegular my-2 text-white">Bowser Documents</p>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className="font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] ">
                          {bowserDocuments.map((item) => (
                            <div className="flex justify-between">
                              <div className="flex flex-row">
                                <div className="text-xs text-textgray my-auto">
                                  {item.name}
                                </div>
                                <div className="my-auto mx-1">
                                  {
                                    item?.name === 'Other Documents' ? '' :
                                      item?.validity === null || item?.validity === '' ? '' :
                                        <LightTooltip title={moment((item?.validity)).format('DD/MM/YYYY')} placement="bottom">
                                          <img src={InfoSquare} alt="" />
                                        </LightTooltip>
                                  }
                                </div>
                              </div>
                              {item.doc === true ? (
                                item?.downloadlink === null || item?.downloadlink === '' ? <p className="text-sm text-white text-right">----</p> :
                                  <a className="text-green" href={item?.downloadlink} download>
                                    {item.value}
                                    {' '}
                                    <svg
                                      className=" pb-1 inline-block"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 14 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.08097 9.2907L7.08097 1.26337"
                                        stroke="#3AC430"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M9.02466 7.33887L7.08066 9.29087L5.13666 7.33887"
                                        stroke="#3AC430"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M10.1693 4.41864H10.7913C12.148 4.41864 13.2473 5.51797 13.2473 6.87531L13.2473 10.1313C13.2473 11.4846 12.1506 12.5813 10.7973 12.5813L3.37065 12.5813C2.01398 12.5813 0.913982 11.4813 0.913982 10.1246L0.913982 6.86797C0.913982 5.51531 2.01132 4.41864 3.36398 4.41864H3.99198"
                                        stroke="#3AC430"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </a>
                              ) : (
                                <p className="text-sm text-white  text-right">{item.value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion elevation={0} className={classes.root}>
                    <AccordionSummary
                      expandIcon={<img src={DownCircle} alt="icon" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        {' '}
                        <p className=" font-nunitoRegular my-2 text-white">Linked Parking Station</p>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className="bg-darkbg  flex flex-col gap-y-6 rounded-lg p-[24px] font-nunitoRegular ">
                          {linkedParkingStation.map((item, index) => (
                            <div className="flex justify-between">
                              <p className=" text-xs text-textgray my-auto">{item.name}</p>
                              <p className="text-sm text-white  text-right">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>

              <div className="divstyles bg-lightbg w-full sm:w-[300px]">
                <p className="subheading">Bowser Status</p>
                <div className="bg-darkbg  flex flex-col gap-y-6 rounded-lg p-4 font-nunitoRegular">
                  <div className="flex justify-between pb-3 align-center border-b border-border">
                    <p className="text-textgray my-auto text-xs">Current status:</p>
                    {/* {
                       browsers?.status === 'Available' ? <Status color="Available">Available</Status> : browsers?.status === 'On Trip' ? <Status color="On Trip">On Trip</Status> : browsers?.status === 'Out of Service' ? <Status color="Out of Service">Out of Service</Status> : <Status color="On Hold">On Hold</Status>
                     } */}
                    <Status>{browsers?.status}</Status>
                  </div>

                  <div>
                    <SelectInput
                      options={statusList}
                      handleChange={handleChange}
                      value={params?.status}
                      label="Select Status"
                      name="status"
                    />
                  </div>

                  <TextArea rows={5} handleChange={handleChange} name="notes" value={params?.notes} placeholder="Additional Info" />

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

            <div className="flex flex-col w-full gap-5 ">
              <div className="bg-lightbg  rounded-lg">
                <Tab
                  cols={TabConstants}
                  data={[<DriversDetails driverNames={drivers} driverId={id} params={params} setParams={setParams} />, <BrowserDashboard bowserId={id} />, <Logs logs={browsers?.logs} />]}
                />
              </div>
            </div>
          </div>
      }


    </>
  );
};

export default BowserView;
