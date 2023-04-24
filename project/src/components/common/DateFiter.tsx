import { useState } from 'react'
import { dateRange, defaultFiltersDropDown } from '../../utils/helpers'
import moment from 'moment'
import { SelectInput } from './input/Select'
import { DateRangePicker } from './input/DateRangePicker'

interface Props {
  onDateRangeSelect: any
}

export const DateFiter: React.FC<Props> = ({ onDateRangeSelect }) => {
  const [value, setValue] = useState('ALL')
  const [date, setDate] = useState({
    start_date: null,
    end_date: null,
  })

  const handleFilter = (e) => {
    let [start_date, end_date] = dateRange(e.target.value)
    setValue(e.target.value)
    if (start_date && end_date) {
      onDateRangeSelect({ start_date, end_date })
    } else {
      onDateRangeSelect({ start_date: '', end_date: '' })
    }
  }
  const onCustomDateChange = (e) => {
    const [start, end] = e
    setDate({ start_date: start, end_date: end })
    if (start && end) {
      onDateRangeSelect({
        start_date: moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_date: moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      })
    } else {
      onDateRangeSelect({ start_date: '', end_date: '' })
    }
  }
  return (
    <div className='flex w-full flex-col sm:flex-row justify-end date_range_filter gap-3'>
      <div className='sm:custom-select-input sm:w-44'>
        <SelectInput
          width='100%'
          options={defaultFiltersDropDown}
          handleChange={handleFilter}
          value={value}
          label='Select Date'
          name='Select Date Range'
        />
      </div>

      {value === 'custom' && (
        <div className='w-full sm:w-fit'>
          <DateRangePicker 
            startDate={date.start_date}
            endDate={date.end_date}
            onChange={onCustomDateChange}
          />
        </div>
      )}
    </div>
  )
}
