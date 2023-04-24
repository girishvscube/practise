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
import CustomButton from '../../../../../common/Button';
import Status from '../../../../../common/Status';
import InfoSquare from '../../../../../../assets/images/InfoSquare.svg';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { odometerDetails } from '../../../../../../features/browser/browserSlice';
import { electron } from 'webpack';
import PopUp from './OdometerModal'
import axiosInstance from '../../../../../../utils/axios';

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#FFFFFF',
    },
    '& th ': {
      color: '#6A6A78',
      lineHeight: '1.3rem',
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
const DashboardTable = ({
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
  const { odometer, odo_details } = useSelector((state: any) => state.browser);
  const [data, setdata] = useState([] as any);
  const [open, setOpen] = useState(false)
  const [odo, setOdo] = useState([] as any)
  const [loading, setLoading] = useState(false)

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


  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = (id: any) => {
    setOpen(true)
    fetchOdometer(id);
  }

  const fetchOdometer = (id: any) => {
    setLoading(true)
    axiosInstance.get(`/admin/bowser/trip/odometer/details/${id}`).then((res) => {
      setOdo(res?.data?.data)
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }


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
            <TableCell align="center">
              <span>Trip No</span>
            </TableCell>
            <TableCell align="center">
              <span>Trip Start Time</span>
            </TableCell>
            <TableCell align="center">
              <span>Trip End Time</span>
            </TableCell>
            <TableCell align="center">
              <span>No of SO/PO Linked</span>
            </TableCell>
            <TableCell align="center">
              <span>Distance Travelled</span>
            </TableCell>
            <TableCell align="center">
              <span>Assigned Driver</span>
            </TableCell>
            <TableCell align="center">
              <span>Fuel Left Over</span>
            </TableCell>
            <TableCell align="center">
              <span>Trip Status</span>
            </TableCell>
            <TableCell align="center">
              <span>Odometer</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows?.length > 0 ? <>
              {rows.length > 0
                && rows?.map((row: any) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">
                      <p>{row?.id}</p>
                    </TableCell>
                    <TableCell align="center">
                      <p>
                        {row?.start_time === '' || row?.start_time === null ? '--' : moment((row?.start_time)).format('hh:mm') !== 'Invalid date' && moment((row?.start_time)).format('hh:mm')}
                      </p>
                    </TableCell>
                    <TableCell align="center">
                      <p>
                        {row?.end_time === '' || row?.end_time === null ? '--' : moment((row?.end_time)).format('hh:mm') !== 'Invalid date' && moment((row?.end_time)).format('hh:mm')}
                      </p>
                    </TableCell>
                    <TableCell align="center">{row?.purchase_order?.no_of_order_linked}</TableCell>
                    <TableCell align="center">{row?.distance_travelled}</TableCell>
                    <TableCell align="center">{row?.driver === '' || row?.driver === null ? '--' : row?.driver}</TableCell>
                    <TableCell align="center">{row?.fuel_left_at_end === '' || row?.fuel_left_at_end === null ? '--' : row?.fuel_left_at_end}</TableCell>
                    <TableCell align="center">
                      {
                        row?.status === 'IN_TRANSIT' ? <p style={{ color: '#FE9705' }}>{row?.status}</p> :
                          row?.status === 'NOT_SCHEDULED' ? <p style={{ color: '#0085FF' }}>{row?.status}</p> :
                            row?.status === 'SCHEDULED' ? <p style={{ color: '#FEE505' }}>{row?.status}</p> :
                              row?.status === 'TRIP_COMPLETED' ? <p style={{ color: '#3AC430' }}>{row?.status}</p> : '--'
                      }
                    </TableCell>
                    <TableCell align="center">
                      <div className='flex justify-center'>
                        <LightTooltip title="view"

                          placement="bottom"
                        >
                          <img src={InfoSquare} alt="" onClick={() => { handleClickOpen(row?.id) }} className="cursor-pointer" />
                        </LightTooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

            </> : <div className='text-white text-center'>No data found!!</div>
          }
        </TableBody>
      </Table>

      <PopUp open={open} handleClose={handleClose} data={odo} loading={loading} />
    </TableContainer>
  );
};
export default DashboardTable;



