import { DateRangePicker } from '../../../components/common/input/DateRangePicker';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import TripsTable from './TripsAnalytics';
import FuelTable from './FuelAnalytics';
import AccountsTable from './AccountAnalytics';
import AmountReceivables from './AmountReceivables';
import { DateFiter } from '../../../components/common/DateFiter';
import axiosInstance from '../../../utils/axios';
import Chart from './Chartt';
import { CircularProgress } from '@mui/material';

const Home = () => {

    const [TripStats, setTripStats] = useState([])
    const [customerStats, setCustomerStats] = useState([])
    const [leadsStats, setleadsStats] = useState([])
    const [fuelStats, setFuelStats] = useState([])
    const [accountStats, setAccountStats] = useState([])
    const [invoices, setInvoices] = useState()
    const [date, setDate] = useState({
        start_date: '',
        end_date: ''
    })
    const [leads, setLeads] = useState({
        start_date: '',
        end_date: ''
    })

    const [fuel, setFuel] = useState({
        start_date: '',
        end_date: ''
    })
    const [accounts, setaccounts] = useState({
        start_date: '',
        end_date: ''
    })
    const onDateSelect = (date: any) => {
        setDate(date)
    };

    const onLeadsDateSelect = (date: any) => {
        setLeads(date)
    };

    const onFuelDateSelect = (date: any) => {
        setFuel(date)
    };

    const onAccountsDateSelect = (date: any) => {
        setaccounts(date)
    };

    const fetchTripsStats = () => {
        axiosInstance.get(`/admin/dashboard/trip-stats?start_date=${date.start_date}&end_date=${date.end_date}`).then((res) => {
            setTripStats(res?.data?.data)

        }).catch((err) => {

        })
    }


    const fecthAccountsStats = () => {
        axiosInstance.get(`/admin/dashboard/account-stats?start_date=${date.start_date}&end_date=${date.end_date}`).then((res) => {
            setAccountStats(res?.data?.data)
            console.log(res?.data?.data)
        }).catch((err) => {

        })
    }


    const fetchFuelStats = () => {
        axiosInstance.get(`/admin/dashboard/fuel-stats?start_date=${fuel.start_date}&end_date=${fuel.end_date}`).then((res) => {
            setFuelStats(res?.data?.data)

        }).catch((err) => {

        })
    }


    const fetchDues = () => {
        axiosInstance.get(`/admin/dashboard/unpaid-stats?start_date=${fuel.start_date}&end_date=${fuel.end_date}`).then((res) => {
            // setFuelStats(res?.data?.data)
            setInvoices(res?.data)
            console.log(res?.data)

        }).catch((err) => {

        })
    }

    const fetchLeadCustomer = () => {
        axiosInstance.get(`/admin/dashboard/cust-vs-leads?start_date=${leads.start_date}&end_date=${leads.end_date}`).then((res) => {
            let list = res?.data?.data;
            let customer = list.map((customer) => {
                return customer?.customer_count
            })
            setCustomerStats(customer)
            let lead = list.map((lead) => {
                return lead?.lead_count
            })
            setleadsStats(lead)
        }).catch((err) => {

        })
    }

    useEffect(() => {
        fetchTripsStats()
    }, [date])

    useEffect(() => {
        fetchLeadCustomer()
    }, [leads])

    useEffect(() => {
        fetchFuelStats()
    }, [fuel])

    useEffect(() => {
        fecthAccountsStats()
    }, [accounts])

    useEffect(() => {
        fetchDues()
    }, [])
    return (
        <div className="container">
            <div className='flex flex-col'>

                <div className='mobileView bg-lightbg mb-6'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='subheading filters'>Comparision Chart</p>
                        </div>
                        <div className='h-8'>
                            <DateFiter onDateRangeSelect={onLeadsDateSelect} /></div>
                    </div>
                    <div className='mt-4 bg-darkbg rounded-md'>

                        {
                            customerStats.length > 0 ? <Chart data1={customerStats} data2={leadsStats}
                                labels={["1/2", "1/4", "1/6", "1/8", "1/9", "1/2"]}
                            /> : <div className='w-full h-96 flex justify-center items-center'>
                                <CircularProgress />
                                <span className='text-3xl'>Loading...</span>
                            </div>
                        }

                    </div>

                </div>



                <div className='mobileView bg-lightbg mb-6'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='subheading filters'>Trips Analytics</p>
                        </div>
                        <div className='h-8'> <DateFiter onDateRangeSelect={onDateSelect} /></div>
                    </div>
                    {
                        TripStats.length > 0 ? <div className='mt-4'><TripsTable rows={TripStats} /></div> : <div className='w-full h-96 flex justify-center items-center'>
                            <CircularProgress />
                            <span className='text-3xl'>Loading...</span>
                        </div>
                    }


                </div>



                <div className='mobileView bg-lightbg mb-6'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='subheading filters'>Fuel Statistics</p>
                        </div>
                        <div className='h-8'> <DateFiter onDateRangeSelect={onFuelDateSelect} /></div>
                    </div>
                    {
                        fuelStats.length > 0 ? <div className='mt-4'><FuelTable rows={fuelStats} /></div> :
                            <div className='w-full h-96 flex justify-center items-center'>
                                <CircularProgress />
                                <span className='text-3xl'>Loading...</span>
                            </div>
                    }


                </div>



                <div className='mobileView bg-lightbg mb-6'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='subheading filters'>Account Statistics</p>
                        </div>
                        <div className='h-8'> <DateFiter onDateRangeSelect={onAccountsDateSelect} /></div>
                    </div>
                    {
                        accountStats.length > 0 ? <div className='mt-4'><AccountsTable rows={accountStats} /></div> : <div className='w-full h-96 flex justify-center items-center'>
                            <CircularProgress />
                            <span className='text-3xl'>Loading...</span>
                        </div>
                    }


                </div>
                <div>
                    <AmountReceivables data={invoices} />
                </div>
                <div></div>

            </div>
        </div>
    );
};

export default Home;


