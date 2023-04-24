import { useEffect, useState } from 'react'
import CustomButton from '../../../common/Button'
import AccountsTable from './Table'
import Plus from '../../../../assets/images/PlusBlack.svg'
import PopUpForm from './PopUpForm'
import { useDispatch } from 'react-redux'
import { fetchBankAccountList } from '../../../../features/settings/bankAccounts'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../../utils/axios'
import Validator from 'validatorjs'
import { CircularProgress } from '@mui/material'
import NotFound from '../../../../assets/images/NotFound.svg'
import { showToastMessage } from './Toast'
import moment from 'moment'
const initialValues = {
  account_name: '',
  account_type: '',
  bank_name: '',
  account_number: '',
  ifsc_code: '',
  opening_balance: '',
  as_of_date: '',
  print_ac_number: 0,
  print_upi_qr: 0,
  qr_code: '',
  upi_id: '',
}

const DeliveryStatus = () => {
  const { bankAccountList, Loading } = useSelector((state: any) => state.bankAccount)
  const dispatch = useDispatch()
  const [imageFileEvent, setImageFileEvent] = useState('')
  const [params, setParams] = useState(initialValues)
  const [errors, setErrors] = useState(initialValues)
  const [accountId, setAccountId] = useState()
  const [open, setOpen] = useState({
    create: false,
    update: false,
  })

  const [bankList, setBankList] = useState([])
  const [loading, setLoading] = useState(false)
  const handleAdd = (name, id, data) => {
    setAccountId(id)
    // id ? fetchBankInfoForEdit(id) : null
    setParams(data)
    setOpen({ ...open, [name]: true })
  }

  const handleClose = () => {
    setParams(initialValues)
    setErrors(initialValues)
    setOpen({ ...open, create: false, update: false })
  }

  const handleDate = (date) => {
    setParams({ ...params, as_of_date: date })
    setErrors({ ...params, as_of_date: '' })
    setErrors(initialValues)
  }

  const handleChange = (event: any) => {
    if (event.target) {
      if (event.target.name.includes('print')) {
        setParams({ ...params, [event.target.name]: event.target.checked === true ? 1 : 0 })
      } else {
        setParams({ ...params, [event.target.name]: event.target.value })
        setErrors({ ...errors, [event.target.name]: '' })
      }
    } else {
      setParams({ ...params, qr_code: event.url })
    }
  }

  const submitForm = () => {
    const rules = {
      account_name: 'required',
      bank_name: 'required',
      account_number: 'required',
      ifsc_code: 'required',
      opening_balance: 'required',
      as_of_date: 'required',
    }

    let newRules = rules

    if (params?.print_upi_qr) {
      ;(newRules['upi_id'] = 'required'), (newRules['qr_code'] = 'required')
    }

    const validation = new Validator(params, rules)
    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })
      const err = Object.keys(fieldErrors)
      if (err.length) {
        const input: any = document.querySelector(`input[name=${err[0]}]`)
        if (input) {
          input.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'start',
          })
        }
      }
      setErrors(fieldErrors)
      return false
    }

    const formData = new FormData()

    const payloadkeys = [
      'account_name',
      'bank_name',
      'account_number',
      'ifsc_code',
      'opening_balance',
      'as_of_date',
      'print_ac_number',
      'print_upi_qr',
      'qr_code',
      'upi_id',
    ]

    for (const payloadkey of payloadkeys) {
      if (payloadkey === 'as_of_date') {
        let date = params['as_of_date']
        let postdate = moment(date).format('YYYY-MM-DD')
        formData.append(payloadkey, postdate)
        continue
      }

      if (payloadkey === 'print_upi_qr' || 'upi_id') {
        if (params[payloadkey] === undefined) {
          formData.append(payloadkey, '0')
          continue
        } else {
          formData.append(payloadkey, params[payloadkey])
          continue
        }
      }
      if (payloadkey === 'qr_code' && params[payloadkey]) {
        continue
      } else {
        formData.append(payloadkey, params[payloadkey])
      }
    }
    if (imageFileEvent) {
      formData.append('qr_code', imageFileEvent)
    }
    setLoading(true)
    accountId
      ? axiosInstance
          .put(`/admin/settings/bank-account/${accountId}`, formData)
          .then(() => {
            setLoading(false)
            setOpen({ ...open, update: false })
            dispatch(fetchBankAccountList())
            setParams(initialValues)
            setImageFileEvent('')
            showToastMessage('Updated Successfully', 'success')
          })
          .catch((err) => {
            setLoading(false)
          })
      : axiosInstance
          .post('/admin/settings/bank-account/', formData)
          .then(() => {
            setOpen({ ...open, create: false })
            setLoading(false)
            dispatch(fetchBankAccountList())
            setParams(initialValues)
            setImageFileEvent('')
            showToastMessage('Created Successfully', 'success')
          })
          .then(() => {
            setLoading(false)
          })
  }

  useEffect(() => {
    dispatch(fetchBankAccountList())
    fetchBankList()
  }, [])

  const handleImage = (data: any) => {
    setImageFileEvent(data.file)
    setParams({ ...params, qr_code: data.url })
    setErrors({ ...errors, qr_code: '' })
  }

  const fetchBankList = () => {
    axiosInstance.get(`/admin/bank-account/bank/list`).then((res) => {
      setBankList(res?.data?.data)
    })
  }

  return (
    <div className='divstyles bg-lightbg'>
      <div className='flex justify-between'>
        <div>
          <p className='subheading'>Your Accounts</p>
          <p className='text-xs font-nunitoRegular'>These are the list of Bank Accounts.</p>
        </div>
        <div>
          <CustomButton
            onClick={() => {
              handleAdd('create', '', '')
            }}
            width='w-full'
            variant='contained'
            size='large'
            borderRadius='8px'
            icon={<img src={Plus} alt='' />}
          >
            Add Bank Account
          </CustomButton>
        </div>
      </div>
      <div className='mt-6'>
        {Loading ? (
          <div className='w-full h-96 flex justify-center items-center'>
            <CircularProgress />
            <span className='text-3xl'>Loading...</span>
          </div>
        ) : bankAccountList.length > 0 ? (
          <AccountsTable
            rows={bankAccountList}
            handleClose={handleClose}
            open={open?.update}
            title='Edit Bank Account'
            type='edit'
            name=''
            loading={loading}
            params={params}
            handleAdd={handleAdd}
            handleChange={handleChange}
            submit={submitForm}
            errors={errors}
            handleDate={handleDate}
            handleImage={handleImage}
            removeImage={() => setImageFileEvent('')}
            bankList={bankList}
          />
        ) : (
          <div className='flex justify-center items-center flex-col gap-4 mt-6'>
            <img src={NotFound} alt='' />
            <p className='text-[18px] font-nunitoBold'>No Results found !!</p>
          </div>
        )}
      </div>
      <PopUpForm
        open={open?.create}
        handleClose={handleClose}
        title='Add New Bank Account'
        type='create'
        name=''
        params={params}
        handleChange={handleChange}
        submit={submitForm}
        errors={errors}
        handleImage={handleImage}
        removeImage={() => setImageFileEvent('')}
        bankList={bankList}
        loading={loading}
        handleDate={handleDate}
      />
    </div>
  )
}

export default DeliveryStatus
