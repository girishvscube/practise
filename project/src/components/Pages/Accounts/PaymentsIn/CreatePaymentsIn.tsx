import { SelectInput } from '../../../common/input/Select';

import CustomCheckbox from '../../../common/input/Checkbox';
import TextArea from '../../../common/input/TextArea';
import Table from './CreateTable';
import CustomButton from '../../../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import { fetchPaymentTypeDropdown, getCustomersDropdown } from '../../../../features/dropdowns/dropdownSlice';
import axiosInstance from '../../../../utils/axios';
import { showToastMessage } from '../../../../components/Pages/Settings/BankAccounts/Toast';
import { useNavigate } from 'react-router-dom';
import Validator from 'validatorjs';
import CommonDatepicker from '../../../../components/common/input/Datepicker';
import moment from 'moment';
import { fetchaccountsDropdown } from '../../../../features/dropdowns/dropdownSlice';
import { CircularProgress } from '@mui/material';

const initialValues = {
  customer_id: '',
  bank_account_id: '',
  pay_in_date: '',
  notes: "",
  invoices: []


}
const cols = [
  {
    title: 'Pay-in No',
  },
  {
    title: 'Pay-in Date',
  },
  {
    title: 'Customer Name',
  },
  {
    title: 'Invoice No',
  },
  {
    title: 'Payment Type',
  },
  {
    title: 'Notes',
  },
  {
    title: 'Amount Received',
  },
  {
    title: 'Action',
  },
];

const CreatePaymentsIn = () => {
  const { paymentType, customersdropdown, accountsDropdown } = useSelector((state: any) => state.dropdown);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalBalance, setTotalBalance] = useState(0)
  const [invoices, setInvoice] = useState([] as any)
  const [errors, setErrors] = useState(initialValues)
  const [params, setParams] = useState(initialValues as any)
  const [check, setCheck] = useState(false)
  const [loading, setLoading] = useState(false)



  const handleChange = (event: any) => {
    if (event.target.name === "customer_id") {
      setParams({ ...params, [event.target.name]: event.target.value })
      fetchInvoiceList(event.target.value)
    }
    setErrors(initialValues)
    if (event.target.name === "amount") {
      setParams({ ...params, [event.target.name]: Number(event.target.value) })
    }
    else {
      setParams({ ...params, [event.target.name]: event.target.value })
    }

  };



  const handleFillAmountOncheckbox = (event) => {
    setCheck(event.target.checked)

    if (event.target.checked === true) {
      let list = [...invoices];
      list = list.map(x => {
        x['amount'] = x.balance;
        return x
      })
      setInvoice(list)
      Total(list, "check")
    }
    else {
      setParams({ ...params, amount: 0 })
      let list = [...invoices];
      list = list.map(x => {
        x['amount'] = 0;
        return x
      })
      setInvoice(list)
    }
  }



  const handleSubmit = () => {

    const rules = {
      customer_id: 'required',
      bank_account_id: 'required',
      pay_in_date: 'required',
    };



    let list = invoices.map((data) => {
      const invoiceData = {
        id: data.id,
        amount: Number(data.amount)
      }
      return invoiceData;
    })
    params.invoices = list

    const validation = new Validator(params, rules)
    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })
      setErrors(fieldErrors)
      return false
    }
    setLoading(true)
    axiosInstance.post('/admin/pay-in', params).then(() => {
      setParams(initialValues)
      showToastMessage('Successfully Created', 'success')
      navigate('/accounts/payments-in')
    }).catch((err) => {
      setLoading(false)

    })
  }

  const inputAmountChange = (event: any, id: any) => {
    let list = [...invoices]
    let index = list.findIndex(x => x.id === id)
    if (index != -1) {
      list[index]['amount'] = event.target.value

    }
    setInvoice(list)
    Total(list, "type")
  }


  useMemo(() => {
    dispatch(fetchPaymentTypeDropdown());
    dispatch(getCustomersDropdown());
    dispatch(fetchaccountsDropdown())

  }, []);


  const handleDate = (date) => {
    setParams({ ...params, pay_in_date: moment(date).format('YYYY-MM-DD') })

  }


  const fetchInvoiceList = (id: any) => {
    setLoading(true)
    axiosInstance.get(`/admin/pay-in/customers/pending-invoices/${id}`)
      .then((res) => {
        setLoading(false)
        let list = res?.data?.data
        list = list.map(x => {
          x['amount'] = ''
          return x
        })
        setInvoice(list)
      }).catch(() => {
        setLoading(false)
      })
  }
  const Total = (list, string) => {
    if (string === 'check') {
      const total: any = list.reduce((prev, current) => {
        return Number(prev) + Number(current.balance);
      }, 0);
      setParams({ ...params, amount: total })
    }
    else {
      const total: any = list.reduce((prev, current) => {
        return Number(prev) + Number(current.amount);
      }, 0);
      setTotalBalance(total)
    }


  }

  return (
    <div className="user-section">
      <p className="text-xl font-extrabold text-white font-nunitoRegular">Record Pay in</p>
      <div className="mt-6 mobileView bg-lightbg">
        <div className="bg-darkbg p-2 rounded-lg h-[56px]">
          <p className="subheading">Payments In Details</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-6">
          <div className="flex flex-col gap-6">
            <SelectInput
              width="100%"
              options={customersdropdown}
              handleChange={handleChange}
              value={params.customer_id}
              label="Select Customer"
              name="customer_id"
              error={errors.customer_id ? true : false}
              helperText={errors.customer_id}

            />
            <CommonDatepicker label="Pay In Date" value={params?.pay_in_date ? moment(params?.pay_in_date).format('YYYY-MM-DD') : null} onChange={handleDate} />
            {errors.pay_in_date ? <p className='text-red-600 text-xs'>{errors.pay_in_date}</p> : ''}

            <div className="flex gap-2">
              <CustomCheckbox
                handleCheck={handleFillAmountOncheckbox}
                Label=""
                ischecked={check}
                name="check_box"
                color="text-yellow"
              />
              <p>Received Full amount(₹ {params?.amount || 0})</p>
            </div>

          </div>
          <div className="flex flex-col gap-6">
            <SelectInput
              width="100%"
              options={accountsDropdown}
              handleChange={handleChange}
              value={params.bank_account_id}
              label="Select Account"
              name="bank_account_id"
              error={errors.bank_account_id ? true : false}
              helperText={errors.bank_account_id}
            />

            <TextArea
              placeholder="Enter notes here"
              id="123456"
              name="notes"
              rows={4}
              className="col-span-3"
              value={params?.notes}
              handleChange={handleChange}
            />
          </div>
        </div>

        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : <div >

            {
              invoices.length > 0 ? <div className="bg-darkbg p-2 rounded-lg h-[56px] mt-6">
                <p className="subheading">Unpaid Invoices</p>

              </div> : null
            }
            {
              invoices.length > 0 ? <div className="mt-6">
                <Table cols={cols} rows={invoices} inputAmountChange={inputAmountChange} check={check} />
              </div> :
                <div>
                  <div className="bg-darkbg p-2 rounded-lg h-[56px] mt-6"></div>
                  <p className="subheading"> <p className='text-center mt-6'>No Pending Invoices Found..</p></p>
                </div>
            }

            {
              invoices.length > 0 ? <p className="flex justify-center lg:justify-end mt-6 text-textgray">
                Total Invoice Amount Settled:
                <span className="text-white">
                  {' '}
                  {' '}
                  ₹ {totalBalance || params.amount}
                </span>
                {' '}

              </p> : null
            }


            <div className="w-full flex justify-center lg:justify-end mt-6 gap-4">
              <CustomButton
                onClick={() => { navigate(`/accounts/payments-in`) }}
                width="w-fit"
                variant="outlined"
                size="large"
                // icon={<img src={Profile} alt="" />}
                borderRadius="8px"
              >
                <p className="font-bold  font-nunitoRegular text-sm ">Cancel</p>
              </CustomButton>

              <CustomButton
                onClick={handleSubmit}
                width="w-fit"
                variant="contained"
                size="large"
                // icon={<img src={Profile} alt="" />}
                borderRadius="8px"
                disabled={loading ? true : false || invoices.length > 0 ? false : true}
              >
                <p className="font-bold  font-nunitoRegular text-sm ">Save</p>
              </CustomButton>
            </div>
          </div>
        }


      </div>
    </div>
  );
};

export default CreatePaymentsIn;






