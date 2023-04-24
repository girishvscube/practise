import { useState, useEffect, useMemo } from 'react'
import CustomButton from '../../../common/Button'
import Profile from '../../../../assets/images/Profile.svg'
import { SelectInput } from '../../../common/input/Select'
import { Input } from '../../../common/input/Input'
import { useNavigate } from 'react-router-dom'
import OrderTable from './OrderTable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrdersList, fetchOrderCount } from '../../../../features/orders/orderSlice'
import CircularProgress from '@mui/material/CircularProgress'
import NotFound from '../../../../assets/images/NotFound.svg'
import orderplaced from '../../../../assets/images/orderplaced.svg'
import ordersDelivered from '../../../../assets/images/ordersDelivered.svg'
import orderInProgress from '../../../../assets/images/orderInProgress.svg'
import fuelsDelivered from '../../../../assets/images/fuelsDelivered.svg'
import Card from '../../leads/LeadListing/Card'
import { DateRangePicker } from '../../../common/input/DateRangePicker'
import FilterLight from '../../../../assets/images/FilterLight.svg'
import moment from 'moment'

import { getRoleList, getOrderStatusList } from '../../../../features/dropdowns/dropdownSlice'
import { CountItems } from '../../../../utils/helpers'
import { Pagination } from './../../../common/Pagination/Pagination'
import { DateFiter } from './../../../common/DateFiter'
import Badge from '@mui/material/Badge'

const cols = [
  {
    title: 'Ord. ID',
  },
  {
    title: 'Order Created on',
  },
  {
    title: 'Customer Name/Phone',
  },
  {
    title: 'Delivery Time',
  },
  {
    title: 'Order Quantity (in liters)',
  },
  {
    title: 'Sales Executive',
  },
  {
    title: 'Payment Status',
  },
  {
    title: 'Order Status',
  },
  {
    title: 'Action',
  },
]

const OrdersListing = () => {
  const { roles, orderStatusList } = useSelector((state: any) => state.dropdown)
  const { ordersList, listPending, orderCount } = useSelector((state: any) => state.order)
  console.log('listPending:', listPending)

  const [currentPage, setCurrentPage] = useState(1)
  const { metadata } = useSelector((state: any) => state.order)

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const dispatch = useDispatch()

  const [filter, setFilter] = useState(false)
  const [filtersCount, setFiltersCount] = useState(0)
  const [applyFilter, setApplyFilter] = useState(false)
  const initalStates = {
    searchText: '',
    status: '',
    salesExecutive: '',
    start_date: '',
    end_date: '',
  }
  const [params, setParams] = useState(initalStates)
  const [analyticsrange, setAnalyticsRange] = useState(0)

  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })
  const onDateSelect = (date: any) => {
    setDate(date)
  }

  const handleActivateFilter = () => {
    setFilter(!filter)
  }
  const handleCancel = () => {
    setFiltersCount(0)
    setParams({
      searchText: '',
      status: '',
      salesExecutive: '',
      start_date: '',
      end_date: '',
    })
    dispatch(
      fetchOrdersList(currentPage, {
        searchText: '',
        status: '',
        salesExecutive: '',
        start_date: '',
        end_date: '',
      }),
    )
    const reset: any = ''
    setStartDate(reset)
    setEndDate(reset)
    setApplyFilter(false)
  }

  const handleSubmit = () => {
    setApplyFilter(true)
    dispatch(fetchOrdersList(1, params))
    const count = CountItems(params)
    console.log(isdate(params), 'isdate')
    isdate(params) ? setFiltersCount(count - 1) : setFiltersCount(count)
  }

  const isdate = (params: any) => {
    for (let key in params) {
      if (params[key].toString().includes('-')) return true
    }
  }

  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value })
    setApplyFilter(false)
  }

  useEffect(() => {
    dispatch(fetchOrdersList(currentPage, params))
    dispatch(getRoleList())
    dispatch(getOrderStatusList())
  }, [currentPage])

  useMemo(() => {
    dispatch(fetchOrderCount(date.start_date, date.end_date))
  }, [date])

  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    const sDate = moment(start).format('YYYY-MM-DD')
    const eDate = moment(end).format('YYYY-MM-DD')
    setParams({ ...params, start_date: sDate, end_date: eDate })
  }

  const navigate = useNavigate()

  return (
    <div className=''>
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Order Analytics</p>
        <div className='hidden sm:block'>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>
      <div className='w-full sm:hidden '>
        <br />
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>

      <br />

      <div className='grid sm:grid-cols-4 grid-cols-1 gap-4 '>
        <Card text='Total Orders Placed' value={orderCount?.total?.count} image={orderplaced} />
        <Card
          text='Total Orders Delivered'
          value={orderCount?.delivered?.count || 0}
          image={ordersDelivered}
        />
        <Card
          text='Total Orders In-Progress'
          value={orderCount?.in_progress?.count || 0}
          image={orderInProgress}
        />
        <Card
          text='Total Fuels Delivered'
          value={orderCount?.delivered?.count || 0}
          image={fuelsDelivered}
        />
      </div>

      <div className='mt-7 flex justify-between flex-col sm:flex-row'>
        <div>
          <p className='text-xl font-extrabold text-white font-nunitoRegular'>Orders List</p>
          <hr className='w-32 md:w-full line' />
          <p className='text-xs font-nunitoRegular mt-1 font-normal'>
            Total Orders: {metadata?.totalorders}
          </p>
        </div>
        <br />

        <div className=' relative flex justify-between sm:justify-end gap-6 '>
          <div className='absolute left-0 -top-2'>
            <Badge
              color='secondary'
              className='text-black'
              badgeContent={filtersCount}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            />
          </div>
          <CustomButton
            borderRadius='0.5rem'
            onClick={handleActivateFilter}
            variant='outlined'
            size='large'
            icon={<img src={FilterLight} alt='' />}
          >
            <p className='font-bold text-yellow font-nunitoRegular text-sm'>Filter</p>
          </CustomButton>
          <CustomButton
            borderRadius='0.5rem'
            onClick={() => {
              navigate('/sales/orders/create')
            }}
            variant='contained'
            size='large'
            icon={<img src={Profile} alt='' />}
          >
            <p className='  font-bold text-darkbg font-nunitoRegular text-sm '>Create New Order</p>
          </CustomButton>
        </div>
      </div>
      {filter === true ? (
        <>
          <div className='mt-4 sm:flex-row flex-col gap-2 flex filters items-center '>
            <div className='w-full lg:w-[300px]'>
              <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
            </div>

            <div className='w-full  sm:w-[200px]'>
              <SelectInput
                width='100%'
                options={orderStatusList}
                handleChange={handleSearch}
                value={params.status}
                label='Status'
                name='status'
              />
            </div>

            <div className='w-full  sm:w-[200px]'>
              <SelectInput
                width='100%'
                options={roles}
                handleChange={handleSearch}
                value={params.salesExecutive}
                label='Sales Executive'
                name='salesExecutive'
              />
            </div>
            <div className='w-full  sm:w-[30%]'>
              <Input
                rows={1}
                width='w-full'
                disabled={false}
                readOnly={false}
                value={params.searchText}
                handleChange={handleSearch}
                label='Search'
                name='searchText'
              />
            </div>
            <div className='sm:w-44 w-full gap-2 flex  justify-end '>
              <CustomButton
                borderRadius='8px'
                disabled={CountItems(params) === 0}
                onClick={handleSubmit}
                width='w-[130px]'
                variant='outlined'
                size='large'
              >
                Apply Filter
              </CustomButton>
              <button
                disabled={CountItems(params) === 0}
                className='flex items-end underline'
                onClick={handleCancel}
              >
                Reset
              </button>
            </div>
          </div>
        </>
      ) : null}

      {ordersList?.length > 0 ? (
        <p className='mt-2 text-[#6A6A78] text-xs font-nunitoRegular font-normal'>
          Showing <span className='text-white'>{ordersList.length + (currentPage - 1) * 10}</span>{' '}
          out of <span className='text-white'>{metadata.totalorders}</span> results
        </p>
      ) : null}

      {listPending ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : ordersList?.length > 0 ? (
        <div>
          <div className='w-full  bg-[#404050] rounded-lg mt-[16px]'>
            <OrderTable cols={cols} data={ordersList} />
          </div>

          <div className='w-full p-4 flex justify-center gap-10'>
            <Pagination
              className='pagination-bar'
              currentPage={currentPage}
              totalCount={metadata?.totalorders}
              pageSize={10}
              onPageChange={(page: any) => setCurrentPage(page)}
            />
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center flex-col gap-4 mt-6'>
          <img src={NotFound} alt='' />
          <p className='text-[18px] font-nunitoBold'>No Results found !!</p>
        </div>
      )}
    </div>
  )
}

export default OrdersListing
