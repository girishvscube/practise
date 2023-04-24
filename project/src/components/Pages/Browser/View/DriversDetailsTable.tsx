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
import CustomButton from '../../../common/Button';
import axiosInstance from '../../../../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { showToastMessage } from '../../../../utils/helpers';

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

}));
const DriversDetailsTable = ({
  rows,
  params,
  driverId,
  driverNames,
  fetchDrivers
}: any) => {
  // const { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [assignDriver, setAssignDriver] = useState({
    driver_id: null,
  });
  const [param_s, setParam_s] = useState(params);
  const [assignId, setAssignId] = useState([] as any);
  const [button, setButton] = useState(false)

  const navigate = useNavigate();

  const handleClickOpen = (id) => {
    setAssignId(id);
    setOpen(true);
  };


  const handleFormChanges = (event: any) => {
    setAssignDriver({ ...assignDriver, driver_id: event.target.value });
  };

  const submitAssignForm = async () => {
    setButton(true)
    await axiosInstance
      .put(`/admin/bowser/view/assign-driver/${assignId}`, assignDriver)
      .then((response) => {
        showToastMessage(response.data.message, 'success');
        setOpen(false);
        fetchDrivers();
        setButton(false)
        // navigate(`/fleet_manage/bowser/view/driver-detail/${assignId}`);
      })
      .catch((error) => {
        showToastMessage(error.data.message, 'error');
        setButton(false)
      });
    return true;
  };

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
            <TableCell align="center">
              <span>Driver Name</span>
            </TableCell>
            <TableCell align="center">
              <span>Assign Date and Time</span>
            </TableCell>
            <TableCell align="center">
              <span>Reported Date and Time</span>
            </TableCell>
            <TableCell align="center">
              <span>Driving Status</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.length ?
              rows?.map((row: any, index: any) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    <p className={`${index === 0 ? 'text-white' : ''}`}>{row?.user?.name}</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className={`${index === 0 ? 'text-white' : ''}`}>
                      {row?.start_time === '' || row?.start_time === null ? '--' : moment((row?.start_time)).format('LT') !== 'Invalid date' && `${moment((row?.start_time)).format('LT'), moment((row?.start_time)).format('DD/MM/YYYY') !== 'Invalid date' && moment((row?.start_time)).format('DD/MM/YYYY')}`}
                    </p>
                  </TableCell>
                  <TableCell align="center">
                    <p className={`${index === 0 ? 'text-white' : ''}`}>
                      {row?.end_time === '' || row?.end_time === null ? '--' : moment((row?.end_time)).format('LT') !== 'Invalid date' && `${moment((row?.end_time)).format('LT'), moment((row?.end_time)).format('DD/MM/YYYY') !== 'Invalid date' && moment((row?.end_time)).format('DD/MM/YYYY')}`}
                    </p>
                  </TableCell>
                  <TableCell align="center">
                    {
                      index === 0 ? (rows?.status === 'unassigned' ? <p className={classes.statusUnassigned}>Unassigned</p> : <p className={classes.statusAssigned}>Assigned</p>) : '--'
                    }
                  </TableCell>
                  <TableCell align="center">
                    {
                      index === 0
                        ? (
                          <></>
                        )
                        : ''
                    }

                  </TableCell>
                </TableRow>
              )) :

              <TableRow>
                <TableCell align="center" colSpan={5}>
                  <p className='text-white text-base'>No associated driver in this bowser.</p>
                  <div className='mt-2'>
                    <CustomButton
                      borderRadius="1rem"
                      width="m-auto w-fit "
                      variant="outlined"
                      size="medium"
                      onClick={() => handleClickOpen(driverId)}
                      icon={(
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M4.76191 7.87109C2.51958 7.87109 0.604492 8.21001 0.604492 9.56801C0.604492 10.926 2.50791 11.2772 4.76191 11.2772C7.00483 11.2772 8.91933 10.9377 8.91933 9.58026C8.91933 8.22284 7.01649 7.87109 4.76191 7.87109Z" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M4.76273 5.9348C6.23448 5.9348 7.4274 4.74189 7.4274 3.27014C7.4274 1.79839 6.23448 0.605469 4.76273 0.605469C3.29157 0.605469 2.09865 1.79839 2.09865 3.27014C2.0934 4.73664 3.27757 5.92955 4.74465 5.9348H4.76273Z" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10.2018 4.05859V6.39776" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11.3966 5.22917H9.01074" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    >
                      Add New Driver
                    </CustomButton>
                  </div>
                </TableCell>
              </TableRow>

          }
      
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DriversDetailsTable;
