import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import axiosInstance from '../../../../utils/axios'
import moment from 'moment'

import { Input } from '../../../common/input/Input'
import { SelectInput } from '../../../common/input/Select'
import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import CreatePocModal from './CreatePocModal'
import CreateDeliveryModal from './CreateDeliveryModal'
import { MultiSelectInput } from '../../../common/input/MultiSelect'
import CommonDatepicker from './../../../common/input/Datepicker'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import { uuid } from './../../../../utils/helpers'
import {
    getTimeSlotList,
    getCustomersDropdown,
    getpocDropdown,
    getdeliveryDropdown,
    getorderTypeDropdown,
} from '../../../../features/dropdowns/dropdownSlice'
import { resetCreateProgress } from '../../../../features/customer/deliverySlice'
import { menuStyles, useSelectStyles } from '../../../../utils/helpers'

const useStyles = makeStyles({
    error: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red',
            borderRadius: '8px',
        },
    },
    select: {
        '& ul': {
            backgroundColor: 'rgba(255, 255, 255, 0.1);',
        },
        '& li': {
            backgroundColor: '#2F3344',
        },
    },
    icon: {
        fill: 'white',
    },
    root: {
        '& .MuiOutlinedInput-input': {
            color: '#FFFF',
        },
        '& .MuiInputLabel-root': {
            color: '#6A6A78',
        },
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#404050',
            borderRadius: '8px',
        },
        '&:hover .MuiOutlinedInput-input': {
            color: '#FFFF',
        },
        '&:hover .MuiInputLabel-root': {
            color: '#6A6A78',
        },

        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFFF',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
            color: '#FFFF',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#FFCD2C',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFCD2C',
        },
    },
})

interface Props {
    params: any
    handleChange: any
    SaveOrderDetails: any
    errors: any
    onCancel?: any
    handleSaveExit: any
    UpdateExtraParams: any
    extraParams: any
    setExtraParams: any
    updateParams: any
    buttonDisable: any
    setButtonDisable: any
}
const OrderDetails: React.FC<Props> = ({
    handleChange,
    params,
    SaveOrderDetails,
    errors,
    onCancel,
    handleSaveExit,
    UpdateExtraParams,
    extraParams,
    setExtraParams,
    updateParams,
    buttonDisable,
    setButtonDisable,
}) => {
    // States👇
    const { TimeSlots, customersdropdown, deliveryDropdown, pocDropdown, orderTypeDropdown } =
        useSelector((state: any) => state.dropdown)
    const { createSuccess } = useSelector((state: any) => state.poc)
    const { iscreateSuccess } = useSelector((state: any) => state.delivery)
    const dispatch = useDispatch()

    const [executive, setExecutive] = useState([])
    const [ispocmodal, setpocModel] = useState(false)
    const [isDelmodal, setdelModel] = useState(false)

    const [customerErr, setCustomerErr] = useState(false)

    // Functions👇
    const OpenCreatePOCModal = () => {
        !params.step_1.customer_id ? setCustomerErr(true) : setpocModel(true)
    }
    const CloseCreatePOCModal = () => {
        setpocModel(false)
    }
    const OpenCreateDeliveryModal = () => {
        !params.step_1.customer_id ? setCustomerErr(true) : setdelModel(true)
    }
    const CloseCreateDeliveryModal = () => {
        setdelModel(false)
    }
    const getExecutivelist = async () => {
        await axiosInstance('/admin/users/dropdown')
            .then((response) => {
                setExecutive(response?.data?.data)
            })
            .catch(() => {
                // console.log(error);
            })
    }

    useEffect(() => {
        if (params.step_1.customer_id && customerErr) {
            setCustomerErr(false)
        }
    }, [params.step_1.customer_id])

    // UseEffects👇
    useEffect(() => {
        getExecutivelist()
        dispatch(getTimeSlotList())
        dispatch(getCustomersDropdown())
        dispatch(getorderTypeDropdown())
    }, [])

    useEffect(() => {
        if (params?.step_1?.poc_ids.length > 0) {
            const pocnames: any = []
            const pocids = params?.step_1?.poc_ids
            for (let id in pocids) {
                pocDropdown ??
                    [
                        {
                            id: 1,
                            poc_name: 'poc1',
                        },
                        {
                            id: 2,
                            poc_name: 'poc2',
                        },
                    ].filter((item: any) => {
                        if (item.id === +id) pocnames.push(item.poc_name)
                    })
            }

            // console.log('pocnames:', pocnames)
        }
    }, [params?.step_1?.poc_ids])

    useEffect(() => {
        params?.step_1?.customer_id && dispatch(getpocDropdown(params?.step_1?.customer_id))
    }, [createSuccess])

    useEffect(() => {
        if (iscreateSuccess === true) {
            params?.step_1?.customer_id &&
                dispatch(getdeliveryDropdown(params?.step_1?.customer_id))
            dispatch(resetCreateProgress())
            CloseCreateDeliveryModal()
        }
    }, [iscreateSuccess])

    useEffect(() => {
        console.log(params?.step_1?.customer_id, 'https://goo.gl/maps/i7JHQoga7knxdfym9')
        dispatch(getCustomersDropdown())

        if (params?.step_1?.customer_id) {
            dispatch(getpocDropdown(params?.step_1?.customer_id))
            dispatch(getdeliveryDropdown(params?.step_1?.customer_id))

            const customer = customersdropdown.find(
                (c: any) => c?.id === params?.step_1?.customer_id,
            )
            setExtraParams({
                ...extraParams,
                customer_name: customer?.company_name,
                email: customer?.email,
                phone: customer?.phone,
            })
        }
    }, [params?.step_1?.customer_id])

    const classes = useStyles()
    return (
        <div className='divstyles bg-lightbg'>
            <div className='relative '>
                <HeadingTab title='Select Customer' />
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
                    <FormControl
                        className={!errors?.step_1?.customer_id ? classes.root : classes.error}
                        fullWidth
                        error={!!errors?.step_1?.customer_id}
                    >
                        <InputLabel id='select-input-label'>Select Customer</InputLabel>
                        <Select
                            labelId='select-input-label'
                            MenuProps={menuStyles}
                            sx={{
                                color: 'white',
                                '.MuiSvgIcon-root ': {
                                    fill: 'white !important',
                                },
                            }}
                            required={true}
                            value={params?.step_1?.customer_id}
                            onChange={handleChange}
                            label='Select Customer ID'
                            name='customer_id'
                            error={!!errors?.step_1?.customer_id}
                            fullWidth
                        >
                            {customersdropdown.length > 0 ? (
                                customersdropdown?.map((item: any) => (
                                    <MenuItem key={uuid()} value={item.id}>
                                        {item?.company_name},&nbsp;
                                        {item?.phone}
                                    </MenuItem>
                                ))
                            ) : (
                                <p className='text-white p-4 text-xl'>No Customers Found</p>
                            )}
                        </Select>
                        <FormHelperText>{errors?.step_1?.customer_id}</FormHelperText>
                    </FormControl>

                    <Input
                        rows={1}
                        width='w-full'
                        readOnly
                        handleChange={UpdateExtraParams}
                        value={extraParams?.customer_name}
                        label='Customer Name'
                        name='customer_name'
                    />
                    <Input
                        rows={1}
                        width='w-full'
                        readOnly
                        handleChange={UpdateExtraParams}
                        value={extraParams?.email}
                        label='Email ID'
                        name='email'
                    />
                    <Input
                        rows={1}
                        width='w-full'
                        readOnly
                        handleChange={UpdateExtraParams}
                        value={extraParams?.phone}
                        label='Phone Number'
                        name='phone'
                    />
                </div>
            </div>

            <br />

            <div>
                <HeadingTab title='POC Details' />
                <MultiSelectInput
                    handleChange={handleChange}
                    value={params?.step_1?.poc_ids}
                    label='Select'
                    error={errors?.step_1?.poc_ids?.length > 0}
                    helperText={errors?.step_1?.poc_ids}
                    options={pocDropdown}
                    width={window.innerWidth < 768 ? '100%' : '50%'}
                    name='poc_ids'
                />
                <br />
                <div className='flex gap-4 items-center'>
                    <CreatePocModal
                        open={ispocmodal}
                        handleClickOpen={OpenCreatePOCModal}
                        handleClose={CloseCreatePOCModal}
                        customer_id={params?.step_1?.customer_id}
                    />

                    <p className=''>{customerErr ? 'Please Select Customer First !' : ''}</p>
                </div>
            </div>
            <br />

            <div>
                <HeadingTab title='Delivery Location' />
                <FormControl
                    className={!errors?.step_1?.customer_delivery_id ? classes.root : classes.error}
                    fullWidth
                    error={errors?.step_1?.customer_delivery_id}
                >
                    <InputLabel id='select-input-label'>Select Delivery Location</InputLabel>
                    <Select
                        labelId='select-input-label'
                        style={{
                            width: window.innerWidth < 768 ? '100%' : '50%',
                        }}
                        MenuProps={menuStyles}
                        sx={{
                            color: 'white',
                            '.MuiSvgIcon-root ': {
                                fill: 'white !important',
                            },
                        }}
                        required={true}
                        value={params?.step_1?.customer_delivery_id}
                        onChange={handleChange}
                        label='Select Delivery Location'
                        name='customer_delivery_id'
                        error={errors?.step_1?.customer_delivery_id}
                        fullWidth
                    >
                        {params?.step_1?.customer_id && deliveryDropdown.length > 0 ? (
                            deliveryDropdown?.map((item: any) => (
                                <MenuItem key={uuid()} value={item.id}>
                                    {item?.address_1},&nbsp;
                                    {item?.address_2},&nbsp;
                                    {item?.state},&nbsp;
                                    {item?.pincode}.
                                </MenuItem>
                            ))
                        ) : (
                            <p className='text-white p-4 text-xl'>
                                {!params?.step_1?.customer_id
                                    ? 'Please select customer first.'
                                    : 'Delivery addresses not found !'}
                            </p>
                        )}
                    </Select>
                    <FormHelperText>{errors?.step_1?.customer_delivery_id}</FormHelperText>
                </FormControl>{' '}
                <br />
                <br />
                <div className='flex gap-4 items-center'>
                    <CreateDeliveryModal
                        open={isDelmodal}
                        handleClickOpen={OpenCreateDeliveryModal}
                        handleClose={CloseCreateDeliveryModal}
                        customer_id={params?.step_1?.customer_id}
                        dropdownOptions={pocDropdown}
                    />
                    <p>{customerErr ? 'Please Select Customer First !' : ''}</p>
                </div>
            </div>
            <br />

            <div>
                <HeadingTab title='Order  Details' />
                <div className='grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]'>
                    <SelectInput
                        width='100%'
                        options={orderTypeDropdown}
                        error={errors?.step_1?.order_type}
                        helperText={errors?.step_1?.order_type}
                        handleChange={handleChange}
                        value={params?.step_1?.order_type}
                        label='Select Order Type'
                        name='order_type'
                    />

                    <CommonDatepicker
                        error={errors?.step_1?.delivery_date}
                        label='Select Delivery Date'
                        onChange={(e: any) => {
                            updateParams([
                                { name: 'delivery_date', value: moment(e).format('YYYY-MM-DD') },
                            ])
                        }}
                        value={params.step_1?.delivery_date}
                    />

                    <SelectInput
                        width='100%'
                        options={TimeSlots}
                        error={errors?.step_1?.time_slot_id}
                        helperText={errors?.step_1?.time_slot_id}
                        handleChange={handleChange}
                        value={params?.step_1?.time_slot_id}
                        label='Select Delivery Time Slot'
                        name='time_slot_id'
                    />

                    <Input
                        rows={1}
                        width='w-full'
                        error={errors?.step_1?.fuel_qty}
                        helperText={errors?.step_1?.fuel_qty === 0 ? '' : errors?.step_1?.fuel_qty}
                        handleChange={handleChange}
                        value={params?.step_1?.fuel_qty}
                        label='Enter Fuel Quantity (In litres)'
                        name='fuel_qty'
                    />
                </div>
            </div>

            <br />

            <br />

            <div>
                <HeadingTab title='Assign Sales Executive' />
                <div className=''>
                    <SelectInput
                        required
                        width={window.innerWidth < 768 ? '100%' : '50%'}
                        options={executive}
                        error={errors?.step_1?.sales_executive_id}
                        helperText={errors?.step_1?.sales_executive_id}
                        handleChange={handleChange}
                        value={params?.step_1?.sales_executive_id}
                        label='Assign Sales Executive'
                        name='sales_executive_id'
                    />
                </div>
            </div>

            <br />
            <br />

            {/* Navigation buttons for mobile devices */}
            <div className='sm:hidden flex gap-4 justify-between '>
                <CustomButton
                    disabled={buttonDisable.details}
                    borderRadius='0.5rem'
                    onClick={(e) => {
                        e.preventDefault()
                        onCancel()
                    }}
                    width='w-7/12 m-auto'
                    variant='outlined'
                    size='large'
                >
                    Cancel
                </CustomButton>
                <CustomButton
                    disabled={buttonDisable.details}
                    borderRadius='0.5rem'
                    onClick={SaveOrderDetails}
                    // width="w-[307px]"
                    width='w-full'
                    variant='contained'
                    size='large'
                >
                    Save and Next
                </CustomButton>
            </div>

            {/* NAavigation Buttons  for desktop*/}
            <div className='hidden  sm:flex justify-between'>
                <CustomButton
                    disabled={buttonDisable.details}
                    borderRadius='0.5rem'
                    onClick={(e) => {
                        e.preventDefault()
                        onCancel()
                    }}
                    width='w-fit'
                    variant='outlined'
                    size='large'
                >
                    Cancel
                </CustomButton>

                <CustomButton
                    disabled={buttonDisable.details}
                    borderRadius='0.5rem'
                    onClick={SaveOrderDetails}
                    // width="w-[307px]"
                    width='w-fit'
                    variant='contained'
                    size='large'
                >
                    Save and Next
                </CustomButton>
            </div>
        </div>
    )
}

export default OrderDetails
