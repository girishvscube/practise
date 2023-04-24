import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import Tab from './Tab/Tab'
import OrderStatus from './OrderStatus'
import DelLocationsList from './DelLocationsList'
import PocList from './PocList'
import TicketDetails from './TicketDetails'
import CustomerDetails from './CustomerDetails'
import OrderInfo from './OrderInfo'
import {
    TicketStatusList,
    fetchTicketById,
    setFetchTicketStatus,
    ticketStatusUpdation,
    updateStateStatus,
} from '../../../../features/support/supportSlice'
import OrderTracking from './OrderTracking'
import PriceInfo from './PriceInfo'
import PaymentsAndInvoice from './PaymentsAndInvoice'

import Validator from 'validatorjs'
import { toast } from 'react-toastify'
import { decryptData } from '../../../../utils/encryption'
import CircularProgress from '@mui/material/CircularProgress'
import Logs from '../../../common/Logs'

const initialValues = {
    status: '',
    callback_time: '',
    notes: '',
    sales_id: '',
}
const ViewTicket = () => {
    /* eslint-disable*/
    const dispatch = useDispatch()
    const { id } = useParams()
    const ticketId: any = id
    const {
        ticketByid,
        isStatusUpdateSuccess,
        statusList,
        fetchTicketByIdStatus,
        statusUpdation,
        isLoading,
    } = useSelector((state: any) => state.support)
    const { customerDetails } = useSelector((state: any) => state.customer)
    const [params, setParams] = useState(initialValues)
    const [showStatus, setShowStatus] = useState('')
    const [formErrors, setFormErrors] = useState(initialValues)
    console.log(ticketByid)

    /* eslint-enable */
    const TabConstants = [
        {
            title: 'Order & Customer info',
        },
        {
            title: 'Price & Payment Details',
        },
        {
            title: 'Order Tracking',
        },
        {
            title: 'Activity Logs',
        },
    ]

    useEffect(() => {
        dispatch(TicketStatusList())
        dispatch(fetchTicketById(decryptData(id)))
    }, [id])

    useEffect(() => {
        if (statusUpdation === true) {
            dispatch(fetchTicketById(decryptData(id)))
            dispatch(updateStateStatus())
        }
    }, [statusUpdation])

    useEffect(() => {
        if (fetchTicketByIdStatus === true) {
            setParams(ticketByid?.data?.support_ticket)
            setShowStatus(ticketByid?.data?.support_ticket?.status)
            dispatch(setFetchTicketStatus())
        }
    }, [fetchTicketByIdStatus, isStatusUpdateSuccess])

    const handleChange = (event: any) => {
        setParams({ ...params, [event.target.name]: event.target.value })
    }

    const handleStatus = async () => {
        const rule = {
            callback_time: params.status.toLowerCase().includes('call') ? 'required' : '',
        }

        const validation = new Validator(params, rule)
        if (validation.fails()) {
            const fieldErrors: any = {}
            Object.keys(validation.errors.errors).forEach((key) => {
                fieldErrors[key] = validation.errors.errors[key][0]
            })

            setFormErrors(fieldErrors)
            return false
        }
        dispatch(ticketStatusUpdation(params, decryptData(ticketId)))
    }



    return (
        <>
            <BreadCrumb
                links={[
                    { path: 'Tickets', url: '/support/tickets' },
                    { path: 'View Ticket', url: '' },
                ]}
            />

            <p className='font-black mb-7'>View Ticket</p>

            {isLoading ? (
                <div className='w-full h-80 flex justify-center items-center'>
                    <CircularProgress />
                    <span className='text-3xl'>Loading...</span>
                </div>
            ) : (
                <div className='flex flex-col md:grid md:grid-cols-[20rem,minmax(670px,_1fr)] gap-5 '>
                    <div className='flex flex-col gap-5  '>
                        <TicketDetails ticketByid={ticketByid} />
                        <OrderStatus
                            showStatus={showStatus}
                            ticketId={ticketId}
                            handleChange={handleChange}
                            params={params}
                            ticketStatusList={statusList}
                            handleStatus={handleStatus}
                        />
                    </div>

                    <div className='flex flex-col gap-5 '>
                        <div className='rounded-lg custom-tab'>
                            <Tab
                                cols={TabConstants}
                                data={[
                                    <div className=''>
                                        <OrderInfo customerDetails={ticketByid} />

                                        <CustomerDetails customerDetails={ticketByid} />
                                        <div className='mb-4 mobileView bg-lightbg'>
                                            <p className='subheading'>POCs</p>
                                            <PocList
                                                orderId={
                                                    ticketByid?.data?.support_ticket?.order?.id
                                                }
                                            />
                                        </div>
                                        <DelLocationsList
                                            orderByid={ticketByid}
                                            deliveryList={ticketByid}
                                        />
                                    </div>,
                                    <div className=''>
                                        <PriceInfo
                                            orderByid={ticketByid}

                                        />
                                        <PaymentsAndInvoice
                                            orderByid={ticketByid}
                                        />
                                    </div>,
                                    <div className='divstyles  bg-lightbg  '>
                                        {/* <LogsInfo data={data} /> */}
                                        <OrderTracking />
                                    </div>,
                                    <Logs logs={ticketByid?.data?.support_ticket?.logs} />,
                                ]}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewTicket
