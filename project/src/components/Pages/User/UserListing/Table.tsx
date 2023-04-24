import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toggle from '../../../common/input/Toggle';
import { makeStyles } from '@mui/styles';
import Status from '../../../common/Status';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../../../../utils/encryption';

interface BasicTableProps {
  cols: any
  data: any
  toggleChange: any
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

const BasicTable = ({ cols, data, toggleChange }: BasicTableProps) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const handleNavigate = (id: any) => {
    navigate(`/users/view/${encryptData(id)}`);
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
              <TableCell align="center" sx={{ color: '#6A6A78', fontSize: '0.8rem' }}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow sx={{ height: '16px', backgroundColor: '#151929', padding: 0 }} className={classes.tr}>
              <TableCell align="center" sx={{ padding: '0px', fontSize: '0.8rem' }}>{item.id}</TableCell>
              <TableCell align="center" sx={{ padding: '0px', fontSize: '0.8rem' }}>{item.name}</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>
                +91
                {' '}
                {item.phone}
              </TableCell>
              <TableCell align="center" sx={{ padding: '0px', fontSize: '0.8rem' }}>{item?.role?.name}</TableCell>
              <TableCell align="center" sx={{ padding: '0px', fontSize: '0.8rem' }}>
                <span>
                  <Toggle
                    name=""
                    defaultChecked={item?.is_active}
                    handleCheck={(e: any) => {
                      toggleChange(e, item);
                    }}
                  />
                </span>
              </TableCell>
              <TableCell align="right" sx={{ padding: '0px', fontSize: '0.8rem' }}>
                {item?.is_active ? (

                  <div className="flex justify-center">
                    <Status>Active</Status>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Status>Inactive</Status>
                  </div>
                )}
              </TableCell>
              <TableCell align="center" sx={{ padding: '0px', fontSize: '0.8rem' }}>
                <div className="flex justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      handleNavigate(item.id);
                    }}
                    className="cursor-pointer"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.1609 12.0532C15.1609 13.7992 13.7449 15.2142 11.9989 15.2142C10.2529 15.2142 8.83789 13.7992 8.83789 12.0532C8.83789 10.3062 10.2529 8.89124 11.9989 8.89124C13.7449 8.89124 15.1609 10.3062 15.1609 12.0532Z"
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

export default BasicTable;
