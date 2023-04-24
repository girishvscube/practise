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
// import AddPocForm from './AddPocForm';
// import { getPoc, DeletePoc, getCustomerPocList } from '../../../../features/customer/pocSlice';
import CustomButton from '../../../../../common/Button';

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
const DriversDetailsTable = ({
  rows,
  // handleClickOpen,
  // handleClose,
  // initialValues,
  params,
  setFormParams,
  formErrors,
  setFormErrors,
  customer_id,
}: any) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [PocId, setPocId] = useState();




  // const deletePoc = (id: any) => {
  //   dispatch(DeletePoc(id));
  //   dispatch(getCustomerPocList(customer_id));
  // };

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
            <TableCell align="center" />
            <TableCell align="center" />
            <TableCell align="center" />
            <TableCell align="center" />
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0
            && rows?.map((row: any) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DriversDetailsTable;
