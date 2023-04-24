import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import moment from 'moment';

import CustomButton from '../../../common/Button';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

import DownCirlce from '../../../../assets/icons/lightArrows/DownCircleLight.svg';
import userDefault from '../../../../assets/icons/user/user_default.svg';
import Chrome from '../../../../assets/icons/user/Chrome.svg';
import defaultBrowser from '../../../../assets/icons/user/defaultBrowser.svg';
import Edge from '../../../../assets/icons/user/Edge.svg';
import Firefox from '../../../../assets/icons/user/Firefox.svg';
import Safari from '../../../../assets/icons/user/Safari.svg';

import { ViewUser } from '../../../../features/userInfo/userSlice';
import axiosInstance from '../../../../utils/axios';
import { decryptData } from '../../../../utils/encryption';
import { uuid } from '../../../../utils/helpers';
import Logs from '../../../common/Logs';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '../../../common/Pagination/Pagination';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#262938 !important',
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
  },
}));

const View = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { id } = useParams();
  const { userInfo, isLoading } = useSelector((state: any) => state.user);
  const [user, setUser] = useState([]);
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({
      total: 0
  })
  const [date, setDate] = useState({
      start_date: '',
      end_date: ''
  })
  const [currentPage, setCurrentPage] = useState(1);
  const [bankInfo, setBankInfo] = useState([]);

  const getBrowserImg = (device_info) => {
    if (device_info && !device_info.client) {
      return defaultBrowser;
    }

    if (device_info && device_info.client.name.toLowerCase().includes('chrome')) {
      return Chrome;
    }

    if (device_info && device_info.client.name.toLowerCase().includes('safari')) {
      return Safari;
    }

    if (device_info && device_info.client.name.toLowerCase().includes('firefox')) {
      return Firefox;
    }

    if (device_info && device_info.client.name.toLowerCase().includes('edge')) {
      return Edge;
    }

    return defaultBrowser;
  };

  useEffect(() => {
    const userData: any = [
      {
        name: 'User Id',
        value: userInfo?.id,
      },
      {
        name: 'Phone Number',
        value: userInfo?.phone,
      },
      {
        name: 'User Role',
        value: userInfo?.role?.name,
      },
      {
        name: 'Email ID',
        value: userInfo?.email,
      },
      {
        name: 'Address',
        value: userInfo?.address,
      },
      ...userInfo.dl_image ? [{
        name: 'Driving License',
        value: 'Download',
        downloadlink: userInfo.dl_image,
      }] : [],
      ...userInfo.images && userInfo.images.length ? userInfo.images.filter(x => x).map(x => ({
        name: x.label,
        value: 'Download',
        downloadlink: x.url,
      })) : [],
    ];
    setUser(userData);
    if (userInfo.bank_details && Object.keys(userInfo.bank_details).length) {
      const info = userInfo.bank_details;
      const bankinfo: any = [
        { name: 'Bank Name', value: info.bank_name },
        { name: 'Account Number', value: info.account_no },
        { name: 'IFSC Code', value: info.ifsc_code },
        {
          name: 'Account Name', value: info.account_name,
        },
        ...info.check_image ? [{
          name: 'Cancel Check',
          value: 'Download',
          downloadlink: info.check_image,
        }] : [],

      ];
      setBankInfo(bankinfo);
    }
  }, [userInfo]);

  useEffect(() => {
    dispatch(ViewUser(decryptData(id)));
  }, []);

  const classes = useStyles();

  const handleClick = (data: any) => {
    navigate(`/users/edit/${id}`);
  };


  const getLogs = async () => {
    await axiosInstance(`/admin/users/logs/${decryptData(id)}?page=${currentPage}&start_date=${date.start_date}&end_date=${date.end_date}`)
      .then((response) => {
        console.log(response.data)
        let list = response.data.data.data;
        setLogs(list);
        setMeta(response.data.data.meta);
      })
      .catch((error) => {
      });
  };

  useMemo(() => {
      getLogs()
  }, [currentPage, date]);

  const onDateRangeSelection = (date: any) => {
      setDate(date)
  }


  return (
    <>
      <BreadCrumb
        links={[
          { path: 'Users', url: '/users' },
          { path: 'View Profile', url: '' },
        ]}
      />

      <p className="font-black mb-7"> View User Profile</p>

      {
        !isLoading
          ? (
            <div className="flex flex-col  sm:flex-row gap-5">
              <div className="flex flex-col   p-4 bg-lightbg w-full sm:w-1/3	 rounded-lg border border-border	">
                <div className="flex items-center  justify-between sm:gap-0 flex-row sm:flex-col mt-0 sm:mt-10 mb-4 ">
                  <img
                    className="sm:m-auto border border-yellow rounded-lg  sm:h-[174px] sm:w-[173px] h-[101px] w-[102px]"
                    src={
                      userInfo?.image
                        ? userInfo.image
                        : userDefault
                    }
                    alt="user profile"
                  />
                  <div className="">
                    <p className="mb-1 mt-4 text-center">{userInfo?.name}</p>
                    <CustomButton
                      onClick={() => { handleClick(userInfo) }}
                      borderRadius="1rem"
                      width="m-auto w-fit "
                      variant="outlined"
                      size="medium"
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
                <div className="  flex flex-col ">
                  <Accordion elevation={0} className={classes.root} defaultExpanded>
                    <AccordionSummary
                      expandIcon={<img src={DownCirlce} alt="icon" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        {' '}
                        <p className=" font-nunitoRegular my-2 text-white">Basic Details</p>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className="bg-darkbg flex flex-col gap-y-6 rounded-lg p-4 font-nunitoRegular ">
                          {user.map((item: any) => (
                            <div className="flex justify-between" key={uuid()}>
                              <p className=" text-xs text-textgray">{item.name}</p>
                              {item.downloadlink ? (
                                <a className="text-green" href={item.downloadlink} download>
                                  {item?.value}
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
                                <p className="text-sm text-white  text-right">{item?.value === 'Download' ? '' : item.value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  {
                    bankInfo.length ? (
                      <Accordion elevation={0} className={classes.root}>
                        <AccordionSummary
                          expandIcon={<img src={DownCirlce} alt="icon" />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {' '}
                            <p className=" font-nunitoRegular my-2 text-white">Bank Details</p>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div className="font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] ">
                              {bankInfo.map((item: any) => (
                                <div className="flex justify-between" key={uuid()}>
                                  <p className=" text-xs text-textgray">{item.name}</p>
                                  {item.name.includes('Check') ? (
                                    <a className="text-green" href={item.downloadlink} download>
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
                    ) : ''
                  }

                </div>
              </div>

              <div className="flex flex-col w-full gap-5 ">
                <div className="bg-lightbg border-border border rounded-lg  ">
                  <p className="font-bold  text-yellow   mx-6 py-4 border-b-2 border-yellow text-lg  w-fit">
                    Overview
                  </p>
                </div>

                <div className="mobileView bg-lightbg ">
                  <p className="subheading">Current Session</p>

                  <div className="childstyles flex flex-col sm:flex-row justify-center">
                    {
                      userInfo?.session
                        ? (
                          <>
                            <div className="w-full flex flex-row sm:flex-col  gap-1">
                              <p className="sm:border-b sm:border-border pb-2 text-xs w-full text-textgray">
                                Browser
                              </p>

                              <p className=" text-right text-sm pl-4 pt-4">
                                <img src={getBrowserImg(userInfo?.session?.device_info)} alt="browser" />
                              </p>
                            </div>

                            <div className="w-full flex flex-row sm:flex-col  gap-1">
                              <p className="sm:border-b sm:border-border pb-2 text-xs w-full text-textgray">
                                Device Info
                              </p>
                              <p className=" text-left text-xs pt-4">
                                {userInfo?.session?.user_ip}
                              </p>
                              <p className=" text-left text-xs">
                                {
                                  userInfo?.session?.device_info
                                    && userInfo?.session?.device_info?.client ? (
                                    <>
                                      {userInfo?.session?.device_info?.client.name}
                                      {' '}
                                      on
                                      {''}
                                      {userInfo?.session?.device_info?.device.type}
                                    </>
                                  )
                                    : ''
                                }

                              </p>
                              <p className="text-left text-xs">
                                Last Accessed on:
                                {' '}
                                {moment(userInfo?.session?.last_access_on).format('DD-MM-YYYY')}
                              </p>
                              <p className="text-left text-xs">
                                Signed in:
                                {' '}
                                {moment(userInfo?.session?.signin_at).format('DD-MM-YYYY')}
                              </p>
                            </div>

                            <div className="w-full flex flex-row sm:flex-col  gap-1">
                              <p className="sm:border-b sm:border-border pb-2 text-xs w-full text-textgray">
                                Location
                              </p>
                              {
                                userInfo?.session?.location
                                  ? (
                                    <>
                                      <p className=" text-left text-sm pt-4">
                                        {userInfo?.session?.location?.country}
                                      </p>
                                      <p className=" text-left text-sm">
                                        {userInfo?.session?.location?.city}
                                      </p>
                                    </>
                                  )
                                  : (
                                    <p className=" text-left text-sm pt-4">
                                      NA
                                    </p>
                                  )

                              }

                            </div>

                          </>
                        )

                        : 'No Active Sessions'
                    }
                  </div>


                </div>

                <Logs logs={logs} image={userInfo?.image} enable_date={true} onDateSelect={onDateRangeSelection} />
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={meta.total}
                    pageSize={10}
                    onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-80 flex justify-center items-center">
              <CircularProgress />
              <span className="text-3xl">Loading...</span>
            </div>
          )
      }

    </>
  );
};

export default View;
