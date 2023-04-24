import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreatePurchaseOrder from './CreatePurchaseOrder'
import PreviewPurchaseOrder from './PreviewPurchaseOrder'
import Validator from 'validatorjs'

import { useDispatch, useSelector } from 'react-redux'
import Popup from '../../../common/Popup'

import { fetchBowserDropdown } from '../../../../features/dropdowns/dropdownSlice'
import moment from 'moment'
import axiosInstance from './../../../../utils/axios'
import { showToastMessage } from '../../../../utils/helpers'
import { decryptData } from '../../../../utils/encryption'

interface Props {
  handleNext?: any
  handleBack?: any
  id?: any
  edit?: any
}

const createParams = {
  step_1: {
    supplier_id: '',
    bowser_id: '',
    fuel_qty: '',
    purchase_date: '',
    price_per_litre: '90.85',
  },
  step_2: { additional_notes: '' },
}

const Form: React.FC<Props> = ({ handleNext, handleBack, id, edit }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [suppliersList, setSuppliersList] = useState([])

  const { bowserdropdown } = useSelector((state: any) => state.dropdown)
  const { PoById } = useSelector((state: any) => state.purchaseOrder)
  console.log('PoById:', PoById)

  const [params, setParams] = useState(createParams)
  console.log('params:', params)
  const [errors, setErrors] = useState(createParams)

  const [value, setValue] = useState('')

  // console.log('errors:', bowserdropdown)

  const [step, setStep] = useState(1)
  const [cancel, setCancel] = useState(false)

  const [Podata, setPoData] = useState({ bowser_info: '', supplier_info: '' })
  // console.log('Podata:', Podata)
  // const [saveExit, setSaveExit] = useState(false)

  useEffect(() => {
    if (id) {
      getPoById(id)
    }
  }, [id])

  const getPoById = async (id: any) => {
    axiosInstance
      .get(`/admin/purchase-order/${id}`)
      .then((response) => {
        console.log('response:', response?.data.data)
        setValue(moment(response?.data.data.purchase_date)?.format('YYYY-MM-DD HH:mm:ss'))
        setParams({
          ...params,
          step_1: {
            supplier_id: response?.data.data?.supplier_id,
            bowser_id: response?.data.data?.bowser_id,
            fuel_qty: response?.data.data?.fuel_qty,
            purchase_date: moment(response?.data.data.purchase_date)?.format('YYYY-MM-DD HH:mm:ss'),

            price_per_litre: response?.data.data?.price_per_litre,
          },
          step_2: { additional_notes: response?.data.data?.additional_notes },
        })
      })
      .catch((error) => {
        showToastMessage(error.response.data.errors.message, 'error')
      })
  }

  const [open, setOpen] = useState({
    success: false,
    warning: false,
    question: false,
  })

  const fetchSuppliers = () => {
    axiosInstance
      .get(`/admin/supplier/dropdown`)
      .then((response) => {
        let list = response.data.data
        setSuppliersList(list)
        const queryparameters = window.location.search
        const urlParams = new URLSearchParams(queryparameters)
        const supplier_id = urlParams.get('supplier_id')
        let index = list.findIndex((x) => x.id === decryptData(supplier_id))
        if (index != -1) {
          updateParams([{ name: 'supplier_id', value: decryptData(supplier_id) }])
        }
      })
      .catch(() => {
        // show error message and navigate to list
        showToastMessage('UNABLE TO FETCH SUPPLIERS', 'error')
      })
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    if (name === 'fuel_qty' && value.length > 6) return

    updateParams([{ name: name, value }])

    if (name === 'supplier_id') {
      console.log(suppliersList, value)
      let supplier = suppliersList?.find((x: any) => x.id === Number(value))
      console.log('supplier:', supplier)

      if (supplier) {
        setPoData({ ...Podata, supplier_info: supplier })
      }
      return
    }

    if (name === 'bowser_id') {
      let bowser = bowserdropdown?.find((x: any) => x.id === Number(value))
      if (bowser) {
        setPoData({ ...Podata, bowser_info: bowser })
        return
      }
      return
    }
  }

  const updateParams = (records: any) => {
    // console.log(records)

    const newParams = JSON.parse(JSON.stringify(params))
    Object.keys(records).forEach(
      (key) => (newParams[`step_${step}`][records[key].name] = records[key].value),
    )
    setParams(newParams)
  }

  const handleStep = (step_number: any) => {
    setStep(step_number)
  }

  const Confirmation = async () => {
    console.log('confimerd')

    if (cancel) {
      navigate('/purchase-orders')
    } else {
      let postdata: any = { ...params.step_1, ...params.step_2 }
      postdata.fuel_qty = Number(postdata.fuel_qty)

      if (edit && id) {
        await axiosInstance
          .put(`/admin/purchase-order/${id}`, postdata)
          .then(() => {
            handleClickOpen('success', true)
          })
          .catch((error) => {
            handleClickOpen('warning', false)
            showToastMessage(error?.response?.data?.errors?.message, 'error')
            // console.log('error:', error?.response?.data?.errors?.message)
          })
      } else {
        await axiosInstance
          .post('/admin/purchase-order', postdata)
          .then(() => {
            handleClickOpen('success', true)
          })
          .catch((error) => {
            handleClickOpen('warning', false)
            showToastMessage(error?.response?.data?.errors?.message, 'error')
            // console.log('error:', error?.response?.data?.errors?.message)
          })
      }
    }

    // handleNext()
    // if (cancel) {
    //   navigate('/sales/orders')
    // } else if (saveExit) {
    //   /* eslint-disable */
    //   step === 1 ? SaveOrderDetails() : ConfirmOrder()
    //   /* eslint-enable */
    // } else {
    //   handleClickOpen('success', true)
    // }
  }
  const handleNo = () => {
    handleClickOpen('warning', false)
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

      // console.log('fieldErrors:', fieldErrors)

      
      setErrors(fieldErrors)

      return false
    }
    setErrors(createParams)
    return true
  }

  const PreviewPO = () => {
    // setStep(2)
    const rules = {
      supplier_id: 'required',
      bowser_id: 'required',
      fuel_qty: 'required',
      purchase_date: 'required',
      price_per_litre: 'required',
    }
    if (!validate(params[`step_${step}`], rules, step)) {
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
    setStep(2)
    handleNext()
  }

  const CreatePO = async () => {
    // const rules = {
    //   supplier_id: 'required',
    //   bowser_id: 'required',
    //   fuel_qty: 'required',
    //   purchase_date: 'required',
    //   price_per_litre: 'required',
    //   additional_notes: 'required',
    //   payment_term_id: 'required',
    // }
    // if (!validate(params[`step_${step}`], rules, step)) {
    //   return
    // }
    // console.log('params.step_1:', params.step_1)

    handleClickOpen('warning', true)
  }

  const onCancel = () => {
    handleClickOpen('warning', true)
    setCancel(true)
    // setSaveExit(false)
  }

  const handleSaveExit = () => {
    // if (step === 1) {
    //   const newrules = rules[`step_${step}`]
    //   if (validate(params[`step_${step}`], newrules, step)) {
    //     handleClickOpen('warning', true)
    //     setSaveExit(true)
    //     setCancel(false)
    //   }
    // } else {
    //   const Rules = {
    //     payment_type: 'required',
    //     additional_notes: 'required',
    //   }
    //   if (validate(paymentfields, Rules, step)) {
    //     handleClickOpen('warning', true)
    //     setSaveExit(true)
    //     setCancel(false)
    //   }
    // }
  }

  const handleClickOpen = (key: any, value: any) => {
    setOpen({ ...open, [key]: value })
  }

  const handleOkay = () => {
    navigate('/purchase-orders')
  }

  useEffect(() => {
    dispatch(fetchBowserDropdown())
  }, [])

  return (
    <>
      <form>
        {step === 1 ? (
          <CreatePurchaseOrder
            setValue={setValue}
            value={value}
            edit={edit}
            PoId={id}
            Podata={Podata}
            updateParams={updateParams}
            setParams={setParams}
            params={params}
            handleChange={handleChange}
            errors={errors}
            PreviewPO={PreviewPO}
            onCancel={onCancel}
            handleSaveExit={handleSaveExit}
            suppliersList={suppliersList}
          />
        ) : step === 2 ? (
          <PreviewPurchaseOrder
            bowserdropdown={bowserdropdown}
            suppliersList={suppliersList}
            params={params}
            handleChange={handleChange}
            handleStep={handleStep}
            errors={errors}
            handleBack={handleBack}
            handleSaveExit={handleSaveExit}
            CreatePO={CreatePO}
          />
        ) : (
          <></>
        )}

        <div className=''>
          <Popup
            handleNo={handleNo}
            Confirmation={Confirmation}
            open={open?.warning}
            handleClickOpen={handleClickOpen}
            popup='warning'
            subtitle={`${cancel ? 'Changes are not saved !' : 'Confirm and Generate PO! ?'}`}
            popupmsg={`${
              cancel
                ? 'Do you want to Proceed without Saving the Details ?'
                : 'Do you want to Proceed confirming PO ?'
            }`}
          />
          <Popup
            Confirmation={Confirmation}
            handleNo={handleNo}
            open={open?.success}
            handleClickOpen={handleClickOpen}
            popup='success'
            subtitle='Successfully Created!!'
            popupmsg={`Purchase Order is Created Scuccessfully !`}
            handleOkay={handleOkay}
          />
        </div>
      </form>
    </>
  )
}

export default Form
