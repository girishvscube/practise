import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../../../../utils/encryption';
import Edit from '../../../../assets/images/Edit.svg';
import PopUp from './Popup'
import { useState } from 'react';
interface BasicTableProps {
  cols: any
  data: any,
  handleClose: any,
  params: any,
  handleChange: any,
  errors: any,
  handleSubmit: any,
  handleDate: any,
  open: any
  handleAdd: any
}

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#FFFFFF',
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

const BasicTable = ({ cols, data, handleClose, params, handleChange, errors, handleSubmit, handleDate, open, handleAdd }: BasicTableProps) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleNavigate = (id: any) => {
    navigate(`/sales/leads/view/${encryptData(id)}`);
  };

  let paddingX = '24px';
  if (window.innerWidth < 1024) {
    paddingX = '10px';
  }





  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#404050', alignItems: 'center' }}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: 'none',
          },
          minWidth: 650,
          border: '1px solid #404050',
          borderCollapse: 'separate',
          borderSpacing: '0px 20px',
          px: paddingX,
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
            {cols.map((header: any) => (
              <TableCell align="center" sx={{ color: '#6A6A78' }}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
              <TableCell align="center" sx={{ padding: '0px' }}>
                {moment(item?.adjustment_date).format('YYYY/MM/DD')}
              </TableCell>
              <TableCell align="center" sx={{ padding: '0px' }}>
                {item?.type}
              </TableCell>
              <TableCell align="center">{item.supplier?.name || '--'}</TableCell>
              <TableCell align="center">

                {item?.amount.toString().startsWith('-') ? <div className='text-red-600'>- ₹{item?.amount.toString().substring(1)}</div> : <div className='text-limeGreen'>+ ₹ {item?.amount}</div>}

              </TableCell>
              <TableCell align="center">
                <div className='flex justify-center cursor-pointer'>
                  <img src={Edit} alt="" onClick={() => { handleAdd('update', item?.id, item) }} />
                </div>


              </TableCell>
            </TableRow>
          ))}


        </TableBody>
      </Table>
      <PopUp
        open={open}
        handleClose={handleClose}
        title="Adjust Cash In Hand"
        type="update"
        name=""
        params={params}
        handleChange={handleChange}
        errors={errors}
        handleSubmit={handleSubmit}
        handleDate={handleDate}
      />
    </TableContainer>
  );
};

export default BasicTable;
