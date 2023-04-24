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
import { useState } from 'react';
import PopUp from './Popup'
interface BasicTableProps {
  cols: any
  data: any
  accountsDropdown: any,
  categoryDropdown: any,
  handleClose: any
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

const BasicTable = ({ cols, data, accountsDropdown, categoryDropdown, handleClose }: BasicTableProps) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const [expenseId, setExpenseId] = useState()

  const handleNavigate = (id: any) => {
    navigate(`/sales/leads/view/${encryptData(id)}`);
  };


  const handleEdit = (id: any) => {
    setOpen(true)
    setExpenseId(id)
  }

  const [open, setOpen] = useState(false)

  const handleClosePopUp = () => {
    setOpen(false)
    handleClose();
  }

  let paddingX = '24px';
  let paddingAction = 0;
  if (window.innerWidth < 1024) {
    paddingX = '10px';
    paddingAction = 8;
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
              <TableCell align="center">{item?.id}</TableCell>
              <TableCell align="center" sx={{ padding: '0px' }}>
                {moment(item?.date_of_expense).format('YYYY/MM/DD')}
              </TableCell>
              <TableCell align="center">{item?.expense_type}</TableCell>
              <TableCell align="center">
                {item?.expense_catergory?.name || '--'}
              </TableCell>
              <TableCell align="center">{item?.item_name}</TableCell>
              <TableCell align="center">{item?.payee}</TableCell>
              <TableCell align="center">{item?.bank_account?.account_name}</TableCell>
              <TableCell align="right">

                <div className="flex justify-center">
                  {/* <Status> </Status> */}
                  ₹ {item?.amount}

                </div>

              </TableCell>
              <TableCell align="center" sx={{ paddingRight: paddingAction }}>
                <div className="flex justify-center  gap-1">
                  <div>
                    {
                      item?.reference_img ? <a href={item?.reference_img} download={item?.reference_img}><img src={PaperDownload} alt="" /></a> : null
                    }

                  </div>

                  {
                    item?.reference_img ? <p className="text-textgray">|</p> : null
                  }

                  <img src={Edit} alt="" onClick={() => { handleEdit(item?.id) }} className="cursor-pointer" />
                </div>

              </TableCell>

            </TableRow>
          ))}
        </TableBody>

        <div>
          <PopUp
            open={open}
            handleClose={handleClosePopUp}
            title="Record Expense"
            type="Edit"
            name=""
            accountsDropdown={accountsDropdown}
            categoryExpense={categoryDropdown}
            expenseId={expenseId}
          />
        </div>
      </Table>

    </TableContainer>
  );
};

export default BasicTable;



