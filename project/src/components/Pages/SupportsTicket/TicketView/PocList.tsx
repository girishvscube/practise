import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { DeletePoc } from '../../../../features/customer/pocSlice';
// import AddPocForm from '../../Customer/View/AddPocForm';
// import AddMorePoc from './AddMorePoc';
import { useEffect, useState } from 'react';
import {
  fetchPocByOrder,
} from '../../../../features/orders/orderSlice';

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
interface Props {
  orderId?: any
}
const PocList: React.FC<Props> = ({ orderId }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: any) => state.poc);
  const { pocListByOrder } = useSelector(
    (state: any) => state.order,
  );




  const classes = useStyles();



  useEffect(() => {
    dispatch(fetchPocByOrder(orderId));
  }, [orderId]);

  return (
    <div className="rounded-lg w-full bg-darkGray ">
      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            {pocListByOrder.length > 0 ? (
              <Table
                aria-label="simple table"
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: '1px solid #404050',
                  },
                  minWidth: 650,
                  //   border: '1px solid #404050',
                  borderCollapse: 'separate',
                  borderSpacing: '0',
                  // px: '24px',
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
                    {[
                      'Sl No.',
                      'POC Image',
                      'POC Name',
                      'Designation',
                      'Contact Details',
                    ].map((item) => (
                      <TableCell align="center">
                        <span className="text-xs text-textgray font-nunitoRegular">{item}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pocListByOrder.length > 0
                    && pocListByOrder?.map((item: any) => (
                      <TableRow
                        key={item?.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="center">{item?.id}</TableCell>

                        <TableCell align="center">
                          <div className="flex justify-center">
                            <img
                              src={
                                item?.image
                                || 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png'
                              }
                              alt="Poc img"
                              className="w-[48px] h-[48px]  rounded-full"
                            />
                          </div>
                        </TableCell>
                        <TableCell align="center">{item?.customer_poc?.poc_name}</TableCell>
                        <TableCell align="center">{item?.customer_poc?.designation}</TableCell>
                        <TableCell align="center">
                          {item?.customer_poc?.phone}
                          <span>
                            <br />
                          </span>
                          {item?.customer_poc?.email}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg w-full bg-darkGray p-8">
                <p className="text-xl font-nunitoRegular text-center text-white ">
                  No POCs Found !
                </p>
              </div>
            )}
          </TableContainer>
        </>
      )}

    </div>
  );
};

export default PocList;
