import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Validator from 'validatorjs'
import { useDispatch, useSelector } from 'react-redux'
import OrderDetails from './OrderDetails'
import OrderConfirmation from './OrderConfirmation'
import Proforma from './Proforma'
import Popup from '../../../common/Popup'
import { fetchOrderById } from '../../../../features/orders/orderSlice'
import { showToastMessage } from '../../../../utils/helpers'
import axiosInstance from './../../../../utils/axios'

const { fields, rules } = require('./fields')

interface Props {
    handleNext?: any
    handleBack?: any
    id?: any
    cust_id: any
    
}

const Form: React.FC<Props> = ({ handleNext, handleBack, id, cust_id,  }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { paymentTypeDropdown, TimeSlots } = useSelector((state: any) => state.dropdown)
    const { orderByid } = useSelector((state: any) => state.order)
    const [params, setParams] = useState({
        ...fields,
        step_1: { ...fields.step_1},
    })
    const [errors, setErrors] = useState({
        ...fields,
        step_1: { ...fields.step_1},
    })
    const [buttonDisable, setButtonDisable] = useState({
        details: false,
        confirmation: false,
        proforma: false,
    })

    const [order, setOrder] = useState({} as any)

    const [response, setResponse] = useState({})

    const [total_meta, setTotalMeta] = useState({
        total_amount: '',
        per_litre_cost: '',
        delivery_charges: '',
        fuel_qty: '',
        discount: '',
        grand_total: '',
        discount_type: 'Percentage',
        payment_type: '',
        additional_notes: '',
        discount_amount: '',
        sub_total:0
    })

    const extraFields = {
        customer_name: '',
        email: '',
        phone: '',
    }

    const [extraParams, setExtraParams] = useState(extraFields)

    const UpdateExtraParams = (e: any) => {
        setExtraParams({ ...extraParams, [e.target.name]: e.target.value })
    }

    const [step, setStep] = useState(1)

    const [cancel, setCancel] = useState(false)
    const [saveExit, setSaveExit] = useState(false)

    const [paymentfields, setPaymentFields] = useState(fields?.step_2)
    const [todayValue, setTodayValue] = useState(fields?.step_2)

    const handlePaymentFields = (e: any) => {
        if (e.target.name === 'payment_type') {
            const type = paymentTypeDropdown?.find((p: any) => p.name === e.target.value)
            setPaymentFields({
                ...paymentfields,
                [e.target.name]: e.target.value,
                payment_rules: type.rules,
            })
        } else {
            setPaymentFields({ ...paymentfields, [e.target.name]: e.target.value })
        }
    }

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id))
            getPOCbyOrderId()
        }
    }, [id])


    const getPOCbyOrderId = () => {
        id ??
            axiosInstance
                .get(`/admin/orders/poc/${id}`)
                .then((response) => {
                    const pocs = response?.data?.data?.map((a: any) => a?.customer_poc_id)
                    updateParams([
                        { name: 'customer_id', value: orderByid?.order?.customer_id },
                        {
                            name: 'customer_delivery_id',
                            value: orderByid?.order?.customer_delivery_id,
                        },
                        { name: 'order_type', value: orderByid?.order?.order_type },
                        { name: 'delivery_date', value: orderByid?.order?.delivery_date },
                        { name: 'time_slot_id', value: orderByid?.order?.time_slot_id },
                        { name: 'fuel_qty', value: orderByid?.order?.fuel_qty },
                        { name: 'sales_executive_id', value: orderByid?.order?.sales_executive_id },
                        { name: 'per_litre_cost', value: orderByid?.order_payment?.per_litre_cost },
                        { name: 'poc_ids', value: pocs },
                    ])

                    setExtraParams({
                        ...extraParams,
                        customer_name: orderByid?.order?.customer?.company_name,
                        email: orderByid?.order?.customer?.email,
                        phone: orderByid?.order?.customer?.phone,
                    })
                })
                .catch(() => {
                    // console.log(error);
                })
    }

    useEffect(() => {
        let total = 0
        if (paymentfields.discount_type === 'Percentage') {
            total =
                paymentfields.total_amount -
                    (paymentfields.total_amount * paymentfields.discount) / 100 || 0
        } else {
            total = paymentfields.total_amount - paymentfields.discount || 0
        }
        setPaymentFields({ ...paymentfields, grand_total: total })
    }, [paymentfields?.discount])

    useEffect(() => {
        const total = params.step_1.fuel_qty * +paymentfields.per_litre_cost || 0

        if (paymentfields.discount_type === 'Percentage') {
            setPaymentFields({
                ...paymentfields,
                total_amount: total,
                grand_total: total - (total * paymentfields.discount) / 100,
            })
        } else {
            setPaymentFields({
                ...paymentfields,
                total_amount: total,
                grand_total: total - paymentfields.discount || 0,
            })
        }
    }, [paymentfields?.per_litre_cost])

    const [open, setOpen] = useState({
        success: false,
        warning: false,
        question: false,
    })

    const handlePriceEdit = (e: any) => {
        console.log('e:', e)

        let sub_total =
            Number(total_meta.fuel_qty) *
            Number(e.update_liter_price ? e.update_liter_price : e.per_litre_cost)
        let total_amount = sub_total
        let discount = 0
        if (e.discount) {
            if (e.discount_type == 'Percentage') {
                discount = (total_amount * Number(e.discount)) / 100
            } else {
                discount = parseFloat(e.discount)
            }
        }
        console.log(discount, 'discount')
        let grand_total = Number(total_meta.delivery_charges || 0) + sub_total - discount
        setTotalMeta({
            ...total_meta,
            per_litre_cost: e.update_liter_price ? e.update_liter_price : e.per_litre_cost,
            discount: e.discount,
            grand_total: String(grand_total),
            discount_type: e.discount_type ? e.discount_type : total_meta.discount_type,
            discount_amount: discount ? String(discount) : '',
            sub_total:Number(e.update_liter_price ? e.update_liter_price : e.per_litre_cost) * Number(order.fuel_qty)
        })
    }
    const handleChange = (e: any) => {
        const { name, value } = e.target
        if (name === 'fuel_qty') {
            const re = /^[0-9\b]+$/
            if (value && !re.test(value)) {
                return
            }
        }
        setErrors({
            [`step_${step}`]: fields,
        })
        if (e?.target) {
            if (e?.target?.name.includes('is')) {
                updateParams([{ name: e?.target?.name, value: e?.target?.checked }])
            } else {
                updateParams([{ name: e?.target?.name, value: e?.target?.value }])
            }
        } else {
            updateParams([{ name: e.name, value: e.url }])
        }
    }

    const handleConfirmChange = (e: any) => {
        setErrors({
            [`step_${step}`]: fields,
        })
        const { name, value } = e.target
        updateParams([{ [name]: value }])
        setTotalMeta({ ...total_meta, [name]: value })
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

    const validate = (parameters: any, rule: any, steps: any) => {
        const validator = new Validator(parameters, rule, steps)

        if (validator.fails()) {
            const fieldErrors: any = {}

            /* eslint-disable */
            for (const key in validator.errors.errors) {
                fieldErrors[key] = validator.errors.errors[key][0]
            }
            /* eslint-enable */
            console.log(fieldErrors)
            setErrors({
                [`step_${step}`]: fieldErrors,
            })

            return false
        }
        setErrors({})
        return true
    }

    const SaveOrderDetails = async () => {
        const newrules = rules[`step_${step}`]
        if (!validate(params[`step_${step}`], newrules, step)) {
            const err = Object.keys(errors.step_1)
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

        setButtonDisable({ ...buttonDisable, details: true })

        let payload = params?.step_1

        if (TimeSlots) {
            let timeStamp = TimeSlots.find((x: any) => x.id === payload.time_slot_id)
            if (timeStamp) {
                payload['time_slot'] = `${timeStamp.start} to ${timeStamp.end}`
            }
        }

        await axiosInstance
            .post('/admin/orders', params?.step_1)
            .then((response) => {
                setButtonDisable({ ...buttonDisable, details: false })
                setResponse(response?.data?.data?.order)
                showToastMessage(response?.data?.data?.message, 'success')
                setSaveExit(false)
                setCancel(false)
                if (!saveExit) {
                    handleNext()
                    setStep(2)
                } else {
                    handleClickOpen('warning', false)
                    handleClickOpen('success', true)
                }
                let order = response.data.data.order

                setOrder(order)
                setTotalMeta({
                    total_amount: order.total_amount,
                    per_litre_cost: order.per_litre_cost,
                    delivery_charges: order.delivery_charges || 0.0,
                    fuel_qty: order.fuel_qty,
                    discount: order.discount || 0,
                    grand_total: order.grand_total,
                    discount_type: order.discount_type || 'Percentage',
                    payment_type: order.customer.is_credit_availed ? 'Credit' : '',
                    additional_notes: order.additional_notes,
                    discount_amount: '',
                    sub_total:Number(order.per_litre_cost) * Number(order.fuel_qty)
                })
            })
            .catch((error) => {
                setButtonDisable({ ...buttonDisable, details: false })

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

    const ConfirmOrder = async () => {
        // e.preventDefault()
        const formdata = {
            ...total_meta,
        }

        console.log(formdata, 'formdata')

        const fieldrules = {
            payment_type: 'required',
        }

        if (!validate(total_meta, fieldrules, step)) {
            const err = Object.keys(errors.step_2)
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

        setButtonDisable({ ...buttonDisable, confirmation: true })

        if (order) {
            await axiosInstance
                .put(`/admin/orders/edit-price/${order?.id}`, formdata)
                .then((response) => {
                    console.log('Payment done', response?.data)

                    setButtonDisable({ ...buttonDisable, confirmation: false })

                    let order = response.data.data.order
                    setOrder(order)

                    setTotalMeta({
                        total_amount: order.total_amount,
                        per_litre_cost: order.per_litre_cost,
                        delivery_charges: order.delivery_charges || 0.0,
                        fuel_qty: order.fuel_qty,
                        discount: order.discount || 0,
                        grand_total: order.grand_total,
                        discount_type: order.discount_type || 'Percentage',
                        payment_type: order.payment_type,
                        additional_notes: order.additional_notes,
                        discount_amount: '',
                        sub_total:Number(order.per_litre_cost) * Number(order.fuel_qty)
                    })

                    // alert('Payment edited');
                    setSaveExit(false)
                    setCancel(false)
                    if (!saveExit) {
                        handleNext()
                        setStep(3)
                    } else {
                        handleClickOpen('warning', false)
                        handleClickOpen('success', true)
                    }
                })
                .catch((error) => {
                    setButtonDisable({ ...buttonDisable, confirmation: false })
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

    const GeneratePI = (e: any) => {
        e.preventDefault()
        setButtonDisable({ ...buttonDisable, proforma: true })
        handleClickOpen('warning', true)
    }

    const onCancel = () => {
        handleClickOpen('warning', true)
        setButtonDisable({ ...buttonDisable, proforma: false })
        setSaveExit(false)
        setCancel(true)
    }

    const handleSaveExit = () => {
        if (step === 1) {
            const newrules = rules[`step_${step}`]
            if (validate(params[`step_${step}`], newrules, step)) {
                handleClickOpen('warning', true)
                setSaveExit(true)
                setCancel(false)
            }
        } else {
            const Rules = {
                payment_type: 'required',
                additional_notes: 'required|max:500',
            }

            if (validate(paymentfields, Rules, step)) {
                handleClickOpen('warning', true)
                setSaveExit(true)
                setCancel(false)
            }
        }
    }

    const handleClickOpen = (key: any, value: any) => {
        setOpen({ ...open, [key]: value })
    }

    const Confirmation = async () => {
        // console.log('confimerd');
        handleNext()
        if (cancel) {
            navigate('/sales/orders')
        } else if (saveExit) {
            /* eslint-disable */
            step === 1 ? SaveOrderDetails() : ConfirmOrder()
            /* eslint-enable */
        } else {
            handleClickOpen('success', true)
        }
    }

    const handleOkay = () => {
        navigate('/sales/orders')
    }

    const [discountPopup, setDiscountPopup] = useState(false)
    const [editPricePopup, setEditPricePopup] = useState(false)

    const openAddDiscountPopup = () => {
        setDiscountPopup(true)
    }
    const closeAddDiscountPopup = () => {
        setTodayValue({
            ...todayValue,
            grand_total: paymentfields?.grand_total,
            discount: paymentfields?.discount,
            total_amount: paymentfields?.total_amount,
            discount_type: paymentfields?.discount_type,
        })

        setDiscountPopup(false)
    }

    const openEditPricePopup = () => {
        setEditPricePopup(true)
    }
    const closeEditPricePopup = () => {
        setTodayValue({
            ...todayValue,
            grand_total: paymentfields?.grand_total,
            total_amount: paymentfields?.total_amount,
            per_litre_cost: paymentfields?.per_litre_cost,
        })

        setEditPricePopup(false)
    }
    return (
        <>
            <form>
                {step === 1 ? (
                    <OrderDetails
                        updateParams={updateParams}
                        UpdateExtraParams={UpdateExtraParams}
                        extraParams={extraParams}
                        setExtraParams={setExtraParams}
                        params={params}
                        handleChange={handleChange}
                        errors={errors}
                        SaveOrderDetails={SaveOrderDetails}
                        onCancel={onCancel}
                        handleSaveExit={handleSaveExit}
                        buttonDisable={buttonDisable}
                        setButtonDisable={setButtonDisable}
                    />
                ) : step === 2 ? (
                    <OrderConfirmation
                        todayValue={todayValue}
                        discountPopup={discountPopup}
                        editPricePopup={editPricePopup}
                        openAddDiscountPopup={openAddDiscountPopup}
                        closeAddDiscountPopup={closeAddDiscountPopup}
                        openEditPricePopup={openEditPricePopup}
                        closeEditPricePopup={closeEditPricePopup}
                        setPaymentFields={setPaymentFields}
                        total_meta={total_meta}
                        handlePaymentFields={handlePaymentFields}
                        params={params}
                        handleChange={handleConfirmChange}
                        handlePriceEdit={handlePriceEdit}
                        handleStep={handleStep}
                        errors={errors}
                        ConfirmOrder={ConfirmOrder}
                        handleBack={handleBack}
                        handleSaveExit={handleSaveExit}
                        order={order}
                        setTotalMeta={setTotalMeta}
                        setButtonDisable={setButtonDisable}
                        buttonDisable={buttonDisable}
                    />
                ) : (
                    <Proforma
                        total_meta={total_meta}
                        order={order}
                        response={response}
                        handleStep={handleStep}
                        GeneratePI={GeneratePI}
                        handleBack={handleBack}
                        setButtonDisable={setButtonDisable}
                        buttonDisable={buttonDisable}
                    />
                )}
            </form>

            <div className=''>
                <Popup
                    Confirmation={Confirmation}
                    handleNo={() => {
                        setButtonDisable({ ...buttonDisable, proforma: false })
                        handleClickOpen('warning', false)
                    }}
                    open={open?.warning}
                    handleClickOpen={handleClickOpen}
                    popup='warning'
                    subtitle={`${
                        cancel ? 'Changes are not saved !' : 'Confirm and Generate PI! ?'
                    }`}
                    popupmsg={`${
                        cancel
                            ? 'Do you want to Proceed without Saving the Details ?'
                            : 'Do you want to Proceed confirming PI ?'
                    }`}
                />
                <Popup
                    Confirmation={Confirmation}
                    open={open?.success}
                    handleClickOpen={handleClickOpen}
                    popup='success'
                    subtitle='Successfully Created!!'
                    popupmsg={`Order with ID No. #SO ${order?.id}
                     is Created Scuccessfully.`}
                    handleOkay={handleOkay}
                />
            </div>
        </>
    )
}

export default Form
