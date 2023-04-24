import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
// import Edit from '../../../../assets/images/Edit.svg';
import InfoSquare from '../../../../assets/images/InfoSquare.svg';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

interface BasicTableProps {
  cols: any
  data: any,
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

  tooltip: {
    padding: '8px',
    backgroundColor: '#fff',
  },
}));

const BasicTable = ({ cols, data, handleClick }: BasicTableProps) => {
  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      // backgroundColor: '#6A6A78',
      color: '#fff',
      boxShadow: theme.shadows[2],
      fontSize: 14,
      background: '#404050',
      padding: '10px',
      lineHeight: '25px',
    },
  }));

  const navigate = useNavigate();
  const classes = useStyles();

  const handleAction = (id:any) => {
    navigate(`/fleet_manage/parking-station/edit/${id}`);
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
          borderSpacing: '0px 10px',
          px: '24px',
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
              <TableCell align="center" sx={{ color: '#6A6A78' ,fontSize:'0.8rem' }}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow sx={{ height: '16px', backgroundColor: '#151929' }} className={classes.tr}>
              <TableCell align="center" sx={{fontSize:'0.8rem' }}>
                {item?.station_name}
              </TableCell>
              <TableCell align="center" sx={{fontSize:'0.8rem' }}>
                <div className="flex flex-wrap">
                  <div className="m-auto">
                    {item?.city}
                  </div>
                  <LightTooltip
                    title={<p>Address: {`${item?.address}, ${item?.city}`}</p>}
                    placement="bottom"
                  >
                    <img src={InfoSquare} alt="" />
                  </LightTooltip>
                </div>
              </TableCell>
              <TableCell align="center" sx={{fontSize:'0.8rem' }}>
                {item?.capacity}
              </TableCell>
              <TableCell align="center" sx={{fontSize:'0.8rem' }}>
                {item?.is_active}
              </TableCell>
              <TableCell align="center" sx={{fontSize:'0.8rem' }}>
                {item?.is_active}
              </TableCell>
              <TableCell align="center">
                <div className="flex justify-center">
                  <Tooltip title="Edit">
                    <svg width="20" height="20" className="cursor-pointer" viewBox="0 0 20 20" onClick={() => handleAction(item.id)} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.748 18.4399H19.0006" stroke="#FE9705" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M10.78 1.79479C11.5557 0.867787 12.95 0.731856 13.8962 1.49173C13.9485 1.53296 15.6295 2.83879 15.6295 2.83879C16.669 3.46719 16.992 4.80311 16.3494 5.82259C16.3153 5.87718 6.81195 17.7645 6.81195 17.7645C6.49578 18.1589 6.01583 18.3918 5.50291 18.3973L1.86353 18.443L1.04353 14.9723C0.928662 14.4843 1.04353 13.9718 1.3597 13.5773L10.78 1.79479Z" stroke="#FE9705" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.02148 4L14.4737 8.18713" stroke="#FE9705" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
