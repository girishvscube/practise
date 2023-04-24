import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import Status from './Status';
import Eye from '../../../../../assets/images/Eye.svg';
import { Navigate, useNavigate } from 'react-router-dom';
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
const OrderTable = ({ rows }: any) => {

  const navigate = useNavigate();
  const cols = [
    {
      title: 'PO No',
    },
    {
      title: 'PO Created Date',
    },
    {
      title: 'Qty',
    },
    {
      title: 'PO Value',
    },
    {
      title: 'Payment Status',
    },
    {
      title: 'PO Status',
    },
    {
      title: 'Action',
    },
  ];
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
            {cols.map((col) => (
              <TableCell align="center">
                <span>{col?.title}</span>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length ?
            rows?.map((row: any) => (
              <TableRow
                key={row?.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">
                  <div className="flex justify-center gap-6">
                    <p>
                      {row?.id}
                      .
                    </p>
                  </div>
                </TableCell>

                <TableCell align="center">
                  {moment(row?.purchase_date).format('YYYY/MM/DD')}
                </TableCell>
                <TableCell align="center">
                  {row?.fuel_qty}
                  {' '}
                  L
                </TableCell>
                <TableCell align="center">
                  ₹
                  {row?.total_amount.toFixed(2)}
                </TableCell>
                <TableCell align="center">{row?.payment_status
                }</TableCell>
                <TableCell align="center">
                  <Status status={row?.status} />
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <img src={Eye} alt="eye" className="cursor-pointer" onClick={() => { navigate(`/purchase-orders/view/${row?.id}`) }} />
                  </div>
                </TableCell>
              </TableRow>
            )) :
            <TableRow>
              <TableCell align="center" colSpan={7}>
                No Results found !!
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default OrderTable;
