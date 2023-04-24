import { useState, useEffect, useMemo } from 'react';
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
import Popup from './Popup';
import CustomButton from '../../../common/Button';
import { fetchBrowsersList, fetchBrowser } from '../../../../features/browser/browserSlice';
import axiosInstance from '../../../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#FFFFFF',
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
}));
const NoDriversTable = ({
  rows,
  params,
}: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [assignDriver, setAssignDriver] = useState({
    status: 'Assigned',
    assigned_to: '',
  });
  const [errors, setErrors] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [driverList, setDriverList] = useState([]);

  const initalStates = {
    searchText: '',
    status: '',
    driver: '',
  };

  const handleClickOpen = (id: any) => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  // assign driver popup form
  const handleFormChanges = (event: any) => {
    setAssignDriver({ ...assignDriver, [event.target.name]: event.target.value });
  };

  const submitAssignForm = async () => {
    await axiosInstance
      .put(`/admin/bowser/view/assign-driver/${id}`, assignDriver)
      .then((response) => {
        showToastMessage(response.data.message, 'success');
        // dispatch(fetchBrowsersList(assignId));
        navigate(`/fleet_manage/bowser/view/driver-detail/${id}`);
        setOpen(false);
      })
      .catch((error) => {
        showToastMessage(error.data.message, 'error');
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

  useMemo(() => {
    dispatch(fetchBrowsersList(currentPage, initalStates.driver, initalStates.status, initalStates.searchText));
  }, [currentPage]);

  const noDriversList = [{ id: 1, name: 'No Drivers Found..' }];

  const getDrivers = async () => {
    await axiosInstance('/admin/users/dropdown?module=fleet_management')
      .then((response) => {
        setDriverList(response?.data?.data)
      })
      .catch(() => {
        // console.log(error);
      })
  }
  
  useEffect(()=>{
    getDrivers();
  },[])
  
  return (
    <TableContainer component={Paper}>
      <Table
        aria-label="simple table"
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: '1px solid #404050',
          },
          minWidth: 650,
          //   border: '1px solid #404050',
          borderCollapse: 'separate',
          background: '#151929',
          borderRadius: '8px',
          '& .css-zvlqj6-MuiTableCell-root': {
            padding: 0,
          },
        }}
        className={classes.root}
      >
        <TableHead>
          <TableRow>
            <div className="flex flex-col justify-center items-center m-5">
              <p className="font-nunitoRegular my-3 text-white">No associated driver in this bowser.</p>
              <CustomButton
                borderRadius="1rem"
                width="m-auto w-fit "
                variant="outlined"
                size="medium"
                onClick={handleClickOpen}
                icon={(
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.76191 7.87109C2.51958 7.87109 0.604492 8.21001 0.604492 9.56801C0.604492 10.926 2.50791 11.2772 4.76191 11.2772C7.00483 11.2772 8.91933 10.9377 8.91933 9.58026C8.91933 8.22284 7.01649 7.87109 4.76191 7.87109Z" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.76273 5.9348C6.23448 5.9348 7.4274 4.74189 7.4274 3.27014C7.4274 1.79839 6.23448 0.605469 4.76273 0.605469C3.29157 0.605469 2.09865 1.79839 2.09865 3.27014C2.0934 4.73664 3.27757 5.92955 4.74465 5.9348H4.76273Z" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.2018 4.05859V6.39776" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.3966 5.22917H9.01074" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                      )}
              >
                Add Driver
              </CustomButton>
              <Popup
                open={open}
                handleClose={handleClose}
                title="Assign Driver"
                type="assign"
                name="drivers"
                roles={ driverList.length ? driverList: noDriversList }
                params={initalStates}
                setParams={handleFormChanges}
                submit={submitAssignForm}
              />
            </div>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
};
export default NoDriversTable;
{ /* <p className="">No associated driver in this bowser.</p> */ }
