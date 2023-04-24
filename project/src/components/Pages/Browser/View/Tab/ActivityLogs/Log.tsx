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
import LogTable from './LogTable';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { getCustomerPocList } from '../../../../features/customer/pocSlice';
// import { getDeliveryList } from '../../../../features/customer/deliverySlice';
// import axiosInstance from '../../../../utils/axios';
import TablePagination from '../../../../User/Pagination';
import { DateRangePicker } from '../../../../../common/input/DateRangePicker';
import moment from 'moment';
import { fetchDriverDetails } from '../../../../../../features/browser/browserSlice';
import CommonDatepicker from '../../../../../common/input/Datepicker';

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
interface ActivityLogProps {
  // cust_id: any
}
const ActivityLog = ({ }: ActivityLogProps) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const { deliveryList } = useSelector((state: any) => state.delivery);
  // const { poc, PocID, pocList } = useSelector((state: any) => state.poc);
  const [page, setPage] = useState(1);
  const { metadata, driverDetails } = useSelector((state: any) => state.browser);
  const { totalPages } = metadata;
  const [gotoPage, setGotoPage] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);

  const initialValues = {
    id: '',
    user: '',
    status: '',
    start_time: '',
    end_time: '',
  };

  const [formErrors, setFormErrors] = useState(initialValues);
  const [params, setParams] = useState(initialValues);

  const classes = useStyles();

  useEffect(() => {
    // dispatch(fetchDriverDetails(id));
  }, []);

  const handleChange = (value: any) => {
    setPage(value);
  };

  const handleInputChange = (event: any) => {
    setGotoPage(event.target.value);
  };

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    const sDate = moment(start).format('YYYY-MM-DD');
    const eDate = moment(end).format('YYYY-MM-DD');
    setParams({ ...params, start_time: sDate, end_time: eDate });
  };

  const onDateChange = (event, name) => {
    setParams({ ...params, [name]: event });
  };

  return (
    <div className="w-full rounded flex flex-col gap-6">
      <div className="divstyles bg-lightbg ">
        <div className="flex justify-between mb-5">
          <div className="my-auto">
            <p className="subheading">Logs Info</p>
          </div>
          <div className="">
            <CommonDatepicker label="Select Date" onChange={(e) => onDateChange(e, 'heavy_vehicle_validity')} value={params} />
          </div>
        </div>
        <div className=" flex flex-col gap-4  justify-center ">
          <div>
            <LogTable
              rows={driverDetails}
              params={params}
            />
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
export default ActivityLog;
