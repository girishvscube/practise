import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CompanyInfo from './CompanyInfo'
import PocDetails from './PocDetails'
import DeliveryDetails from './DeliveryDetails'
import Validator from 'validatorjs'
import { ViewCustomer } from '../../../../features/customer/customerSlice'
// import CustomStepper from './../../common/Stepper/CustomStepper'
import Popup from '../../../common/Popup'
import axiosInstance from '../../../../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getpocDropdown } from '../../../../features/dropdowns/dropdownSlice'
import { findLastKey } from 'lodash'
import { CountItems } from '../../../../utils/helpers'
import { showToastMessage } from '../../../../utils/helpers'

const { fields, rules } = require('./fields')

interface Props {
  handleNext?: any
  handleBack?: any
  id?: any
  edit?: any
  lead_id?: any
}

const Form: React.FC<Props> = ({ id, handleNext, handleBack, edit, lead_id }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [params, setParams] = useState(fields)
  const [errors, setErrors] = useState(fields)
  const [customer, setCustomer] = useState('' as any)

  const [step, setStep] = useState(1)
  const [customerId, setCustomerId] = useState(null)
  const [pocId, setPocId] = useState(null)
  const [cancel, setCancel] = useState(false)

  const [open, setOpen] = useState({
    success: false,
    warning: false,
    question: false,
  })

  const [disableButton, setDisableButton] = useState({
    customer: false,
    poc: false,
    delivery: false,
  })

  const [files, setFiles] = useState({})

  console.log('files:', files)

  console.log('params', params)
  const handleChange = (e: any) => {
    if (e.target) {
      const { name, value } = e.target

      console.log('params', name, value)

      if (name === 'gst_no' || name === 'ifsc_code') {
        const re = /^[a-z0-9]+$/i
        if (value && !re.test(value)) {
          return
        }
      }
      if (
        (name === 'credit_limit' || name === 'outstanding_amount' || name === 'fuel_price') &&
        value < 0
      ) {
        return
      }

      if (
        name === 'pincode' ||
        name === 'phone' ||
        name === 'credit_limit' ||
        name === 'outstanding_amount' ||
        name === 'account_number'
      ) {
        const re = /^[0-9\b]+$/
        if (value && !re.test(value)) {
          return
        }
      }
      if (name.includes('is')) {
        updateParams([{ name: e.target.name, value: e.target.checked }])
      } else {
        updateParams([
          { name: e.target.name, value: e.target.value },
          ...(name === 'customer_type' && value === 'Individual'
            ? [{ name: 'is_credit_availed', value: false }]
            : []),
        ])
      }
    } else {
      updateParams([{ name: e.name, value: e.url }])
    }

    if (e?.file) {
      console.log(e.name)
      setFiles({ ...files, [e.name]: e.file })
    }
    setErrors({})
  }

  const removeFile = (e: any) => {
    updateParams([{ name: e, value: '' }])
  }

  const updateParams = (records: any) => {
    const newParams = JSON.parse(JSON.stringify(params))
    Object.keys(records).forEach(
      (key) => (newParams[`step_${step}`][records[key].name] = records[key].value),
    )
    setParams(newParams)
  }

  const handleStep = (step_number: any) => {
    setStep(step_number)
  }

  const validate = (parameters: any, rule: any, steps: any) => {
    const validator = new Validator(parameters, rule, steps)

    if (validator.fails()) {
      const fieldErrors: any = {}

      /* eslint-disable */
      for (const key in validator.errors.errors) {
        fieldErrors[key] = validator.errors.errors[key][0]
      }
      /* eslint-enable */

      setErrors({
        [`step_${step}`]: fieldErrors,
      })
      console.log('fieldErrors:', fieldErrors)

      return false
    }
    setErrors({})
    return true
  }

  const SaveCompanyInfo = async (e: any) => {
    e.preventDefault()

    let postdata = params?.step_1
    // console.log('postdata:', postdata.is_credit_availed)

    if (postdata.is_credit_availed) {
      postdata = { ...postdata, is_credit_availed: 1 }
    } else {
      postdata = { ...postdata, is_credit_availed: 0 }
    }

    console.log('postdata:', postdata)

    const newrules = rules[`step_${step}`]

    if (params.step_1.customer_type.toLowerCase() === 'company') {
      newrules.account_number = 'required|numeric|digits:20'
      newrules.account_name = 'required|alpha'
      newrules.bank_name = 'required|alpha|max:20'
      newrules.ifsc_code = 'required|alpha_num|max:11'
      newrules.gst_no = 'required|alpha_num|max:11'
      newrules.cancelled_cheque = 'required'
      newrules.gst_certificate = 'required'
    } else {
      delete newrules.account_number
      delete newrules.account_name
      delete newrules.bank_name
      delete newrules.ifsc_code
      delete newrules.gst_no
      delete newrules.cancelled_cheque
      delete newrules.gst_certificate
    }

    if (
      params.step_1.customer_type.toLowerCase() === 'company' &&
      params.step_1.is_credit_availed
    ) {
      newrules.account_number = 'required|numeric|digits:11'
      newrules.account_name = 'required|alpha'
      newrules.bank_name = 'required|alpha'
      newrules.ifsc_code = 'required|alpha_num'
      newrules.gst_no = 'required|alpha_num'
      newrules.cancelled_cheque = 'required'
      newrules.gst_certificate = 'required'
      newrules.outstanding_amount = 'required|numeric'
      newrules.credit_aadhaar = 'required'
      newrules.credit_limit = 'required|numeric'
      newrules.credit_net_due_id = 'required'
      newrules.credit_pan = 'required'
      newrules.credit_bank_statement = 'required'
      newrules.credit_blank_cheque = 'required'
      newrules.credit_cibil = 'required'
    } else {
      delete newrules.account_number
      delete newrules.account_name
      delete newrules.bank_name
      delete newrules.ifsc_code
      delete newrules.gst_no
      delete newrules.cancelled_cheque
      delete newrules.gst_certificate
      delete newrules.outstanding_amount
      delete newrules.credit_aadhaar
      delete newrules.credit_limit
      delete newrules.credit_net_due_id
      delete newrules.credit_pan
      delete newrules.credit_bank_statement
      delete newrules.credit_blank_cheque
      delete newrules.credit_cibil
    }

    if (!validate(params[`step_${step}`], newrules, step)) {
      const err = Object.keys(errors[`step_${step}`])

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

      showToastMessage('Please Select All Required Fields!', 'error')
      return
    }
    setDisableButton({ ...disableButton, customer: true })
    console.log(postdata, 'posat')

    const formdata = new FormData()

    for (let key in postdata) {
      if (
        [
          'image',
          'cancelled_cheque',
          'gst_certificate',
          'credit_pan',
          'credit_bank_statement',
          'credit_aadhaar',
          'credit_blank_cheque',
          'credit_cibil',
        ].includes(key) ||
        postdata[key] === null ||
        postdata[key] === undefined
      )
        continue
      // console.log(key)
      formdata.append(key, postdata[key])
    }

    const FilesCount = CountItems(files)
    console.log('files:', files)

    if (FilesCount) {
      for (let key in files) {
        formdata.append(`${key}_file`, files[key])
      }
    }

    console.log('formdata:', formdata)

    if ((edit && id) || customerId) {
      for (let key in formdata.keys) {
        let is_image = formdata.get(key)
        console.log('is_image:', is_image)
        if (!is_image) {
          formdata.append(key, params.step_1[key])
        }
      }
    }

    if (id || customerId) {
      await axiosInstance
        .put(`/admin/customers/${id || customerId}`, formdata)
        .then((response) => {
          // console.log(response?.data)
          setFiles({})
          setDisableButton({ ...disableButton, customer: false })
          if (!edit) {
            handleNext()
            setStep(2)
            setCustomerId(response?.data?.data?.customer_id)
          } else {
            showToastMessage(response?.data?.data?.message, 'success')
            navigate('/customers')
          }
        })
        .catch((error) => {
          setDisableButton({ ...disableButton, customer: false })

          const errors = error.response?.data.errors

          console.log('errors:', errors)

          if (errors.message) {
            showToastMessage(errors.message, 'error')
          } else {
            for (let key in errors) {
              showToastMessage(errors[key][0], 'error')
            }
          }
        })
    } else {
      await axiosInstance
        .post('/admin/customers', formdata)
        .then((response) => {
          setFiles({})
          handleNext()
          setStep(2)
          console.log(response?.data?.data, 'response?.data?.data?.customer_id')
          setCustomerId(response?.data?.data?.customer_id)
        })
        .catch((error) => {
          setDisableButton({ ...disableButton, customer: false })

          const errors = error.response?.data.errors
          console.log('errors:', errors)

          if (errors.message) {
            showToastMessage(errors.message, 'error')
          } else {
            for (let key in errors) {
              showToastMessage(errors[key][0], 'error')
            }
          }
        })
    }
  }

  const SavePocDetails = async (e: any) => {
    e.preventDefault()
    // handleNext()
    if (!validate(params[`step_${step}`], rules[`step_${step}`], step)) {
      const err = Object.keys(errors[`step_${step}`])
      if (err.length) {
        const input: any = document.querySelector(`input[name=${err[0]}]`)

        input.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'start',
        })
      }
      showToastMessage('Please Select All Required Fields!', 'error')
      return
    }
    const postdata = params.step_2
    postdata.customer_id = customerId

    setDisableButton({ ...disableButton, poc: true })

    const formdata = new FormData()

    Object.entries(postdata).forEach(([key, value]) => {
      if (key !== 'image') {
        formdata.append(`${key}`, `${value}`)
      }
    })

    // for (let key in files) {
    //   key === 'image' && formdata.append(key, files[key])
    // }

    // formdata.append('image', pocImage)

    if (files['image']) {
      formdata.append('image_file', files['image'])
    }

    if (pocId) {
      let is_image = formdata.get('image_file')
      if (!is_image) formdata.append('image', params?.step_2?.image)
    }

    if (pocId) {
      await axiosInstance
        .put(`/admin/customers/poc/${pocId}`, formdata)
        .then(() => {
          setStep(3)
          handleNext()
          dispatch(getpocDropdown(customerId))
        })
        .catch((error) => {
          const errors = error.response?.data.errors
          setDisableButton({ ...disableButton, poc: false })

          if (errors.message) {
            showToastMessage(errors.message, 'error')
          } else {
            for (let key in errors) {
              showToastMessage(errors[key][0], 'error')
            }
          }
        })
    } else {
      await axiosInstance
        .post('/admin/customers/poc', formdata)
        .then((response) => {
          //   console.log('created', response.data);
          handleNext()
          dispatch(getpocDropdown(customerId))
          setPocId(response?.data?.data?.customer_poc_id)
          setStep(3)
        })
        .catch((error) => {
          setDisableButton({ ...disableButton, poc: false })
          const errors = error.response?.data.errors
          if (errors.message) {
            showToastMessage(errors.message, 'error')
          } else {
            for (let key in errors) {
              showToastMessage(errors[key][0], 'error')
            }
          }
        })
    }
  }

  const SaveDeliveryDetails = (e: any) => {
    e.preventDefault()

    const newrules = rules[`step_${step}`]

    if (params.step_3.is_fuel_price_checked) {
      newrules.fuel_price = 'required|numeric'
    } else {
      delete newrules.fuel_price
    }

    if (!validate(params[`step_${step}`], newrules, step)) {
      const err = Object.keys(errors[`step_${step}`])
      if (err.length) {
        console.log('err:', err)

        const input: any = document.querySelector(`input[name=${err[0]}]`)
        console.log('input:', input)

        input.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'start',
        })
      }
      showToastMessage('Please Select All Required Fields!', 'error')
      return
    }
    setDisableButton({ ...disableButton, delivery: true })

    handleClickOpen('warning', true)
  }
  const onCancel = () => {
    handleClickOpen('warning', true)
    setCancel(true)
  }

  const handleClickOpen = (key: any, value: any) => {
    setOpen({ ...open, [key]: value })
  }

  const Confirmation = async () => {
    if (cancel) {
      navigate('/customers')
    } else {
      const formdata = params.step_3
      formdata.customer_id = customerId
      await axiosInstance
        .post('/admin/customers/delivery-address', formdata)
        .then(() => {
          handleClickOpen('success', true)
        })
        .catch((err) => {
          const errors = err.response?.data.errors
          handleClickOpen('warning', false)
          if (errors.message) {
            showToastMessage(errors.message, 'error')
          } else {
            for (let key in errors) {
              showToastMessage(errors[key][0], 'error')
            }
          }
          // alert(err?.response?.data?.errors?.message)
          setDisableButton({ ...disableButton, delivery: false })
        })
    }
  }

  const handleOkay = () => {
    navigate('/customers')
  }

  const handleNo = () => {
    setDisableButton({ ...disableButton, delivery: false })
  }

  const fetchCustomer = async (id: any) => {
    axiosInstance
      .get(`/admin/customers/${id}`)
      .then((response) => {
        console.log(response)
        let customer = response.data.data
        setCustomer(customer)

        // const fields = [
        //   'company_name',
        //   'phone',
        //   'email',
        //   'customer_type',
        //   'industry_type',
        //   'equipment',
        //   'address',
        //   'city',
        //   'pincode',
        //   'state',
        //   'image',
        //   'account_number',
        //   'account_name',
        //   'bank_name',
        //   'ifsc_code',
        //   'cancelled_cheque',
        //   'gst_no',
        //   'gst_certificate',
        //   'outstanding_amount',
        //   'credit_limit',
        //   'credit_net_due_id',
        //   'credit_pan',
        //   'credit_bank_statement',
        //   'credit_aadhaar',
        //   'credit_blank_cheque',
        //   'credit_cibil',
        //   'sales_executive_id',
        // ]

        updateParams([
          { name: 'company_name', value: customer?.company_name },
          { name: 'phone', value: customer?.phone },
          { name: 'email', value: customer?.email },
          { name: 'customer_type', value: customer?.customer_type },
          { name: 'industry_type', value: customer?.industry_type },
          { name: 'equipment', value: customer?.equipment },
          { name: 'address', value: customer?.address },
          { name: 'city', value: customer?.city },
          { name: 'pincode', value: String(customer?.pincode) },
          { name: 'state', value: customer?.state },
          { name: 'image', value: customer?.image },
          { name: 'account_number', value: customer?.account_number },
          { name: 'account_name', value: customer?.account_name },
          { name: 'bank_name', value: customer?.bank_name },
          { name: 'ifsc_code', value: customer?.ifsc_code },
          { name: 'cancelled_cheque', value: customer?.cancelled_cheque },
          { name: 'gst_no', value: customer?.gst_no },
          { name: 'gst_certificate', value: customer?.gst_certificate },
          { name: 'is_credit_availed', value: customer?.is_credit_availed },
          { name: 'outstanding_amount', value: customer?.outstanding_amount },
          { name: 'credit_limit', value: customer?.credit_limit },
          { name: 'credit_net_due_id', value: customer?.credit_net_due_id },
          { name: 'credit_pan', value: customer?.credit_pan },
          { name: 'credit_bank_statement', value: customer?.credit_bank_statement },
          { name: 'credit_aadhaar', value: customer?.credit_aadhaar },
          { name: 'credit_blank_cheque', value: customer?.credit_blank_cheque },
          { name: 'credit_cibil', value: customer?.credit_cibil },
          { name: 'sales_executive_id', value: customer?.sales_executive_id },
        ])
      })
      .catch((error) => {
        console.log('error:', error)
      })
  }

  const fetchLeadById = () => {
    axiosInstance
      .get(`/admin/leads/${lead_id}`)
      .then((response) => {
        const lead = response.data.data
        updateParams([
          { name: 'company_name', value: lead?.company_name },
          { name: 'phone', value: lead?.company_phone },
          { name: 'email', value: lead?.email },
          { name: 'address', value: lead?.address },
          { name: 'city', value: lead?.city },
          { name: 'pincode', value: String(lead?.pincode) },
          { name: 'state', value: lead?.state },
          { name: 'industry_type', value: lead?.industry_type },
          { name: 'sales_executive_id', value: lead?.user?.id },
        ])
      })
      .catch((err) => {
        console.log('err:', err)
      })
  }
  useEffect(() => {
    if (id) {
      fetchCustomer(id)
    }
    if (lead_id) {
      fetchLeadById()
    }
  }, [id, lead_id])

  return (
    <>
      <div>
        <div className={step === 1 ? 'block' : 'hidden'}>
          <CompanyInfo
            id={id}
            params={params}
            handleChange={handleChange}
            errors={errors}
            SaveCompanyInfo={SaveCompanyInfo}
            onCancel={onCancel}
            disableButton={disableButton}
            setDisableButton={setDisableButton}
            removeFile={removeFile}
          />
        </div>
        <div className={step === 2 ? 'block' : 'hidden'}>
          <PocDetails
            disableButton={disableButton}
            setDisableButton={setDisableButton}
            params={params}
            handleBack={handleBack}
            handleStep={handleStep}
            handleChange={handleChange}
            errors={errors}
            SavePocDetails={SavePocDetails}
            onCancel={onCancel}
            removeFile={removeFile}
          />
        </div>
        <div className={step === 3 ? 'block' : 'hidden'}>
          <DeliveryDetails
            handleBack={handleBack}
            handleStep={handleStep}
            customerId={customerId}
            errors={errors}
            params={params}
            handleChange={handleChange}
            onCancel={onCancel}
            disableButton={disableButton}
            setDisableButton={setDisableButton}
            SaveDeliveryDetails={SaveDeliveryDetails}
            // removeFile={removeFile}
          />
        </div>
      </div>

      <div className=''>
        {/* 1. Warning Popup */}
        <Popup
          Confirmation={Confirmation}
          handleNo={handleNo}
          open={open.warning}
          handleClickOpen={handleClickOpen}
          popup='warning'
          subtitle={`${cancel ? 'Changes are not saved !' : 'Save Information ?'}`}
          popupmsg={`${
            cancel
              ? 'Do you want to Proceed without Saving the Details ?'
              : 'Do you really want to Proceed ?'
          }`}
        />
        {/* Success popup */}
        <Popup
          Confirmation={Confirmation}
          open={open?.success}
          handleClickOpen={handleClickOpen}
          popup='success'
          subtitle='Information saved !'
          popupmsg='Customer Created Successfully !'
          handleOkay={handleOkay}
        />
      </div>
    </>
  )
}

export default Form
