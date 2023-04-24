import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SupplierInfo from './SupplierInfo'
import PocDetails from './PocInfo'
import Validator from 'validatorjs'
import Popup from '../../../common/Popup'
import axiosInstance from '../../../../utils/axios'
import { decryptData } from '../../../../utils/encryption'
import { showToastMessage } from './Toast'

const { fields, rules } = require('./field')

interface Props {
  handleNext?: any
  handleBack?: any
}

const Form: React.FC<Props> = ({ handleNext, handleBack }) => {
  const { id } = useParams()
  const supplierIdEdit: any = id
  const navigate = useNavigate()

  const [params, setParams] = useState(fields)
  const [errors, setErrors] = useState(fields)
  const [step, setStep] = useState(1)
  const [supplierId, setsupplierId] = useState(null)
  const [pocId, setPocId] = useState(null)
  const [cancel, setCancel] = useState(false)
  const [, setBackError] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [pocImage, setPocImage] = useState('')
  const [open, setOpen] = useState({
    success: false,
    warning: false,
    question: false,
    update: false,
  })
  const [imagesSelection, setImageSelection] = useState({
    image: '',
    cancelled_cheque: '',
    gst_certificate: '',
  })

  const removeFile = (e: any) => {
    updateParams([{ [e]: '' }])
  }

  const handleChange = (e: any) => {
    setErrors(fields)
    if (e.target) {
      const { name, value } = e.target
      if (
        name === 'account_number' ||
        name === 'phone' ||
        name === 'pincode' ||
        name == 'contact'
      ) {
        const re = /^[0-9\b]+$/
        if (value && !re.test(value)) {
          return
        }
      }
      updateParams([{ [name]: value }])
    } else {
      setImageSelection({ ...imagesSelection, [e.name]: e.file })
      updateParams([{ [e.name]: e.url }])
    }
  }

  const removeImage = () => {
    setPocImage('')
  }
  const handleImage = (e: any) => {
    if (e.name === 'image') {
      setPocImage(e.file)
    }
    updateParams([
      {
        [e.name]: e.url,
        ['image']: e.file,
      },
    ])
  }

  useEffect(() => {
    if (supplierIdEdit) {
      fetchSupplier()
    }
  }, [supplierIdEdit])

  const fetchSupplier = () => {
    axiosInstance.get(`/admin/supplier/${decryptData(supplierIdEdit)}`).then((res) => {
      let payload = res.data.data
      payload.pincode = String(payload.pincode)
      setParams({ ...params, step_1: payload })
    })
  }

  const updateParams = (records: any) => {
    const newParams = { ...params }
    for (let field of records) {
      newParams[`step_${step}`] = { ...newParams[`step_${step}`], ...field }
    }
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

      return false
    }
    setErrors({})
    return true
  }

  const SaveSupplier = async (e: any) => {
    e.preventDefault()
    if (!validate(params[`step_${step}`], rules[`step_${step}`], step)) {
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

    const formData = new FormData()
    for (let key in params.step_1) {
      if (key === 'cancelled_cheque' || key === 'gst_certificate' || key === 'image') continue
      formData.append(key, params.step_1[key])
    }

    if (imagesSelection.image) {
      formData.append('image_file', imagesSelection.image)
    }

    if (imagesSelection.cancelled_cheque) {
      formData.append('cancelled_cheque_file', imagesSelection.cancelled_cheque)
    }
    if (imagesSelection.gst_certificate) {
      formData.append('gst_certificate_file', imagesSelection.gst_certificate)
    }

    setLoading(true)

    if (supplierIdEdit) {
      let image = formData.get('image_file')
      if (!image) {
        formData.append('image', params.step_1.image)
      }

      let cancelled_cheque = formData.get('cancelled_cheque_file')
      if (!cancelled_cheque) {
        formData.append('cancelled_cheque', params.step_1.cancelled_cheque)
      }

      let gst_certificate = formData.get('gst_certificate_file')
      if (!gst_certificate) {
        formData.append('gst_certificate', params.step_1.gst_certificate)
      }

      await axiosInstance
        .put(`/admin/supplier/${decryptData(supplierIdEdit)}`, formData)
        .then(() => {
          handleClickOpen('update', true)
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          const message = error.payload.message
          showToastMessage(message, 'error')
        })

      return
    }
    if (supplierId) {
      await axiosInstance
        .put(`/admin/supplier/${supplierId}`, formData)
        .then((response) => {
          setsupplierId(response?.data?.data?.supplier_id)
          setLoading(false)
          handleNext()
          setStep(2)
        })
        .catch((error) => {
          console.log(error)
          setBackError(error?.response?.data?.errors)
          setLoading(false)
          const message = error.message
          showToastMessage(message, 'error')
        })
    } else {
      await axiosInstance
        .post('/admin/supplier', formData)
        .then((response) => {
          handleNext()
          setStep(2)
          showToastMessage(response?.data?.message, 'success')
          setLoading(false)
          setsupplierId(response?.data?.data?.id)
        })
        .catch((error) => {
          console.log(error.response.data.errors)
          let err = error.response.data.errors
          setLoading(false)
          const message = err.message
          showToastMessage(message, 'error')
        })
    }
  }

  const SavePocDetails = async (e: any) => {
    e.preventDefault()
    const postData = params.step_2
    postData.supplier_id = supplierId
    handleNext()
    if (!validate(params[`step_${step}`], rules[`step_${step}`], step)) {
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

    const payloadkeys = ['poc_name', 'designation', 'contact', 'email', 'supplier_id']
    const formdata = new FormData()
    for (const key of payloadkeys) {
      formdata.append(key, postData[key])
    }

    if (pocImage) {
      formdata.append('image_file', pocImage)
    }
    if (pocId) {
      await axiosInstance
        .put(`/admin/supplier-poc/${pocId}`, formdata)
        .then(() => {
          navigate('/suppliers')
          handleNext()
        })
        .catch((error) => {
          setBackError(error?.response?.data?.errors?.message)
        })
    } else {
      await axiosInstance
        .post('/admin/supplier-poc', formdata)
        .then((response) => {
          //   console.log('created', response.data);
          handleNext()
          setPocId(response?.data?.data?.customer_poc_id)
          handleClickOpen('success', true)
        })
        .catch((error) => {
          setBackError(error?.response?.data?.errors?.message)
        })
    }
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
      navigate('/suppliers')
    }
  }

  const handleNo = () => {
    handleClickOpen('warning', false)
  }

  const handleOkay = () => {
    navigate('/suppliers')
  }

  return (
    <>
      <form>
        <div className={step === 1 ? 'block' : 'hidden'}>
          <SupplierInfo
            params={params}
            buttonDisable={isLoading}
            handleChange={handleChange}
            errors={errors}
            SaveSupplier={SaveSupplier}
            onCancel={onCancel}
            removeFile={removeFile}
            supplierIdEdit={supplierIdEdit}
          />
        </div>

        <div className={step === 2 ? 'block' : 'hidden'}>
          <PocDetails
            params={params}
            handleChange={handleChange}
            handleStep={handleStep}
            errors={errors}
            SavePocDetails={SavePocDetails}
            onCancel={onCancel}
            handleBack={handleBack}
            buttonDisable={isLoading}
            handleImage={handleImage}
            removeImage={removeImage}
          />
        </div>
      </form>

      <div className=''>
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
        <Popup
          Confirmation={Confirmation}
          open={open.success}
          handleClickOpen={handleClickOpen}
          popup='success'
          subtitle='Information saved !'
          popupmsg='Supplier Created Successfully !'
          handleOkay={handleOkay}
        />

        <Popup
          Confirmation={Confirmation}
          open={open.update}
          handleClickOpen={handleClickOpen}
          popup='success'
          subtitle='Information saved !'
          popupmsg='Supplier Updated Successfully !'
          handleOkay={handleOkay}
        />
      </div>
    </>
  )
}

export default Form
