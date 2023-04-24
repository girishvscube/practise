import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import CustomCheckbox from '../../../common/input/Checkbox';
import InfoSquare from '../../../../assets/images/InfoSquare.svg';
import { useEffect, useState } from 'react';
import ScheduleOrders from './ScheduleOrders';
import axiosInstance from '../../../../utils/axios';

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#ffffff',
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

  statusAssigned: {
    color: '#3AC430',
  },
  statusUnassigned: {
    color: '#EF4949',
  },

}));
const OrdersTable = ({ type, orders, trip, onChange, tripResp }: any) => {
  const classes = useStyles();
  const [selectedOrders, setSelectedOrders] = useState([] as any)


  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(21, 25, 41, 1)',
      boxShadow: theme.shadows[1],
      fontSize: 14,
      background: '#ffffff',
    },
  }));

  useEffect(() => {
    if (tripResp && tripResp.schedule_trip && tripResp.schedule_trip.orders) {
      let orders = tripResp.schedule_trip.orders.map(x => {
        x.id = x.id || x.order_id
        // console.log(x, 'xxxxxxx')
        return x
      })
      setSelectedOrders(orders)
    }
  }, [tripResp])

 

  const handleCheckbox = (e, item: any) => {
    onChange(item.id)
    let list: any = [...selectedOrders]
    if (e.target.checked) {
      item['schedule_time'] = null
      console.log(item, 'item')
      list.push(item)
    } else {
      let index = list.findIndex((x: any) => x.id === item.id);
      if (index != -1) {
        list.splice(index, 1)
      }
    }
    setSelectedOrders(list)
  };
  const onSehudleTimeChange = (e, id) => {
    let list: any = [...selectedOrders]
    let index = list.findIndex((x: any) => x.id === id);
    if (index != -1) {
      list[index]['schedule_time'] = moment(new Date(e)).format('YYYY-MM-DD HH:mm:ss')
    }
    // console.log(list)
    setSelectedOrders(list)
  }

  // console.log(orders, 'nmnmnm')

  return (
    <>
      <TableContainer component={Paper}
        sx={{
          maxHeight: 430,
          "&::-webkit-scrollbar": {
            width: 8,
            position: 'absolute',
            top: 0,
            right: 10,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#151929",
            position: 'relative',
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#262938",
            borderRadius: 2,
          }
        }}
      >
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
                <span>Select</span>
              </TableCell>
              <TableCell align="center">
                <span>Order ID</span>
              </TableCell>
              <TableCell align="center">
                <span>Ordered Date</span>
              </TableCell>
              <TableCell align="center">
                <span>Order type</span>
              </TableCell>
              <TableCell align="center">
                <span>Fuel Quantity</span>
              </TableCell>
              <TableCell align="center">
                <span>Delivery Date</span>
              </TableCell>
              <TableCell align="center">
                <span>Delivery Time Slot</span>
              </TableCell>
              <TableCell align="center">
                <span>Delivery Location</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              orders.length > 0 ?
                orders?.map((item: any, index: any) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">
                      <span>
                        <CustomCheckbox
                          handleCheck={(e) => handleCheckbox(e, item)}
                          ischecked={item.checked}
                          color="text-yellow"
                          name={item}
                          Label=""
                        />
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span>{item?.id}</span>
                    </TableCell>
                    <TableCell align="center">
                      <span>{moment(item?.created_at).format('YYYY/MM/DD')}</span>
                    </TableCell>
                    <TableCell align="center">
                      <span>{item?.order_type}</span>
                    </TableCell>
                    <TableCell align="center">
                      <span>{item?.fuel_qty}</span>
                    </TableCell>
                    <TableCell align="center">
                      <span>{moment(item?.delivery_date).format('DD/MM/YYYY')}</span>
                    </TableCell>
                    <TableCell align="center">
                      <span>
                        {item?.time_slot || ''}
                      </span>
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <div className="flex justify-center">
                        <span className="my-auto">{item?.customer_delivery_details?.city}</span>
                        <div className="m-1">
                          <LightTooltip title={
                            `city: ${item?.customer_delivery_details?.city},
                            state: ${item?.customer_delivery_details?.state},
                            zipcode: ${item?.customer_delivery_details?.zipcode},`
                          } placement="bottom">
                            <img src={InfoSquare} alt="" />
                          </LightTooltip>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )) :

                <TableRow>
                  <TableCell align="center" colSpan={7}>
                    No Orders found !!
                  </TableCell>
                </TableRow>

            }
          </TableBody>
        </Table>
      </TableContainer>
      <div className="h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mb-[5px]">
        <p className="text-[18px] font-bold font-nunitoRegular">Schedule Orders</p>
      </div>

      <ScheduleOrders type={type} selectedItems={selectedOrders} trip={trip} timeChange={onSehudleTimeChange} />
    </>
  );
};
export default OrdersTable;