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
import Eye from '../../../../assets/images/Eye.svg';
import SendMail from '../../../../assets/images/SendMail.svg';
import { useState } from 'react';
import PopUp from './Popup';
import Status from '../../../../components/common/Status';
import { Tooltip } from '@mui/material';
import axiosInstance from '../../../../utils/axios';
import { printBill } from '../Invoices/PrintInvoice';
import { showToastMessage } from '../../../../utils/helpers';
import Validator from 'validatorjs';
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


const initialValues = {
  to: "",
  cc: "",
  subject: "",
  message: ""
}

const BasicTable = ({ cols, data }: BasicTableProps) => {

  const [openMail, setOpenMail] = useState(false);
  const [invoiceId, setInvoiceId] = useState()

  const [params, setParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)
  const [buttonDisable, setButtonDisable] = useState(false)
  const classes = useStyles();

  let paddingX = '24px';
  let paddingAction = 0;
  if (window.innerWidth < 1024) {
    paddingX = '10px';
    paddingAction = 4;
  }
  const handleSubmit = () => {
    const validation = new Validator(params, {
      to: 'required',
      subject: 'required',
      message: 'required'
    });

    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });

      setErrors(fieldErrors);
      showToastMessage('Please Check all the fields', 'error')
      return false;
    }

    setButtonDisable(true)

    axiosInstance.post(`/admin/purchase-bill/send/${invoiceId}`, params).then((res) => {
      showToastMessage(res?.data?.data?.message, 'success')
      console.log(res?.data?.data?.message)
      setOpenMail(false)
      setButtonDisable(false)
      setParams(initialValues)
    }).catch((err) => {
      showToastMessage(err?.data?.message, 'error')
      setButtonDisable(false)
    })
  };




  const handleOpenMail = (id: any) => {
    fetchMails(id);
    setInvoiceId(id);
    setOpenMail(true);
  };

  const fetchMails = (id: any) => {
    axiosInstance.get(`/admin/purchase-bill/mail/all/${id}`).then((res) => {
      console.log(res?.data?.data?.primary_email)
      setParams({ ...params, to: res?.data?.data?.primary_email })
    }).catch(() => {
      showToastMessage('No mails Found', 'error')
    })
  }

  const handleChange = (e: any) => {
    setErrors(initialValues)
    setParams({ ...params, [e.target.name]: e.target.value })
  }

  const viewInvoice = (id: any) => {
    axiosInstance.get(`/admin/purchase-bill/download/${id}`).then((res) => {
      const content = res?.data?.data?.base64String;
      printBill(content)
    }).catch(() => {
      showToastMessage('something wrong please try again', 'error')
    })


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
              <TableCell align="center"> {moment(item?.purchase_date).format('YYYY/MM/DD')}</TableCell>
              <TableCell align="center">
                {item?.supplier?.name}

              </TableCell>
              <TableCell align="center"> <p className="text-limeGreen"> ₹ {(item?.total_amount).toFixed(2)}</p></TableCell>
              <TableCell align="center">
                {' '}
                ₹ {(item?.total_amount - item?.balance).toFixed(2)}
              </TableCell>
              <TableCell align="center"> ₹ {item?.balance}</TableCell>
              <TableCell align="center">
                <div className='flex justify-center'><Status>{item?.payment_status}</Status></div>
              </TableCell>
              <TableCell align="center" sx={{ paddingRight: paddingAction }}>
                <div className="flex justify-center gap-1">
                  <Tooltip title="View Invoice">
                    <img src={Eye} alt="" className="cursor-pointer" onClick={() => { viewInvoice(item?.id) }} />
                  </Tooltip>
                  <p className="text-textgray">|</p>
                  <Tooltip title="Send Mail">
                    <img src={SendMail} alt="" onClick={() => { handleOpenMail(item?.id) }} className="cursor-pointer" />
                  </Tooltip>
                </div>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PopUp
        open={openMail}
        handleClose={() => { setOpenMail(false); }}
        title="Send Invoice to Customer"
        type="create"
        name="mail"
        submit={handleSubmit}
        params={params}
        error={errors}
        handleChange={handleChange}
        disabled={buttonDisable}
        invoiceId={invoiceId}
      />
    </TableContainer>
  );
};

export default BasicTable;
