import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { Input } from '../../../common/input/Input';
import moment from 'moment';

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
const UserTable = ({
  rows,
  inputAmountChange,
  check
}: any) => {
  const classes = useStyles();
  console.log(rows, 'rows')
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
            <TableCell align="center">
              <span>Date</span>
            </TableCell>
            <TableCell align="center">
              <span>Purchase Bills</span>
            </TableCell>
            <TableCell align="center">
              <span>Bill Amount</span>
            </TableCell>
            <TableCell align="center">
              <span>Amount Due</span>
            </TableCell>
            <TableCell align="center">
              <span>Payment</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length > 0
            && rows?.map((row: any) => (
              <TableRow key={row?.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  <div className="flex justify-center gap-6">
                    <p>
                      {moment(row?.created_at).format('YYYY/MM/DD')}
                    </p>
                  </div>

                </TableCell>

                <TableCell align="center">{row?.id}</TableCell>
                <TableCell align="center">₹ {(row?.total_amount)}</TableCell>
                <TableCell align="center">
                  ₹ {(row?.balance).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-center">
                    <Input
                      rows={1}
                      width="w-1/2"
                      disabled={false}
                      readOnly={check ? true : false}
                      value={row.amount}
                      handleChange={(event) => { inputAmountChange(event, row?.id) }}
                      label="Amount Paid"
                      name="name"
                    />
                  </div>

                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

    </TableContainer>
  );
};
export default UserTable;


//round off in js?