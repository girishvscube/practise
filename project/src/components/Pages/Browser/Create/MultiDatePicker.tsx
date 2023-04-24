import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  startDate: any
  onChange: any
  endDate: any
}

export const DateRangePicker_1: React.FC<Props> = ({ startDate, onChange, endDate }) => (
  <div className="bg-line h-14 px-3 flex justify-between rounded-lg items-center gap-5 date-range-picker">
    <div>
      <label htmlFor="datepicker" className="block text-text text-sm">Date Range</label>
      <DatePicker
        id="datepicker"
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
      />
    </div>
    <label htmlFor="datepicker">
      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.07422 6.92317H15.3334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.7536 10.0477H11.761" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.20279 10.0477H8.2102" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.6481 10.0477H4.65552" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.7536 13.1571H11.761" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.20279 13.1571H8.2102" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.6481 13.1571H4.65552" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.4331 1V3.63262" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.97212 1V3.63262" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path fillRule="evenodd" clipRule="evenodd" d="M11.5906 2.26318H4.81677C2.46742 2.26318 1 3.57193 1 5.9776V13.2173C1 15.6608 2.46742 16.9998 4.81677 16.9998H11.5832C13.94 16.9998 15.4 15.6835 15.4 13.2778V5.9776C15.4074 3.57193 13.9474 2.26318 11.5906 2.26318Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

    </label>
  </div>
);

interface Props_2 {
  startDate_2: any
  onChange_2: any
  endDate_2: any
}

export const DateRangePicker_2: React.FC<Props_2> = ({ startDate_2, onChange_2, endDate_2 }) => (
  <div className="bg-line h-14 px-3 flex justify-between rounded-lg items-center gap-5 date-range-picker">
    <div>
      <label htmlFor="datepicker" className="block text-text text-sm">Date Range</label>
      <DatePicker
        id="datepicker"
        selected={startDate_2}
        onChange={onChange_2}
        startDate={startDate_2}
        endDate={endDate_2}
        selectsRange
      />
    </div>
    <label htmlFor="datepicker">
      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.07422 6.92317H15.3334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.7536 10.0477H11.761" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.20279 10.0477H8.2102" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.6481 10.0477H4.65552" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.7536 13.1571H11.761" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.20279 13.1571H8.2102" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.6481 13.1571H4.65552" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.4331 1V3.63262" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.97212 1V3.63262" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path fillRule="evenodd" clipRule="evenodd" d="M11.5906 2.26318H4.81677C2.46742 2.26318 1 3.57193 1 5.9776V13.2173C1 15.6608 2.46742 16.9998 4.81677 16.9998H11.5832C13.94 16.9998 15.4 15.6835 15.4 13.2778V5.9776C15.4074 3.57193 13.9474 2.26318 11.5906 2.26318Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

    </label>
  </div>
);
