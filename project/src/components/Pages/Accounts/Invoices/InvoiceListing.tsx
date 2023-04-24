import { useState, useEffect, useMemo } from 'react'
import CustomButton from '../../../common/Button'
import { SelectInput } from '../../../common/input/Select'
import BasicTable from './Table'
import { useDispatch, useSelector } from 'react-redux'

import CircularProgress from '@mui/material/CircularProgress'
import NotFound from '../../../../assets/images/NotFound.svg'
import TotalInvoice from '../../../../assets/images/TotalInvoice.svg'
import PaidInvoices from '../../../../assets/images/PaidInvoices.svg'
import UnpaidInvoices from '../../../../assets/images/UnpaidInvoices.svg'
import PartiallyPaidInvoices from '../../../../assets/images/PartiallyPaidInvoices.svg'
import Card from '../CashIn/Card'
import { DateRangePicker } from '../../../common/input/DateRangePicker'
import FilterLight from '../../../../assets/images/FilterLight.svg'
import moment from 'moment'

import { InputAdornments } from '../Expenses/SearchText'
import { Pagination } from '../../../common/Pagination/Pagination'
import { CountItems } from '../../../../utils/helpers'
import { fetchInvoiceList, fetchInvoiceListStats } from '../../../../features/accounts/invoiceSlice'
import { DateFiter } from '../../../../components/common/DateFiter'
import Badge from '@mui/material/Badge'

const cols = [
  {
    title: 'Invoice No',
  },
  {
    title: 'Invoice Date',
  },
  {
    title: 'Customer Name',
  },
  {
    title: 'Customer Type',
  },
  {
    title: 'Invoice Amount',
  },
  {
    title: 'Due Date',
  },
  {
    title: 'Balance',
  },
  {
    title: 'Status',
  },
  {
    title: 'Action',
  },
]

const Status = [
  {
    id: 'Paid',
    name: 'Paid',
  },
  {
    id: 'Unpaid',
    name: 'Unpaid',
  },
  {
    id: 'Partially Paid',
    name: 'Partially Paid',
  },
]

const InvoiceListing = () => {
  const { invoiceList, invoiceStats, isLoading, updateApiSuccess, leadsStats, metadata } =
    useSelector((state: any) => state.invoice)

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const [filtersCount, setFiltersCount] = useState(0)
  const dispatch = useDispatch()
  const [filter, setFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const initalStates: any = {
    start_date: '',
    end_date: '',
    status: '',
    search_key: '',
  }

  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })
  const [params, setParams] = useState(initalStates)

  const handleActivateFilter = () => {
    setFilter(!filter)
  }
  const handleCancel = () => {
    setParams({ ...params, search_key: '', status: '', start_date: '', end_date: '' })
    dispatch(fetchInvoiceList(1, '', '', '', ''))
    let reset: any = null

    setStartDate(reset)
    setEndDate(reset)
    setFiltersCount(0)
  }

  const handleSubmit = () => {
    dispatch(
      fetchInvoiceList(1, params.search_key, params.status, params.start_date, params.end_date),
    )
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
  }

  // DateRange picker for  Filter
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    const sDate = moment(start).format('YYYY-MM-DD')
    const eDate = moment(end).format('YYYY-MM-DD')
    setParams({ ...params, start_date: sDate, end_date: eDate })
  }

  useMemo(() => {
    dispatch(fetchInvoiceListStats(date.start_date, date.end_date))
  }, [date])

  useMemo(() => {
    dispatch(
      fetchInvoiceList(
        currentPage,
        params.search_key,
        params.status,
        params.start_date,
        params.end_date,
      ),
    )
  }, [currentPage])

  const onDateSelect = (date: any) => {
    setDate(date)
  }

  return (
    <div className='users-section'>
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Invoice Analytics</p>
        <div className='hidden sm:block'>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>
      <div className='w-full sm:hidden '>
        <br />
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>

      <div className='mt-6 flex flex-col lg:flex-row gap-6'>
        <Card text='Total Invoice Created' value={invoiceStats?.total || 0} image={TotalInvoice} />
        <Card text='Paid Invoices' value={invoiceStats?.paid || 0} image={PaidInvoices} />
        <Card text='Unpaid Invoices' value={invoiceStats?.unpaid || 0} image={UnpaidInvoices} />
        <Card
          text='Partially Paid Invoices'
          value={invoiceStats?.partially_paid || 0}
          image={PartiallyPaidInvoices}
        />
      </div>

      <div className='mt-7 flex justify-between'>
        <div>
          <p className='text-xl font-extrabold text-white font-nunitoRegular'>List of Invoices</p>
          <div className='w-full border-b border-border' />
          <p className='text-xs font-nunitoRegular mt-1 font-normal'>
            Total Number Of Invoices: {metadata.total}
          </p>
        </div>

        <div className=' gap-6 hidden lg:flex'>
          <Badge
            color='secondary'
            className='text-black'
            badgeContent={filtersCount}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <CustomButton
              onClick={handleActivateFilter}
              variant='outlined'
              size='large'
              icon={<img src={FilterLight} alt='' />}
              borderRadius='0.5rem'
              width='w-fit'
            >
              <p className='font-bold text-yellow font-nunitoRegular text-sm	'>Filter</p>
            </CustomButton>
          </Badge>
        </div>
      </div>

      <div className=' w-full justify-end mt-6 gap-6 lg:hidden flex'>
        <Badge
          color='secondary'
          className='text-black'
          badgeContent={filtersCount}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <CustomButton
            onClick={handleActivateFilter}
            variant='outlined'
            size='large'
            icon={<img src={FilterLight} alt='' />}
            borderRadius='0.5rem'
            width='w-fit'
          >
            <p className='font-bold text-yellow font-nunitoRegular text-sm	'>Filter</p>
          </CustomButton>
        </Badge>
      </div>

      {filter === true ? (
        <>
          <div className='mt-6 flex flex-col lg:flex-row gap-6 pr-0 lg:pr-20 w-full filters'>
            <div className='w-full lg:w-[300px]'>
              <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
            </div>

            <div className='w-full lg:w-[300px]'>
              <SelectInput
                width='100%'
                options={Status}
                handleChange={handleSearch}
                value={params.status}
                label='Status'
                name='status'
              />
            </div>
            <div className='w-full lg:w-[30%]'>
              <InputAdornments
                handleChange={handleSearch}
                label='Search'
                name='search_key'
                value={params.search_key}
                width='w-full'
              />
            </div>
            <div className='mt-2 flex justify-end gap-2 '>
              <CustomButton
                disabled={CountItems(params) === 0}
                onClick={handleSubmit}
                width='w-[130px]'
                variant='outlined'
                size='large'
                borderRadius='0.5rem'
              >
                Apply Filter
              </CustomButton>

              <div className='mt-3 cursor-pointer' onClick={handleCancel}>
                <p>
                  <u>Reset</u>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {invoiceList?.length > 0 ? (
        <p className='mt-[16px] text-textgray text-xs font-nunitoRegular font-normal'>
          Showing{' '}
          <span className='text-white'> {invoiceList?.length + (currentPage - 1) * 10}</span> out of{' '}
          <span className='text-white'>{metadata.total}</span> results
        </p>
      ) : null}

      {isLoading ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : invoiceList?.length > 0 ? (
        <div>
          <div className='w-full  bg-[#404050] rounded-lg mt-[16px]'>
            <BasicTable cols={cols} data={invoiceList} />
          </div>

          <Pagination
            className='pagination-bar'
            currentPage={currentPage}
            totalCount={metadata.total}
            pageSize={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
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

export default InvoiceListing
