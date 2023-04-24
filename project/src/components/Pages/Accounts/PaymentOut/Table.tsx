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
import PaperDownload from '../../../../assets/images/PaperDownload.svg';

interface BasicTableProps {
  cols: any
  data: any
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

const BasicTable = ({ cols, data, }: BasicTableProps) => {
  const navigate = useNavigate();
  const classes = useStyles();

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

                {item?.id}
              </TableCell>
              <TableCell align="center" sx={{ padding: '0px' }}>
                {moment(item?.payout_date).format('YYYY/MM/DD')}
              </TableCell>
              <TableCell align="center">{item?.supplier?.name}</TableCell>
              <TableCell align="center">
                <p className="text-limeGreen">{item?.no_of_invoices}</p>
              </TableCell>
              <TableCell align="center">{item?.supplier?.account_name || '--'}</TableCell>
              <TableCell align="center">{item?.notes || 'NA'}</TableCell>
              <TableCell align="center">₹{' '}{(item?.amount).toFixed(2)}</TableCell>
              <TableCell align="center">
                <div className="flex justify-center  gap-1">
                  <img src={PaperDownload} alt="" />
                  <p className="text-textgray">|</p>
                  <img className='cursor-pointer' src={Edit} alt="" onClick={() => { navigate(`/accounts/edit/payments-out/${encryptData(item?.id)}`) }} />
                </div>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
