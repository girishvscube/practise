import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  startDate: any
  onChange: any
  endDate: any
}

export const DateRangePicker: React.FC<Props> = ({ startDate, onChange, endDate }) => {
  const today = new Date()
  return (
    <div className='bg-line h-12 sm:h-14 px-3 flex justify-between rounded-lg items-center gap-2 sm:gap-5 date-range-picker'>
      <div>
        <label
          htmlFor='datepicker'
          className={`custom-label block text-text text-sm ${startDate ? 'toggle-label' : ''}`}
        >
          Date Range
        </label>
        <DatePicker
          onKeyDown={(e) => {
            e.preventDefault()
          }}
          className='cursor-pointer'
          id='datepicker'
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          maxDate={today}
          selectsRange
        />
      </div>
      <label htmlFor='datepicker'>
        <svg
          className='cursor-pointer'
          width='17'
          height='18'
          viewBox='0 0 17 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1.07422 6.92317H15.3334'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.7536 10.0477H11.761'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M8.20279 10.0477H8.2102'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M4.6481 10.0477H4.65552'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.7536 13.1571H11.761'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M8.20279 13.1571H8.2102'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M4.6481 13.1571H4.65552'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.4331 1V3.63262'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M4.97212 1V3.63262'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M11.5906 2.26318H4.81677C2.46742 2.26318 1 3.57193 1 5.9776V13.2173C1 15.6608 2.46742 16.9998 4.81677 16.9998H11.5832C13.94 16.9998 15.4 15.6835 15.4 13.2778V5.9776C15.4074 3.57193 13.9474 2.26318 11.5906 2.26318Z'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </label>
    </div>
  )
}
