import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Status from '../../../common/Status';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Eye from '../../../../assets/images/Eye.svg';
import MultiUser from '../../../../assets/images/MultiUser.svg';
import { encryptData } from '../../../../utils/encryption';
import Assign from '../../../../assets/images/Assign.svg'
import { Tooltip } from '@mui/material';
interface BasicTableProps {
  cols: any
  data: any
  handleClick: any
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

let paddingX = '24px';
if (window.innerWidth < 1024) {
  paddingX = '10px';
}

const BasicTable = ({ cols, data, handleClick }: BasicTableProps) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleNavigate = (id: any) => {
    navigate(`/sales/leads/view/${encryptData(id)}`);
  };

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
            <TableRow sx={{ height: '16px', backgroundColor: '#151929', padding: '0px' }} className={classes.tr}>
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{item?.id}</TableCell>
              <TableCell align="center" sx={{ padding: '0px', fontSize: '0.8rem' }}>
                {moment(item?.created_at).format('LT')}
                ;
                <br />
                {moment(item?.created_at).format('YYYY/MM/DD')}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{item?.source}</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>
                {item?.company_name}
                <br />
                +91
                {item?.company_phone}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{item?.user ? item?.user?.name : '--'}</TableCell>
              <TableCell align="right">

                <div className="flex justify-center">
                  <Status>{item?.status}</Status>
                </div>

              </TableCell>
              <TableCell align="center">
                <div className="flex justify-center gap-1 md:gap-2 pr-2 lg:pr-0">
                  <Tooltip title="View">
                    <img
                      src={Eye}
                      alt="action"
                      onClick={() => {
                        handleNavigate(item.id);
                      }}
                      className="cursor-pointer"
                    />
                  </Tooltip>

                  {item?.assigned_to === null && item.is_reassign_req ? (
                    <>
                      <p className="text-textgray">|</p>
                      <Tooltip title="Reassign Lead">
                        <img
                          src={Assign}
                          alt=""
                          className="cursor-pointer"
                          onClick={() => {
                            handleClick(item, 'reassign');
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      {item?.assigned_to ? (
                        <>
                          <p className="text-textgray">|</p>
                          <Tooltip title="Reassign Lead Request">
                            <img
                              src={MultiUser}
                              alt=""
                              className="cursor-pointer"
                              onClick={() => {
                                handleClick(item, 'reassign_req');
                              }}
                            />
                          </Tooltip>
                        </>
                      ) :

                        !item.is_assigned ? (
                          <>
                            <p className="text-textgray">|</p>
                            <Tooltip title="Assign Ticket">
                              <img
                                src={Assign}
                                alt=""
                                className="cursor-pointer"
                                onClick={() => {
                                  handleClick(item, 'assign');
                                }}
                              />
                            </Tooltip>
                          </>
                        ) : ''
                      }
                    </>
                  )}
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


