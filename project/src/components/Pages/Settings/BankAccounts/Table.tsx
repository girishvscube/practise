import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import PopUpForm from './PopUpForm';
import { useState } from 'react';
import Edit from '../../../../assets/images/Edit.svg'
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
const AccountsTable = ({
  rows,
  handleClose,
  title,
  type,
  name,
  params,
  handleChange,
  submit,
  errors,
  handleImage,
  removeImage,
  bankList,
  open,
  handleAdd,
  loading,
  handleDate
}: any) => {
  const classes = useStyles();

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
          // borderCollapse: 'separate',
          // borderSpacing: '0px ',
          //   px: '24px',
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
            <TableCell align="left">
              <span>Account</span>
            </TableCell>
            <TableCell align="left">
              <span>Balance</span>
            </TableCell>
            <TableCell align="right">
              <span>Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length > 0
            && rows?.map((row: any) => (
              <TableRow key={row?.account_name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left">
                  <div className="flex flex-col gap-1 font-nunitoRegular">
                    <p>{row?.account_name}</p>
                    <p>{row?.bank_name}</p>
                    <p className="text-textgray ">
                      A/C No:
                      {row?.account_number}
                    </p>
                    <p className="text-textgray ">
                      IFSC Code:
                      {row?.ifsc_code}
                    </p>
                  </div>

                </TableCell>

                <TableCell align="left">
                  <div className='text-limeGreen'>+ ₹ {' '}
                    {row?.opening_balance}</div>

                </TableCell>

                <TableCell align="right">

                  <div className="flex justify-end">

                    <img src={Edit} alt="" className='cursor-pointer' onClick={() => { handleAdd('update', row?.id, row) }} />

                  </div>

                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <PopUpForm
        open={open}
        handleClose={handleClose}
        title="Edit Bank Account"
        type="edit"
        name=""
        params={params}
        handleChange={handleChange}
        submit={submit}
        errors={errors}
        handleImage={handleImage}
        removeImage={removeImage}
        bankList={bankList}
        loading={loading}
        handleDate={handleDate}
      />
    </TableContainer>
  );
};
export default AccountsTable;
