import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

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
const PaymentTable = ({ rows }: any) => {
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
          {rows?.length > 0
                        && rows?.map((row: any) => (
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

                            <TableCell align="center">{row?.poc_name}</TableCell>
                            <TableCell align="center">{row?.designation}</TableCell>
                            <TableCell align="center">
                              {row?.phone}
                              <span>
                                <br />
                              </span>
                              {row?.email}
                            </TableCell>
                            <TableCell align="center" />
                            <TableCell align="center" />
                            <TableCell align="center">
                              <div className="flex justify-center gap-2">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                            // onClick={() => {
                                            //     handleNavigate(item.id)
                                            // }}
                                  className="cursor-pointer"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.1609 12.0532C15.1609 13.7992 13.7449 15.2142 11.9989 15.2142C10.2529 15.2142 8.83789 13.7992 8.83789 12.0532C8.83789 10.3062 10.2529 8.89124 1--1.9989 8.89124C13.7449 8.89124 15.1609 10.3062 15.1609 12.0532Z"
                                    stroke="#3AC430"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11.998 19.355C15.806 19.355 19.289 16.617 21.25 12.053C19.289 7.48898 15.806 4.75098 11.998 4.75098H12.002C8.194 4.75098 4.711 7.48898 2.75 12.053C4.711 16.617 8.194 19.355 12.002 19.355H11.998Z"
                                    stroke="#3AC430"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default PaymentTable;
