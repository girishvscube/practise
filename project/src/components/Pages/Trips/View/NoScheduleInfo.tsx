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
import CustomButton from '../../../common/Button';
import { fetchBrowsersList, fetchBrowser } from '../../../../features/browser/browserSlice';
import axiosInstance from '../../../../utils/axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { encryptData } from '../../../../utils/encryption';
import { useNavigate } from 'react-router-dom';

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
const NoScheduleInfo = ({ id }: any) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleClick = () => {
    navigate(`/fleet_manage/trips/schedule/${id}`);
  };

  return (
    <div className="w-full rounded flex flex-col gap-6">
      <div className="divstyles bg-lightbg ">
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
                  <p className="font-nunitoRegular my-2 text-white">Trip is Not Been Scheduled. Click on the button to Schedule now!</p>
                  <div className="m-3">
                    <CustomButton
                            onClick={handleClick}
                            width="w-fit"
                            variant="contained"
                            size="large"
                            icon={(
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.82524 1.84133H5.39058C4.00391 1.83599 2.86791 2.94066 2.83458 4.32733V11.4853C2.80458 12.8867 3.91658 14.0467 5.31724 14.0767C5.34191 14.0767 5.36658 14.0773 5.39058 14.0767H10.7159C12.1092 14.0273 13.2106 12.8793 13.2026 11.4853V5.35866L9.82524 1.84133Z" stroke="#151929" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.65039 1.8335V3.77283C9.65039 4.7195 10.4164 5.48683 11.3631 5.4895H13.1991" stroke="#151929" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.76107 6.60596V10.6333" stroke="#151929" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.32589 8.17644L7.76255 6.60645L6.19922 8.17644" stroke="#151929" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            )}
                            borderRadius='8px'
                            >
                            <p className="font-bold  font-nunitoRegular text-sm ">Schedule Trip</p>
                        </CustomButton>
                    </div>
                </div>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
export default NoScheduleInfo;
{ /* <p className="">No associated driver in this bowser.</p> */ }
