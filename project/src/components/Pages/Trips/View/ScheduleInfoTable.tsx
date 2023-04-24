import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
// import Popup from './Popup';
import { getPoc, DeletePoc, getCustomerPocList } from '../../../../features/customer/pocSlice';
import CustomButton from '../../../common/Button';
import { fetchBrowsersList, fetchBrowser, updateBowser, updateApi } from '../../../../features/browser/browserSlice';
import axiosInstance from '../../../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSaleExecutiveList } from '../../../../features/dropdowns/dropdownSlice';
import Status from '../../../common/Status';
import { NONAME } from 'dns';
import ArrowUpCircleYellow from '../../../../assets/images/ArrowUpCircleYellow.svg';
import PopUp from './PopUp';
import Validator from 'validatorjs';
import { updateTrip, fetchScheduledTrip, fetchTrip } from '../../../../features/trips/tripsSlice';

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#6A6A78',
    },
    '& th ': {
      color: '#6A6A78',
    },
  },

  tr: {
    '& td:first-child ': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
    '& td:last-child ': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
    },

  },

  statusAssigned: {
    color: '#3AC430',
  },
  statusUnassigned: {
    color: '#EF4949',
  },
  forArrow: {
    '&:hover': {
      cursor: 'pointer',
    },
  },

}));

const cols = [
  {
    title: 'Trips No',
  },
  {
    title: 'PO No.',
  },
  {
    title: 'Browser Name',
  },
  {
    title: 'Trip Start time & Date',
  },
  {
    title: 'Trip End time & Date',
  },
];



const defaultParams = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: '',
  odometer: '',
  id: '',
  is_start: false
}
const ScheduleInfoTable = ({ tripId, scheduleData, po }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [showInnerViewIndex, setInnerViewIndex] = useState(-1);
  const [showPoInfo, setShowPoinfo] = useState(false);
  const [open, setopen] = useState(false);
  const [startStatus, setStartStatus] = useState(false);
  const [params, setParams] = useState(defaultParams);


  const [formErrors, setFormErrors] = useState({
    odometer: '',
    status: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(name, value, String(value).length > 1)
    if (String(value).length > 1) return
    const re = /^[0-9\b]+$/
    if (value && !re.test(value)) {
      return
    }
    setParams({ ...params, [name]: value });
  };
  
  // console.log(scheduleData, 'scheduleData');
  // console.log(po, 'po'); 

  const isEnableStart = (index: any,orders) => {
    if(index ===0 && po && po.actual_time_of_delivery){
      return true
    }

    let prevOrder =orders[index-1]?  orders[index-1] :''
    if(prevOrder && prevOrder.actual_time_of_delivery){
      return true
    }


    return false
    
  };

  // popup
  const handleOpen = (payload, type) => {
    setParams({ ...params, id: payload.id, is_start: type == 'start' ? true : false })
    setopen(true);
  };

  const odoMeterUpdate = async (type) => {
    let odometerReading = `${params.val1}${params.val2}${params.val3}${params.val4}${params.val5}${params.val6}`;
    if (String(odometerReading).length !== 6) {
      showToastMessage('Please Enter All fields','error')
    }
    let obj = {
      odometer: parseInt(odometerReading),
      status: type === 'start' ? 'STARTED' : 'ENDED',
    };
    console.log(params, obj)
    const validation = new Validator(obj, {
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
      .put(`/admin/trips/schedule/update-status/${params.id}`, obj)
      .then((response) => {
        // console.log(response, 'zzzzz')
        showToastMessage(response.data.data.message, 'success');
        setStartStatus(response.data.status);
        setopen(false)
        setParams(defaultParams)
        dispatch(fetchTrip(tripId));
      })
      .catch((error) => {
        showToastMessage(error.message, 'error');
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

  // console.log(po, 'zzzzz')
  // console.log(scheduleData, 'qqqq')

  return (
    <>

      <TableContainer component={Paper}>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: 'none',
            },
            minWidth: 650,
            border: '1px solid #404050',
            borderCollapse: 'separate',
            borderSpacing: '0px 20px',
            px: '24px',
            borderRadius: '8px',
            '& .MuiTableCell-head': {
              padding: 0,
            },

          }}
          className={classes.root}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">

              </TableCell>
              <TableCell align="center">
                <span>PO/SO No</span>
              </TableCell>
              <TableCell align="center">
                <span>Est time of Delivery</span>
              </TableCell>
              <TableCell align="center">
                <span>Actual Time of Delivery</span>
              </TableCell>
              <TableCell align="center">
                <span>Status</span>
              </TableCell>
              <TableCell align="center">
                <span>Action</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            <TableRow key='' sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
              <TableCell colSpan={10} align="left">
                Trip Start time:
                <span style={{ color: '#ffffff', marginLeft: '5px' }}>{`${moment(scheduleData?.start_time).format('HH:mm, DD/MM/YYYY')}`}</span>
              </TableCell>
            </TableRow>

            {
              po ?
                <>
                  <TableRow key='' sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
                    <TableCell align="center" >
                      <div className={classes.forArrow}>
                        <img src={ArrowUpCircleYellow} style={{ transform: showPoInfo ? "rotate(180deg)" : "rotate(0)", transition: "all 0.2s linear" }} alt='' onClick={() => setShowPoinfo(showPoInfo ? false : true)} />
                      </div>
                    </TableCell>
                    <TableCell align="center" >
                      <p className="text-sm text-white">PO{po?.id}</p>
                    </TableCell>
                    <TableCell align="center" >
                      <p className="text-sm text-white">
                        {po?.actual_start_time === '' || po?.actual_start_time === null ? '--' : moment((po?.actual_start_time)).format('HH:mm, DD/MM/YYYY') !== 'Invalid date' && moment((po?.actual_start_time)).format('HH:mm, DD/MM/YYYY')}
                      </p>
                    </TableCell>
                    <TableCell align="center" >
                      <p className="text-sm text-white">
                        {po?.actual_time_of_delivery === '' || po?.actual_time_of_delivery === null ? '--' : moment((po?.actual_time_of_delivery)).format('HH:mm, DD/MM/YYYY') !== 'Invalid date' && moment((po?.actual_time_of_delivery)).format('HH:mm, DD/MM/YYYY')}
                        {/* {moment(po?.actual_time_of_delivery).format('HH:mm, DD/MM/YYYY')} */}
                      </p>
                    </TableCell>
                    <TableCell align="center" >
                      <p className="text-sm text-white">{po?.status}</p>
                    </TableCell>
                    <TableCell align="center" >

                      {
                        po.status === 'NOT_STARTED' ?
                          <CustomButton
                            onClick={() => handleOpen(po, 'start')}
                            variant="outlined"
                            size="large"
                            borderRadius={'8px'}
                          >
                            <p className="font-bold text-yellow font-nunitoRegular text-sm">Start</p>
                          </CustomButton> : 
                          <>
                            {
                              !po.actual_time_of_delivery ?
                                <CustomButton
                                  onClick={() => handleOpen(po, 'end')}
                                  variant="outlined"
                                  size="large"
                                  borderRadius={'8px'}
                                >
                                  <p className="font-bold text-yellow font-nunitoRegular text-sm">End</p>
                                </CustomButton> : '--'
                            }

                          </>


                      }
                    </TableCell>
                  </TableRow>
                  {
                    showPoInfo ?
                      <TableRow key='' sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
                        <TableCell colSpan={10} align="left">
                          <div className="subdiv grid grid-cols-3 gap-x-9 w-full">
                            <div className="">
                              <p className="text-xs text-textgray my-1">Supplier</p>
                              <p className="text-sm text-white">{po?.supplier_name}</p>
                            </div>
                            <div className="">
                              <p className="text-xs text-textgray my-1">PO Download</p>
                              <p className="text-sm text-white">
                                <a className="text-green" href=''>
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
                              </p>
                            </div>
                            <div className="">
                              <p className="text-xs text-textgray my-1">Quantity</p>
                              <p className="text-sm text-white">{po?.fuel_qty}</p>
                            </div>
                            <div className="">
                              <p className="text-xs text-textgray my-1">Delivery Address</p>
                              <p className="text-sm text-white">{po?.delivery_detail}</p>
                            </div>
                            <div className="">
                              <p className="text-xs text-textgray my-1">Supplier Phone</p>
                              <p className="text-sm text-white">{po?.phone || 'NA'}</p>
                            </div>
                            <div className="">
                              <p className="text-xs text-textgray my-1">Payment mode</p>
                              <p className="text-sm text-white">{po?.payment_term || 'NA'}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow> : <> </>
                  }
                </>

                : <></>

            }

            {scheduleData?.orders.map((item: any, index: any) => (
              <>
                <TableRow key='' sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
                  <TableCell align="center" >
                    <div className={classes.forArrow}>
                      <img src={ArrowUpCircleYellow} style={{ transform: showInnerViewIndex === index ? "rotate(180deg)" : "rotate(0)", transition: "all 0.2s linear" }} onClick={() => setInnerViewIndex(index)} alt='' />
                    </div>
                  </TableCell>
                  <TableCell align="center" >
                    <p className="text-sm text-white">{item?.order_id ? 'SO' + item?.order_id : item?.so_id}</p>
                  </TableCell>
                  <TableCell align="center" >
                    <p className="text-sm text-white">
                      {item?.actual_start_time === '' || item?.actual_start_time === null ? '--' : moment((item?.actual_start_time)).format('HH:mm, DD/MM/YYYY') !== 'Invalid date' && moment((item?.actual_start_time)).format('HH:mm, DD/MM/YYYY')}
                    </p>
                  </TableCell>
                  <TableCell align="center" >
                    <p className="text-sm text-white">
                      {item?.actual_time_of_delivery === '' || item?.actual_time_of_delivery === null ? '--' : moment((item?.actual_time_of_delivery)).format('HH:mm, DD/MM/YYYY') !== 'Invalid date' && moment((item?.actual_time_of_delivery)).format('HH:mm, DD/MM/YYYY')}
                    </p>
                  </TableCell>
                  <TableCell align="center" >
                    <p className="text-sm text-white">{item?.status}</p>
                  </TableCell>
                  <TableCell align="center" >
                    {
                      po.actual_time_of_delivery ?
                        <>
                          {
                            item.show_start_button && isEnableStart(index,scheduleData?.orders) ?
                              <CustomButton
                                onClick={() => handleOpen(item, 'start')}
                                variant="outlined"
                                size="large"
                                borderRadius={'8px'}
                              >
                                <p className="font-bold text-yellow font-nunitoRegular text-sm">Start</p>
                              </CustomButton> : <></>

                          }
                          {
                            item.show_end_button ?
                              <CustomButton
                                onClick={() => handleOpen(item, 'end')}
                                variant="outlined"
                                size="large"
                                borderRadius={'8px'}
                              >
                                <p className="font-bold text-yellow font-nunitoRegular text-sm">End</p>
                              </CustomButton> : <></>

                          }

                        </>
                        : <>--</>

                    }
                  </TableCell>
                </TableRow>
                {
                  showInnerViewIndex === index ?
                    <TableRow key='' sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
                      <TableCell colSpan={10} align="left">
                        <div className="subdiv grid grid-cols-3 gap-x-9 w-full">
                          <div className="">
                            <p className="text-xs text-textgray my-1">Customer</p>
                            <p className="text-sm text-white">{item?.company_name}</p>
                          </div>
                          <div className="">
                            <p className="text-xs text-textgray my-1">PO /SO Download</p>
                            <p className="text-sm text-white">
                              <a className="text-green" href=''>
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
                            </p>
                          </div>
                          <div className="">
                            <p className="text-xs text-textgray my-1">Quantity</p>
                            <p className="text-sm text-white">{item?.fuel_qty}</p>
                          </div>
                          <div className="">
                            <p className="text-xs text-textgray my-1">Delivery Address</p>
                            <p className="text-sm text-white">{item?.customer_delivery_detail?.street_address}</p>
                          </div>
                          <div className="">
                            <p className="text-xs text-textgray my-1">POC Phone Number</p>
                            <p className="text-sm text-white">{item?.phone}</p>
                          </div>
                          <div className="">
                            <p className="text-xs text-textgray my-1">Payment mode</p>
                            <p className="text-sm text-white">{item?.payment_term || 'NA'}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow> : <> </>
                }
              </>
            ))}


            <TableRow key='' sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
              <TableCell colSpan={10} align="left">
                Trip End time:
                <span style={{ color: '#ffffff', marginLeft: '5px' }}>{`${moment(scheduleData?.end_time).format('HH:mm, DD/MM/YYYY')}`}</span>
              </TableCell>
            </TableRow>
          </TableBody>

        </Table>

      </TableContainer>
      <PopUp
        open={open}
        handleClose={() => setopen(false)}
        title='Update ODOMeter'
        type="start"
        name=""
        params={params}
        setParams={handleChange}
        submit={() => odoMeterUpdate(params.is_start ? 'start' : 'end')}
      />
    </>
  );
};
export default ScheduleInfoTable;
