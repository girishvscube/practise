import RadioButton from '../../../../../common/RadioButton';
import { useEffect, useState } from 'react';
import DeliveryTable from './Table';
import TextArea from '../../../../../common/input/TextArea';
import CustomButton from '../../../../../common/Button';
import Plus from '../../../../../../assets/icons/filledIcons/Plus.svg';
import axiosInstance from '../../../../../../utils/axios';
import { showToastMessage } from '../../../../../../components/Pages/Settings/BankAccounts/Toast';
import { CircularProgress } from '@mui/material';
import NotFound from '../../../../../../assets/images/NotFound.svg';
const initialValues = {
  name: 'Indirect',
  sub_category: ''
};
const Expense = () => {
  const [params, setParams] = useState(initialValues);
  const [loading, setLoading] = useState(false)
  const [expense, setexpense] = useState([])
  const [expenseId, setExpenseId] = useState()

  const [open, setOpen] = useState(false);
  const [button, setButton] = useState(false);

  const handleClickOpen = (id: any) => {
    setExpenseId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };


  const items = [
    {
      label: 'Direct Expense',
      value: 'Direct',
    },
    {
      label: 'Indirect Expense',
      value: 'Indirect',
    },
  ];


  useEffect(() => {
    fetchexpense();
  }, [params.name])

  const fetchexpense = () => {
    setLoading(true)
    axiosInstance.get(`/admin/settings/expense-category/${params.name}`)
      .then((res) => {
        setexpense(res?.data?.data)
        setLoading(false)
      })
  }

  const handleDelete = () => {
    setButton(true)
    axiosInstance.delete(`/admin/settings/expense-category/${expenseId}`).then((res) => {
      setButton(false)
      showToastMessage(res?.data?.data?.message, 'success')
      handleClose();
      fetchexpense();
    }).catch((err) => {
      setButton(false)
    })
  }
  const handleSubmit = () => {
    axiosInstance.post('/admin/settings/expense-category/', params).then(() => {
      showToastMessage('Successfully Created', 'success')
      setParams(initialValues)
      fetchexpense();
    })
  };

  const handleRadioInputs = (event: any) => {
    setParams({ ...params, name: event.target.value })
  }
  return (
    <div className="p-6">
      <div className="flex flex-col">
        <p className="subheading">Expense Messages</p>
        <p className="text-xs font-nunitoRegular">Add/Remove to the List of Expense Messages</p>
      </div>

      <div className="mt-6">
        <RadioButton items={items} onChange={handleRadioInputs} row defaultValue={params?.name} />
      </div>

      <div className="grid grid-cols-[minmax(700px,_1fr),12rem] gap-6 mt-5">
        <TextArea
          placeholder="Sub Category"
          id="123456"
          name="sub_category"
          rows={5}
          className="col-span-3"
          handleChange={handleChange}
          value={params.sub_category}

        />

        <div className="pt-28 w-full">
          <CustomButton
            onClick={handleSubmit}
            width="w-fit"
            variant="outlined"
            size="large"
            borderRadius="8px"
            icon={<img src={Plus} alt="" />}
            disabled={params.sub_category.length > 0 ? false : true}
          >
            Add to List
          </CustomButton>
        </div>
      </div>
      <div className="mt-6">

        {
          loading ? <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div> : expense.length > 0 ? <DeliveryTable rows={expense} handleDelete={handleDelete} handleClose={handleClose} open={open} handleClickOpen={handleClickOpen} button={button}/> : <div className="flex justify-center items-center flex-col gap-4 mt-6">
            <img src={NotFound} alt="" />
            <p className="text-[18px] font-nunitoBold">No Results found !!</p>
          </div>
        }
      </div>

    </div>
  );
};

export default Expense;
