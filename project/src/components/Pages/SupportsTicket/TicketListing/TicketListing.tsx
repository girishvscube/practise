import { useState, useEffect, useMemo } from 'react'
import CustomButton from '../../../common/Button'
import Profile from '../../../../assets/images/Profile.svg'
import { SelectInput } from '../../../common/input/Select'
import { useNavigate } from 'react-router-dom'
import BasicTable from './Table'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTicketList,
  assignTicket,
  updateApi,
  ticketStats,
} from '../../../../features/support/supportSlice'
import CircularProgress from '@mui/material/CircularProgress'
import NotFound from '../../../../assets/images/NotFound.svg'
import Tickets from '../../../../assets/images/Tickets.svg'
import AssignedTickets from '../../../../assets/images/AssignedTickets.svg'
import ResolvedTickets from '../../../../assets/images/ResolvedTickets.svg'
import OpenTickets from '../../../../assets/images/OpenTickets.svg'
import Card from '../../leads/LeadListing/Card'
import { DateRangePicker } from '../../../common/input/DateRangePicker'
import FilterLight from '../../../../assets/images/FilterLight.svg'
import moment from 'moment'
import PopUp from './PopUp'
import { getSaleExecutiveList } from '../../../../features/dropdowns/dropdownSlice'
import { InputAdornments } from '../../leads/LeadListing/SearchText'
import { CountItems, showToastMessage } from '../../../../utils/helpers'
import Pagination from '../../../common/Pagination/Pagination'
import { DateFiter } from '../../../common/DateFiter'
import Badge from '@mui/material/Badge'
import axiosInstance from '../../../../utils/axios'
import Validator from 'validatorjs'
const cols = [
  {
    title: 'Ticket ID',
  },
  {
    title: 'Order No.',
  },
  {
    title: 'Created By',
  },
  {
    title: 'Ticket Created On',
  },
  {
    title: 'Contact Name/Phone',
  },
  {
    title: 'Support Executive',
  },
  {
    title: 'Priority',
  },
  {
    title: 'Ticket Status',
  },
  {
    title: 'Action',
  },
]

const status = [
  {
    id: 'Assigned',
    name: 'Assigned',
  },
  {
    id: 'Unassigned',
    name: 'Unassigned',
  },
]

const initialParams = {
  status: 'Open',
  sales_id: '',
  notes: '',
}

const TicketListing = () => {
  const { salesExecutives } = useSelector((state: any) => state.dropdown)
  const { ticketsList, isLoading, updateApiSuccess, ticketsStats } = useSelector(
    (state: any) => state.support,
  )
  const { metadata } = useSelector((state: any) => state.support)
  const { totalTickets } = metadata
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [filter, setFilter] = useState(false)
  const [buttonDisable, setButtonDisable] = useState(false)
  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })
  const [filtersCount, setFiltersCount] = useState(0)
  const [assignId, setAssignId] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [open, setOpen] = useState({
    assign: false,
    reassign: false,
    reassign_req: false,
    data: '',
  })
  const initalStates: any = {
    search_key: '',
    status: '',
    created_by: '',
    start_date: '',
    end_date: '',
  }
  const [params, setParams] = useState(initalStates)

  const [assignTicketForm, setAssignTicketForm] = useState(initialParams)
  const [errors, setTicketErrors] = useState(assignTicketForm)
  const handleActivateFilter = () => {
    setFilter(!filter)
  }
  const handleCancel = () => {
    setParams({
      ...params,
      search_key: '',
      status: '',
      created_by: '',
      start_date: '',
      end_date: '',
    })
    setCurrentPage(1)
    const reset: any = ''
    setStartDate(reset)
    setEndDate(reset)
    dispatch(fetchTicketList(1, '', '', '', '', ''))

    setFiltersCount(0)
  }

  const handleSubmit = () => {
    setCurrentPage(1)
    dispatch(
      fetchTicketList(
        1,
        params.search_key,
        params.status,
        params.created_by,
        params.start_date,
        params.end_date,
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

  const handleCreate = () => {
    navigate('/support')
  }

  useEffect(() => {
    dispatch(getSaleExecutiveList())
  }, [])

  // DateRange picker for Ticket Filter
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    const sDate = moment(start).format('YYYY-MM-DD')
    const eDate = moment(end).format('YYYY-MM-DD')
    setParams({ ...params, start_date: sDate, end_date: eDate })
  }

  // open popup assignExecutive
  // const handleAssignFormPopUp = (id: any, name: any) => {
  //   setAssignId(id);
  //   setOpen({ ...open, [name]: true });
  // };

  const handleAssignFormPopUp = (item: any, name: any) => {
    setAssignId(item.id)
    setOpen({ ...open, [name]: true, data: item })
  }

  // assignExecutive popup form
  const handleFormChanges = (event: any) => {
    setTicketErrors(initialParams)
    setAssignTicketForm({ ...assignTicketForm, [event.target.name]: event.target.value })
  }

  // submit assignExective to Ticket
  const submitAssignTicket = () => {
    const validation = new Validator(assignTicketForm, {
      sales_id: 'required',
      notes: 'max:500|string',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })
      setTicketErrors(fieldErrors)
      console.log(fieldErrors)
      return false
    }
    dispatch(assignTicket(assignTicketForm, assignId))
  }

  const handleRequestForChange = () => {
    const validation = new Validator(assignTicketForm, {
      notes: 'required',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setTicketErrors(fieldErrors)
      return false
    }
    setButtonDisable(true)
    axiosInstance
      .put(`admin/support-tickets/reassign/${assignId}`, assignTicketForm)
      .then((res) => {
        setButtonDisable(false)
        showToastMessage('Reassign Ticket Created', 'success')
        setAssignTicketForm(initialParams)
        dispatch(fetchTicketList(1, '', '', '', '', ''))
        handleClosePopup()
      })
      .catch((err) => {
        showToastMessage(err?.data?.message, 'error')
        setButtonDisable(false)
      })
  }

  // to close the api on successfull

  useEffect(() => {
    if (updateApiSuccess === true) {
      setAssignTicketForm(initialParams)
      dispatch(fetchTicketList(1, '', '', '', '', ''))
      setOpen({ ...open, assign: false, reassign: false })
      dispatch(updateApi())
    }
  }, [updateApiSuccess])

  useEffect(() => {
    dispatch(ticketStats(date.start_date, date.end_date))
  }, [date.end_date])

  useMemo(() => {
    dispatch(fetchTicketList(currentPage, '', '', '', '', ''))
  }, [currentPage])

  const onDateSelect = (date: any) => {
    setDate({ start_date: date.start_date, end_date: date.end_date })
  }

  const handleClosePopup = () => {
    setOpen({ ...open, reassign_req: false })
  }

  return (
    <div className='users-section'>
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Support Analytics</p>
        <div className='hidden sm:block'>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>
      <div className='w-full sm:hidden '>
        <br />
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>

      <div className='mt-3 flex flex-col lg:flex-row gap-6'>
        <Card text='Total Tickets' value={ticketsStats?.total || 0} image={Tickets} />
        <Card text='Assigned Tickets' value={ticketsStats?.open || 0} image={AssignedTickets} />
        <Card text='Resolved Tickets' value={ticketsStats?.closed || 0} image={ResolvedTickets} />
        <Card
          text='Unassigned Tickets'
          value={ticketsStats?.not_interestedt?.count || 0}
          image={OpenTickets}
        />
      </div>

      <div className='mt-7 flex justify-between'>
        <div>
          <p className='text-xl font-extrabold text-white font-nunitoRegular'>List of Tickets</p>
          <div className='w-full border-b border-border' />
          <p className='text-xs font-nunitoRegular mt-1 font-normal'>
            Total Tickets: {totalTickets}
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
              width='w-fit'
              variant='outlined'
              size='large'
              icon={<img src={FilterLight} alt='' />}
              borderRadius='0.5rem'
            >
              <p className='font-bold text-yellow font-nunitoRegular text-sm'>Filter</p>
            </CustomButton>
          </Badge>
          <CustomButton
            onClick={handleCreate}
            width='w-fit'
            variant='contained'
            size='large'
            borderRadius='0.5rem'
          >
            <p className='font-bold text-darkGray font-nunitoRegular text-sm '>
              Search Orders to Create Ticket
            </p>
          </CustomButton>
        </div>
      </div>

      <div className='w-full  mt-6 gap-4 lg:hidden flex flex-col justify-end'>
        <div className='flex w-full justify-end'>
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
              width='w-fit'
              variant='outlined'
              size='large'
              icon={<img src={FilterLight} alt='' />}
              borderRadius='0.5rem'
            >
              <p className='font-bold text-yellow font-nunitoRegular text-sm'>Filter</p>
            </CustomButton>
          </Badge>
        </div>

        <div className='flex w-full justify-end'>
          <CustomButton
            onClick={handleCreate}
            width='w-fit'
            variant='contained'
            size='large'
            icon={<img src={Profile} alt='' />}
            borderRadius='0.5rem'
          >
            <p className='font-bold  font-nunitoRegular text-sm '>Search Orders to Create Ticket</p>
          </CustomButton>
        </div>
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
                options={status}
                handleChange={handleSearch}
                value={params.status}
                label='Status'
                name='status'
              />
            </div>

            <div className='w-full lg:w-[300px]'>
              <SelectInput
                width='100%'
                options={salesExecutives}
                handleChange={handleSearch}
                value={params.created_by}
                label='Created By'
                name='created_by'
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
            <div className='mt-2 flex justify-end gap-4'>
              <CustomButton
                onClick={handleSubmit}
                width='w-[140px]'
                variant='outlined'
                size='large'
                borderRadius='0.5rem'
                disabled={CountItems(params) === 0}
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

      {ticketsList?.length > 0 ? (
        <p className='mt-[16px] text-textgray text-xs font-nunitoRegular font-normal'>
          Showing <span className='text-white'>{ticketsList.length + (currentPage - 1) * 10}</span>{' '}
          out of <span className='text-white'>{totalTickets}</span> results
        </p>
      ) : null}

      {isLoading ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : ticketsList?.length > 0 ? (
        <div>
          <div className='w-full  bg-border rounded-lg mt-[16px]'>
            <BasicTable cols={cols} data={ticketsList} handleClick={handleAssignFormPopUp} />
          </div>

          <div className='w-full pt-10 flex justify-center gap-10'>
            <Pagination
              className='pagination-bar'
              currentPage={currentPage}
              totalCount={metadata.totalTickets}
              pageSize={10}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center flex-col gap-4 mt-6'>
          <img src={NotFound} alt='' />
          <p className='text-[18px] font-nunitoBold'>No Results found !!</p>
        </div>
      )}

      <PopUp
        open={open.assign}
        handleClose={() => {
          setOpen({ ...open, assign: false })
        }}
        roles={salesExecutives}
        title='Assign Ticket'
        type='assign'
        name=''
        params={assignTicketForm}
        setParams={handleFormChanges}
        submit={submitAssignTicket}
        isLoading={isLoading}
        Buttonlabel='Assign Now'
        error={errors}
      />

      <PopUp
        open={open.reassign}
        data={open.data}
        handleClose={() => {
          setOpen({ ...open, reassign: false })
        }}
        roles={salesExecutives}
        title='Reassign Ticket'
        type='reassign'
        name=''
        params={assignTicketForm}
        setParams={handleFormChanges}
        submit={submitAssignTicket}
        isLoading={isLoading}
        Buttonlabel='Reassign Now'
        error={errors}
      />

      <PopUp
        open={open.reassign_req}
        handleClose={handleClosePopup}
        roles={salesExecutives}
        title='Request Ticket'
        type='reassign_req'
        name=''
        params={assignTicketForm}
        setParams={handleFormChanges}
        submit={handleRequestForChange}
        isLoading={isLoading}
        Buttonlabel='Request Now'
        error={errors}
        buttonDisable={buttonDisable}
      />
    </div>
  )
}

export default TicketListing
