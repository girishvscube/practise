import { useState, useEffect, useMemo } from 'react'
import CustomButton from '../../../common/Button'
import Profile from '../../../../assets/images/Profile.svg'
import { SelectInput } from '../../../common/input/Select'
import { Input } from '../../../common/input/Input'
import { useNavigate } from 'react-router-dom'
import OrderTable from './Table'
import { useDispatch, useSelector } from 'react-redux'
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

import { getRoleList, fetchPoStatusDropdown } from '../../../../features/dropdowns/dropdownSlice'
import { CountItems } from '../../../../utils/helpers'
import { Pagination } from '../../../common/Pagination/Pagination'
import {
  fetchPurchaseOrdersList,
  purchaseOrderAnalytics,
} from '../../../../features/PurchaseOrders/purchaseOrderSlice'
import { DateFiter } from '../../../common/DateFiter'
import Badge from '@mui/material/Badge'

const cols = [
  {
    title: 'PO No',
  },
  {
    title: 'PO Created On',
  },
  {
    title: 'Suppliers Name',
  },
  {
    title: 'PO Quantity(in liters)',
  },
  {
    title: 'No of Orders Linked',
  },
  {
    title: 'PO Status',
  },
  {
    title: 'Action',
  },
]

const analyticsSort = [
  {
    id: '0',
    name: 'Today',
  },
  {
    id: '-1',
    name: 'Yesterday',
  },
  {
    id: '-7',
    name: 'Last 7 Days',
  },
  {
    id: '-30',
    name: 'Last 30 Days',
  },
  {
    id: 'TM',
    name: 'This Month',
  },
  {
    id: 'LM',
    name: 'Last Month',
  },
  {
    id: 'custom',
    name: 'Custom Date',
  },
]

const OrdersListing = () => {
  const { roles, PoStatusDropdown } = useSelector((state: any) => state.dropdown)
  const { list, isLoading, orderStats, metadata } = useSelector((state: any) => state.purchaseOrder)
  const [currentPage, setCurrentPage] = useState(1)
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

  const [analyticsDate, setAnalyticsDate] = useState({
    from: '',
    to: '',
  })

  const handleActivateFilter = () => {
    setFilter(!filter)
  }
  const handleCreate = () => {
    navigate('/purchase-orders/create')
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
      fetchPurchaseOrdersList(currentPage, {
        searchText: '',
        status: '',
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
    dispatch(fetchPurchaseOrdersList(1, params))
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
    dispatch(fetchPurchaseOrdersList(currentPage, params))
    dispatch(getRoleList())
    dispatch(fetchPoStatusDropdown())
  }, [currentPage])

  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    const sDate = moment(start).format('YYYY-MM-DD')
    const eDate = moment(end).format('YYYY-MM-DD')
    setParams({ ...params, start_date: sDate, end_date: eDate })
  }

  // Date range for leads Stats filteration

  const navigate = useNavigate()

  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })

  const onDateSelect = (date: any) => {
    setDate(date)
  }

  useMemo(() => {
    dispatch(purchaseOrderAnalytics(date.start_date, date.end_date))
  }, [date.end_date])

  return (
    <div className=''>
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Purchase Order Analytics</p>
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
        <Card
          text='Total Purchace Quantity'
          value={orderStats?.total_fuel_qty ?? 0}
          image={orderplaced}
        />
        <Card
          text='Total Delivered Quantity'
          value={orderStats?.fuel_delivered ?? 0}
          image={ordersDelivered}
        />
        <Card text='Total POs Raised' value={orderStats?.po_raised ?? 0} image={orderInProgress} />
        <Card text='Total POs Purchased' value={orderStats?.po_done ?? 0} image={fuelsDelivered} />
      </div>

      <div className='mt-3 flex justify-between flex-col sm:flex-row'>
        <div>
          <p className='text-xl	 font-extrabold text-white font-nunitoRegular'>
            List of Purchase Orders
          </p>
          <hr className='w-32 md:w-full line' />
          <p className='text-xs font-nunitoRegular mt-1 font-normal'>
            Total PO: {metadata?.totalorders}
          </p>
        </div>
        <br />

        <div className='relative flex justify-between sm:justify-end gap-6 '>
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
            onClick={handleCreate}
            borderRadius='0.5rem'
            variant='contained'
            size='large'
            icon={<img src={Profile} alt='' />}
          >
            <p className='  font-bold text-darkbg font-nunitoRegular text-sm'>Create New PO</p>
          </CustomButton>
        </div>
      </div>
      <br />
      {filter ? (
        <>
          <div className='mt-4 sm:flex-row flex-col gap-4 flex filters items-center '>
            <div className='w-full lg:w-[300px]'>
              <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
            </div>

            <div className='w-full  sm:w-[300px]'>
              <SelectInput
                width='100%'
                options={PoStatusDropdown}
                handleChange={handleSearch}
                value={params.status}
                label='Status'
                name='status'
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
            <div className='sm:w-44 w-full gap-4 flex  justify-end '>
              <CustomButton
                borderRadius='0.5rem'
                disabled={CountItems(params) === 0}
                onClick={handleSubmit}
                width='w-[130px]'
                variant='outlined'
                size='large'
              >
                Apply Filter
              </CustomButton>

              <button  disabled={CountItems(params) === 0} className=' flex items-end underline' onClick={handleCancel}>
                Reset
              </button>
            </div>
          </div>
        </>
      ) : null}

      {list?.length > 0 ? (
        <p className='mt-2 text-textgray text-xs font-nunitoRegular font-normal'>
          Showing <span className='text-white'>{list.length + (currentPage - 1) * 10}</span> out of{' '}
          <span className='text-white'>{metadata.totalorders}</span> results
        </p>
      ) : null}

      {/* {isLoading ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : list ? (
        <div>
          <div className='w-full  bg-arsenic rounded-lg mt-4'>
            <OrderTable cols={cols} data={list} />
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
          <p className='text-lg font-nunitoBold'>No Results found !!</p>
        </div>
      )} */}

      {isLoading ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : list.length > 0 ? (
        <div>
          <div className='w-full  bg-arsenic rounded-lg mt-4'>
            <OrderTable cols={cols} data={list} />
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
          <p className='text-lg font-nunitoBold'>No Results found !!</p>
        </div>
      )}
    </div>
  )
}

export default OrdersListing
