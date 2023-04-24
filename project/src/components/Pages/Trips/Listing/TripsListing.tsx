import { useState, useEffect, useMemo } from 'react'
import CustomButton from '../../../common/Button'
import Profile from '../../../../assets/images/Profile.svg'
import { SelectInput } from '../../../common/input/Select'
import { useNavigate } from 'react-router-dom'
import BasicTable from './Table'
import TablePagination from '../../User/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLeadsList,
  AssignExecutiveToLead,
  updateApi,
  LeadsStats,
} from '../../../../features/leads/leadSlice'
import { fetchTripsList, TripsStats } from '../../../../features/trips/tripsSlice'
import { fetchBrowsersList } from '../../../../features/browser/browserSlice'
import CircularProgress from '@mui/material/CircularProgress'
import NotFound from '../../../../assets/images/NotFound.svg'
import Lead1 from '../../../../assets/images/Lead1.svg'
import Lead2 from '../../../../assets/images/Lead2.svg'
import Lead3 from '../../../../assets/images/Lead3.svg'
import Card from './Card'
import { DateRangePicker } from '../../../common/input/DateRangePicker'
import FilterLight from '../../../../assets/images/FilterLight.svg'
import moment from 'moment'
import PopUp from './Popup'
import { getSaleExecutiveList } from '../../../../features/dropdowns/dropdownSlice'
import { InputAdornments } from './SearchText'
import { Pagination } from '../../../common/Pagination/Pagination'
import { CountItems } from '../../../../utils/helpers'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import Badge from '@mui/material/Badge'
import { DateFiter } from '../../../common/DateFiter'
import axiosInstance from '../../../../utils/axios'

const useStyles = makeStyles({
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
    // width: 200,
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
      color: '#6A6A78',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFCD2C',
    },
  },
})

const cols = [
  {
    title: 'Trips No',
  },
  {
    title: 'PO No.',
  },
  {
    title: 'Bowser Name',
  },
  {
    title: 'Trip Start time & Date',
  },
  {
    title: 'Trip End time & Date',
  },
  {
    title: 'No of Delivered/ Total No of Orders',
  },
  {
    title: 'Fuel Delivered/ Remaing Fuel',
  },
  {
    title: 'Trip Status',
  },
  {
    title: 'Action',
  },
  {
    title: 'Trip info',
  },
]

const colsData = [
  {
    tripsNo: '---',
    poNo: '---',
    bowserName: '---',
    start_time: '---',
    end_time: '---',
    deliveredOrders: '---',
    fuelDeliveredRemain: '---',
    tripStatus: '---',
    Action: '---',
    tripInfo: '---',
  },
]

const cols_2 = [
  {
    title: 'SO/PO No',
  },
  {
    title: 'PO/Order Created on',
  },
  {
    title: 'Customer/Supplier info ',
  },
  {
    title: 'PO/Order Quantity (in Liters)',
  },
  {
    title: 'PO/ SO Value',
  },
  {
    title: 'Delivery Location',
  },
  {
    title: 'Purchase/ Delivery Time/ Date ',
  },
  {
    title: 'Purchase/ Delivery Status',
  },
  {
    title: 'Download SO/ PO',
  },
]

interface TripsListingProps {
  error?: boolean
  width?: string
  required?: boolean
}

const TripsListing = ({ error, width, required }: TripsListingProps) => {
  const classes = useStyles()

  const { tripsList, isLoading, tripsStats } = useSelector((state: any) => state.trip)

  const { metadata } = useSelector((state: any) => state.trip)
  const { totaltrips, total } = metadata
  const { browserList } = useSelector((state: any) => state.browser)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [filter, setFilter] = useState(false)
  const [page, setPage] = useState(1)
  const [gotoPage, setGotoPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersCount, setFiltersCount] = useState(0)
  const [tripStatus, setTripStatus] = useState()
  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })

  const initalStates: any = {
    bowserName: '',
    status: '',
    searchText: '',
    start_time: '',
    end_time: '',
  }

  const [params, setParams] = useState(initalStates)

  const fetchTripStatus = () => {
    axiosInstance.get(`/admin/trips/status/dropdown`).then((resp) => {
      setTripStatus(resp.data.data)
    })
  }

  // console.log(tripStatus, ',.,.,.')

  const handleActivateFilter = () => {
    setFilter(!filter)
  }

  const handleCancel = () => {
    setParams({
      ...params,
      searchText: '',
      status: '',
      bowserName: '',
      start_time: '',
      end_time: '',
    })
    dispatch(fetchTripsList(1, '', '', '', '', ''))
    setFiltersCount(0)
  }

  const handleSubmit = () => {
    dispatch(
      fetchTripsList(
        currentPage,
        params.status,
        params.bowserName,
        params.searchText,
        params.start_time,
        params.end_time,
      ),
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

  const bowserValues = {
    searchText: '',
    status: '',
    driver: '',
  }

  useEffect(() => {
    dispatch(
      fetchBrowsersList(
        currentPage,
        bowserValues.driver,
        bowserValues.status,
        bowserValues.searchText,
      ),
    )
  }, [page])

  // DateRange picker for Leads Filter
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    const sDate = moment(start).format('YYYY-MM-DD')
    const eDate = moment(end).format('YYYY-MM-DD')
    setParams({ ...params, start_time: sDate, end_time: eDate })
  }

  useMemo(() => {
    dispatch(TripsStats(date.start_date, date.end_date))
  }, [date.end_date])

  useMemo(() => {
    fetchTripStatus()
    dispatch(
      fetchTripsList(
        currentPage,
        params.bowserName,
        params.status,
        params.searchText,
        params.start_time,
        params.end_time,
      ),
    )
  }, [currentPage])

  const onDateSelect = (date: any) => {
    // console.log(date, 'date');
    setDate({ start_date: date.start_date, end_date: date.end_date })
  }

  // console.log(page, currentPage, 'asdf');

  return (
    <div className='users-section'>
      <div className='flex lg:flex-row justify-between flex-col items-center'>
        <p className='text-white font-nunitoBold text-xl'>Trips Analytics</p>
        <div className='flex flex-col lg:flex-row '>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>

      <div className='mt-6 flex flex-col lg:flex-row gap-6'>
        <Card text='Total Trips' value={tripsStats?.total || 0} image={Lead1} />
        <Card text='Total Completed Trips' value={tripsStats?.completed || 0} image={Lead2} />
        <Card text='Not Scheduled Trips' value={tripsStats?.not_scheduled || 0} image={Lead3} />
      </div>

      <div className='mt-7 flex justify-between'>
        <div>
          <p className='text-xl font-extrabold text-white font-nunitoRegular'>List of Trips</p>
          <div className='w-24 border-b border-border' />
          <p className='text-xs font-nunitoRegular mt-1 font-normal'>Total Trips: {totaltrips}</p>
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
              borderRadius={'8px'}
            >
              <p className='font-bold text-yellow font-nunitoRegular text-sm'>Filter</p>
            </CustomButton>
          </Badge>
        </div>
      </div>

      <div className=' w-full justify-start mt-6 gap-6 lg:hidden flex'>
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
            borderRadius={'8px'}
          >
            <p className='font-bold text-yellow font-nunitoRegular text-sm'>Filter</p>
          </CustomButton>
        </Badge>
      </div>

      {filter === true ? (
        <>
          <div className='mt-6 flex flex-col lg:flex-row gap-6 pr-0 lg:pr-20 w-full filters'>
            <div className='w-full lg:w-[300px]'>
              <FormControl className={classes.root} fullWidth error={error}>
                <InputLabel id='select-input-label'>Bowser Name</InputLabel>
                <Select
                  labelId='select-input-label'
                  style={{
                    width,
                  }}
                  MenuProps={{
                    sx: {
                      '&& .MuiMenuItem-root': {
                        backgroundColor: '#2F3344',
                        border: '1px solid #404050 !important',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#444757 !important',
                        },
                      },
                      '&& .MuiMenu-list': {
                        padding: '0',
                      },

                      '&& .Mui-selected': {
                        color: '#FFCD2C !important',
                        backgroundColor: '#333748',
                      },
                    },
                  }}
                  sx={{
                    color: 'white',
                    '.MuiSvgIcon-root ': {
                      fill: 'white !important',
                    },
                  }}
                  required={required}
                  value={params.bowserName}
                  onChange={handleSearch}
                  label='Bowser Name'
                  name='bowserName'
                  fullWidth
                >
                  {browserList.map((item: any) => (
                    <MenuItem key={item.id} value={item.id ? item.id : item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className='w-full lg:w-[300px]'>
              <SelectInput
                width='100%'
                options={tripStatus}
                handleChange={handleSearch}
                value={params.status}
                label='Status'
                name='status'
              />
            </div>

            <div className='w-full lg:w-[300px]'>
              <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
            </div>

            <div className='w-full lg:w-[30%]'>
              <InputAdornments
                handleChange={handleSearch}
                label='Search'
                name='searchText'
                value={params.searchText}
                width='w-full'
              />
            </div>
            <div className='mt-2 flex justify-end '>
              <div className='flex justify-center gap-4'>
                <CustomButton
                  disabled={CountItems(params) === 0}
                  onClick={handleSubmit}
                  width='w-[130px]'
                  variant='outlined'
                  size='large'
                  borderRadius={'0.5rem'}
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
          </div>
        </>
      ) : null}

      {tripsList?.length > 0 ? (
        <p className='mt-[16px] text-textgray text-xs font-nunitoRegular font-normal'>
          Showing <span className='text-white'> {tripsList.length + (currentPage - 1) * 10}</span>{' '}
          out of <span className='text-white'>{totaltrips}</span> results
        </p>
      ) : null}

      {isLoading ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : tripsList?.length > 0 ? (
        <div>
          <div className='w-full  bg-[#404050] rounded-lg mt-[16px]'>
            <BasicTable cols_2={cols_2} cols={cols} data={tripsList} />
          </div>

          <Pagination
            className='pagination-bar'
            currentPage={currentPage}
            totalCount={metadata.totaltrips}
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

export default TripsListing
