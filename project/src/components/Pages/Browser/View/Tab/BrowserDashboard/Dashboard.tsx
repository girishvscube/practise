import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
// import PopUp from './DeliveryPopUp';
import UpCircle from '../../../../assets/icons/lightArrows/UpCircleLight.svg';
import Link from '../../../../assets/images/Link.svg';
import DashboardTable from './DashboardTable';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TablePagination from '../../../../User/Pagination';
import moment from 'moment';
import { DateFiter } from '../../../../../common/DateFiter';
import { fetchDriverDetails } from '../../../../../../features/browser/browserSlice';
import axiosInstance from '../../../../../../utils/axios';
import { CircularProgress } from '@mui/material';

const useStyles = makeStyles(() => ({
  root: {
    // backgroundColor: '#151929 !important',
    paddingY: '30px',
    '&:before': {
      backgroundColor: 'transparent',
    },
  },
  details: {
    margin: ' 24px',
    backgroundColor: '#151929',
    borderRadius: '1rem',
  },

  summary: {
    backgroundColor: '#151929 !important',
    borderRadius: '8px !important',
    margin: '0px',
    padding: '0px',
    // maxHeight: '25px',
  },
}));
interface DashboardProps {
  // cust_id: any
  bowserId?: any
}
const initialValues = {
  id: '',
  user: '',
  status: '',
  start_time: '',
  end_time: '',
};
const BowserDashboard = ({ bowserId }: DashboardProps) => {
  console.log(bowserId, "bowwwwww");
  const { id } = useParams();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { metadata, driverDetails } = useSelector((state: any) => state.browser);
  const { totalPages } = metadata;
  const [gotoPage, setGotoPage] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState({
    start_date: '',
    end_date: ''
  })
  const [formErrors, setFormErrors] = useState(initialValues);
  const [params, setParams] = useState(initialValues);
  const classes = useStyles();
  const [dashboard, setDashboard] = useState([] as any)
  const [loading, setLoading] = useState(false)


  const fetchBowserDashboard = () => {
    setLoading(true)
    axiosInstance.get(`/admin/bowser/trip/details/${bowserId}`).then((res) => {
      setLoading(false)
      setDashboard(res?.data?.data?.data)
    }).catch((err) => {
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchBowserDashboard();
  }, [])

  return (
    <div className="w-full rounded flex flex-col gap-6">
      <div className="divstyles bg-lightbg ">
        <div className="flex justify-between mb-5">
          <div className="my-auto">
            <p className="subheading">Trips Info</p>
          </div>
          <div className="">
            {/* <DateFiter onDateRangeSelect={onDateSelect} /> */}
          </div>
        </div>
        <div className=" flex flex-col gap-4  justify-center ">
          <div>
            {
              loading ? <div className='w-full h-96 flex justify-center items-center'>
                <CircularProgress />
                <span className='text-3xl'>Loading...</span>
              </div> : <DashboardTable
                rows={dashboard}
                params={params}
              />
            }

          </div>
          <div />
        </div>

        <div className="w-full pt-10 flex justify-center gap-10">
          {/* <TablePagination onChange={handleChange} page={page} count={totalPages} /> */}
        </div>
      </div>
    </div>
  );
};
export default BowserDashboard;
