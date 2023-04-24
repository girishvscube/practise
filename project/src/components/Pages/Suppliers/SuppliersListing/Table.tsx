import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { ToolTip } from './ToolTip';
import Eye from '../../../../assets/images/Eye.svg';
import { encryptData } from '../../../../utils/encryption';
import { Tooltip } from '@mui/material';

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

const BasicTable = ({ cols, data }: BasicTableProps) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleNavigate = (id: any) => {
    navigate(`/suppliers/view/${encryptData(id)}`);
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
          '& .css-zvlqj6-MuiTableCell-root': {
            padding: 0,
          },
        }}
        className={classes.root}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            {cols.map((header: any) => (
              <TableCell align="center" sx={{ color: '#6A6A78', padding: '0px', fontSize: '0.8rem' }}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow
              sx={{ height: '16px', backgroundColor: '#151929' }}
              className={classes.tr}
            >
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{item?.id}</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{item?.name}</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>
                <div className="flex items-center justify-center">
                  <div>{item?.state}</div>
                  <div>
                    <ToolTip value={item} />
                  </div>
                </div>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>
                {item?.email}
                <br />
                +91
                {' '}
                {item?.phone}
              </TableCell>
              <TableCell align="center">
                <div className="flex justify-center gap-2">
                  <Tooltip title="View">
                    <img
                      src={Eye}
                      alt="eye"
                      onClick={() => {
                        handleNavigate(item.id);
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
