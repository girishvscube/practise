import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Status from '../../../common/Status';
import Eye from '../../../../assets/images/Eye.svg';
import Tooltip from '@mui/material/Tooltip';

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

  tooltip: {
    padding: '8px',
    backgroundColor: '#fff',
  },

  // statusAll: {
  //   flex:
  // },
}));

const BasicTable = ({ cols, data }: BasicTableProps) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleAction = (id: any) => {
    navigate(`/fleet_manage/bowser/view/driver-detail/${id}`);
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
          {data.map((item: any, index: any) => (
            <TableRow key={item?.id} sx={{ height: '16px', backgroundColor: '#151929', padding: 0 }} className={classes.tr}>
              <TableCell align="center">
                {item?.id}
              </TableCell>
              <TableCell align="center">
                {item?.name}
              </TableCell>
              <TableCell align="center">
                {item?.driver === '' || item?.driver === null ? '--' : item?.driver?.name}
              </TableCell>
              <TableCell align="center">
                {item?.fuel_capacity}
              </TableCell>
              <TableCell align="center">
                {item?.last_trip_id === '' || item?.last_trip_id === null ? '--' : item?.last_trip_id}
              </TableCell>
              <TableCell align="center">
                {item?.fuel_left}
              </TableCell>
              <TableCell align="left">
                <div className="flex justify-center">
                  <Status>{item?.status}</Status>
                </div>
              </TableCell>
              <TableCell align="center">
                <div className="flex justify-center">
                  <Tooltip title="View">
                    <img
                      src={Eye}
                      alt="eye"
                      onClick={() => {
                        handleAction(item.id);
                      }}
                      className="cursor-pointer"
                    />
                  </Tooltip>
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
