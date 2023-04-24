import { useState, useEffect, useMemo } from 'react'
import CustomButton from '../../../common/Button'
import Profile from '../../../../assets/images/Profile.svg'
import { SelectInput } from '../commonForm/SelectInput'
import { SelectInputId } from '../commonForm/SelectInputId'
import { useNavigate } from 'react-router-dom'
import BasicTable from './Table'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLeadsList,
  AssignExecutiveToLead,
  updateApi,
  LeadsStats,
  ReassignRequest,
} from '../../../../features/leads/leadSlice'
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
import Validator from 'validatorjs'
import { DateFiter } from '../../../../components/common/DateFiter'
import Badge from '@mui/material/Badge'
import axiosInstance from '../../../../utils/axios'

const cols = [
  {
    title: 'Lead ID',
  },
  {
    title: 'Lead Created on',
  },
  {
    title: 'Lead Source',
  },
  {
    title: 'Lead Name/Phone',
  },
  {
    title: 'Sales Executive',
  },
  {
    title: 'Lead Status',
  },
  {
    title: 'Action',
  },
]

const leadAssignParams = {
  assigned_to: '',
  notes: '',
}

const LeadListing = () => {
  const { salesExecutives } = useSelector((state: any) => state.dropdown)
  const { leadsList, isLoading, updateApiSuccess, leadsStats, disable_actions } = useSelector(
    (state: any) => state.lead,
  )
  const { metadata } = useSelector((state: any) => state.lead)
  const { totalleads } = metadata
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [filter, setFilter] = useState(false)
  const [assignId, setAssignId] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [leadAssignErros, setLeadAssignErrors] = useState(leadAssignParams)
  const [open, setOpen] = useState({
    assign: false,
    reassign: false,
    reassign_req: false,
    data: '',
  })
  const initalStates: any = {
    searchText: '',
    status: '',
    salesExecutive: '',
    source: '',
    start_date: '',
    end_date: '',
  }
  const [params, setParams] = useState(initalStates)
  const [assignLead, setAssignLead] = useState(leadAssignParams)
  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })

  const [leadsStatus, setleadsStatus] = useState([])
  const [filtersCount, setFiltersCount] = useState(0)

  const [leadSource, setLeadSource] = useState([])
  const handleActivateFilter = () => {
    setFilter(!filter)
  }
  const handleCancel = () => {
    setParams({
      ...params,
      searchText: '',
      status: '',
      salesExecutive: '',
      start_date: '',
      end_date: '',
      source: '',
    })
    setCurrentPage(1)
    dispatch(fetchLeadsList(1, '', '', '', '', '', ''))

    setFiltersCount(0)
    let reset: any = null
    setStartDate(reset)
    setEndDate(reset)
  }
  const handleSubmit = () => {
    setCurrentPage(1)
    dispatch(
      fetchLeadsList(
        1,
        params.status,
        params.source,
        params.searchText,
        params.salesExecutive,
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
    navigate('/sales/leads/create')
  }

  useEffect(() => {
    dispatch(getSaleExecutiveList('leads'))
  }, [])

  // DateRange picker for Leads Filter
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    const sDate = moment(start).format('YYYY-MM-DD')
    const eDate = moment(end).format('YYYY-MM-DD')
    setParams({ ...params, start_date: sDate, end_date: eDate })
  }

  // assignExecutive to lead popup
  const handleAssignFormPopUp = (item: any, name: any) => {
    setAssignId(item.id)
    setOpen({ ...open, [name]: true, data: item })
  }

  // assignExecutive popup form
  const handleFormChanges = (event: any) => {
    setAssignLead({ ...assignLead, [event.target.name]: event.target.value })
    setLeadAssignErrors(leadAssignParams)
  }

  // submit assignExective to lead
  const submitAssignForm = () => {
    const validation = new Validator(assignLead, {
      assigned_to: 'required',
      notes: 'max:500|string',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setLeadAssignErrors(fieldErrors)
      return false
    }

    dispatch(AssignExecutiveToLead(assignLead, assignId))
  }

  // submit re-assignExective to lead
  const submitReassignForm = () => {
    const validation = new Validator(assignLead, {
      notes: 'required|max:500|string',
    })

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setLeadAssignErrors(fieldErrors)
      return false
    }
    let payload = { notes: assignLead.notes }
    dispatch(ReassignRequest(payload, assignId))
  }

  // to close the api on successfull
  useEffect(() => {
    if (updateApiSuccess === true) {
      setOpen({ ...open, assign: false, reassign: false, reassign_req: false, data: '' })
      setAssignLead({
        ...assignLead,
        assigned_to: '',
        notes: '',
      })
      dispatch(updateApi())
      dispatch(
        fetchLeadsList(
          currentPage,
          params.status,
          params.source,
          params.searchText,
          params.salesExecutive,
          params.start_date,
          params.end_date,
        ),
      )
    }
  }, [updateApiSuccess])

  useMemo(() => {
    dispatch(LeadsStats(date.start_date, date.end_date))
  }, [date])

  useMemo(() => {
    dispatch(
      fetchLeadsList(
        currentPage,
        params.status,
        params.source,
        params.searchText,
        params.salesExecutive,
        params.start_date,
        params.end_date,
      ),
    )
  }, [currentPage])

  const onDateSelect = (date: any) => {
    setDate(date)
  }

  useEffect(() => {
    fetchStatus()
    fetchSource()
  }, [])

  const fetchSource = () => {
    axiosInstance.get('/admin/settings/leads/source').then((res) => {
      setLeadSource(res?.data.data)
    })
  }

  const fetchStatus = () => {
    axiosInstance.get('/admin/settings/leads/status').then((res) => {
      setleadsStatus(res?.data.data)
    })
  }
  return (
    <div className='users-section'>
      <div className='flex justify-between items-center'>
        <p className='text-white font-nunitoBold text-xl'>Lead Analytics</p>
        <div className='hidden sm:block'>
          <DateFiter onDateRangeSelect={onDateSelect} />
        </div>
      </div>
      <div className='w-full sm:hidden '>
        <br />
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>

      <div className='mt-3 flex flex-col lg:flex-row gap-6'>
        <Card text='Total Leads Created' value={leadsStats?.total || 0} image={Lead1} />
        <Card text='Total Leads Converted' value={leadsStats?.converted || 0} image={Lead2} />
        <Card text='Leads Not Responded' value={leadsStats?.not_interestedt || 0} image={Lead3} />
      </div>

      <div className='mt-7 flex justify-between'>
        <div>
          <p className='text-xl font-extrabold text-white font-nunitoRegular'>Leads List</p>
          <div className='w-24 border-b border-border' />
          <p className='text-xs font-nunitoRegular mt-1 font-normal'>Total Leads: {totalleads}</p>
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
          <CustomButton
            onClick={handleCreate}
            width='w-fit'
            variant='contained'
            size='large'
            icon={<img src={Profile} alt='' />}
            borderRadius='8px'
          >
            <p className='font-bold text-darkbg font-nunitoRegular text-sm '>Create New Lead</p>
          </CustomButton>
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
        <CustomButton
          onClick={handleCreate}
          width='w-fit'
          variant='contained'
          size='large'
          icon={<img src={Profile} alt='' />}
          borderRadius='8px'
        >
          <p className='font-bold  font-nunitoRegular text-sm '>Create New Lead</p>
        </CustomButton>
      </div>

      {filter === true ? (
        <>
          <div className='mt-6 flex flex-col lg:flex-row gap-6 pr-0 lg:pr-20 w-full filters items-center'>
            <div className='w-full lg:w-[300px]'>
              <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
            </div>

            <div className='w-full lg:w-[300px]'>
              <SelectInput
                width='100%'
                options={leadsStatus}
                handleChange={handleSearch}
                value={params.status}
                label='Status'
                name='status'
              />
            </div>

            <div className='w-full lg:w-[300px]'>
              <SelectInput
                width='100%'
                options={leadSource}
                handleChange={handleSearch}
                value={params.source}
                label='Lead Source'
                name='source'
              />
            </div>

            <div className='w-full lg:w-[300px]'>
              <SelectInputId
                width='100%'
                options={salesExecutives}
                handleChange={handleSearch}
                value={params.salesExecutive}
                label='Sales Executive'
                name='salesExecutive'
              />
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
            <div className='hidden lg:flex justify-end gap-4 '>
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

            <div className='w-full lg:hidden flex justify-end gap-4 '>
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

      {leadsList?.length > 0 ? (
        <p className='mt-[16px] text-textgray text-xs font-nunitoRegular font-normal'>
          Showing <span className='text-white'> {leadsList.length + (currentPage - 1) * 10}</span>{' '}
          out of <span className='text-white'>{totalleads}</span> results
        </p>
      ) : null}

      {isLoading ? (
        <div className='w-full h-96 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : leadsList?.length > 0 ? (
        <div>
          <div className='w-full  bg-[#404050] rounded-lg mt-[16px]'>
            <BasicTable cols={cols} data={leadsList} handleClick={handleAssignFormPopUp} />
          </div>

          <Pagination
            className='pagination-bar'
            currentPage={currentPage}
            totalCount={metadata.total}
            pageSize={10}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
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
        title='Assign Lead'
        type='assign'
        name=''
        params={assignLead}
        setParams={handleFormChanges}
        submit={submitAssignForm}
        errors={leadAssignErros}
        disableActions={disable_actions}
        buttonLabel='Assign Now'
      />

      <PopUp
        open={open.reassign}
        data={open.data}
        handleClose={() => {
          setOpen({ ...open, reassign: false })
        }}
        roles={salesExecutives}
        title='Reassign Lead'
        type='reassign'
        name=''
        params={assignLead}
        errors={leadAssignErros}
        disableActions={disable_actions}
        setParams={handleFormChanges}
        submit={submitAssignForm}
        buttonLabel='Assign Now'
      />

      <PopUp
        open={open.reassign_req}
        handleClose={() => {
          setOpen({ ...open, reassign_req: false })
        }}
        roles={salesExecutives}
        title='Reassign Request'
        type='reassign_req'
        name=''
        params={assignLead}
        errors={leadAssignErros}
        disableActions={disable_actions}
        setParams={handleFormChanges}
        submit={submitReassignForm}
        buttonLabel='Request'
      />
    </div>
  )
}

export default LeadListing
