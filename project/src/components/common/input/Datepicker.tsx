import * as React from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { SvgIcon, SxProps } from '@mui/material'

interface Props {
    label: string
    onChange?: any
    inputFormat?: string
    value?: any
    error?: any
    name?: any
    readonly?: any
}

const CommonDatepicker: React.FC<Props> = ({
    label,
    onChange,
    inputFormat = 'yyyy/MM/dd',
    value = null,
    error,
    readonly,
}) => {
    const today = new Date()
    const popperSx: SxProps = {
        '& .MuiPaper-root': {
            border: '1px solid #404050',

            backgroundColor: '#2F3344',
            borderRadius: '5px',
        },
        '& .MuiPickersDay-dayWithMargin': {
            color: 'white',
            background: 'none',
            borderRadius: '10px !important',
            '&:hover': {
                background: '#FFCD2C1A',
            },
        },
        '& .MuiPickersDay-dayOutsideMonth': {
            color: '#6A6A78 !important',
            '&:hover': {
                background: 'none !important',
            },
        },
        '& .MuiTypography-root': {
            color: '#6A6A78',
            borderTop: '1px solid #404050',
            borderBottom: '1px solid #404050',
            margin: 0,
            padding: '0px 20px',
        },
        '& .MuiTypography-caption': {
            height: '30px !important',
        },

        '& .PrivatePickersYear-yearButton': {
            color: 'white',
        },
        '& .MuiPickersArrowSwitcher-root': {
            '& .MuiSvgIcon-root': {
                color: 'white',
                border: '1px solid white',
                borderRadius: '11px',
            },
        },
        '& .PrivatePickersFadeTransitionGroup-root': {
            color: 'white !important',
        },
        '& .MuiIconButton-root': {
            color: 'white !important',
        },
    }

    const inputSx: SxProps = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'red !important',
            },
            '&:hover fieldset': {
                borderColor: 'green',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'purple',
            },
        },
    }

    const DateIcon = () => {
        if (value) {
            return (
                <SvgIcon>
                    <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M16.4109 2.76862L16.4119 3.51824C19.1665 3.73413 20.9862 5.61119 20.9891 8.48975L21 16.9155C21.0039 20.054 19.0322 21.985 15.8718 21.99L8.15188 22C5.01119 22.004 3.01482 20.027 3.01087 16.8795L3.00001 8.55272C2.99606 5.65517 4.75153 3.78311 7.50617 3.53024L7.50518 2.78061C7.5042 2.34083 7.83001 2.01 8.26444 2.01C8.69886 2.009 9.02468 2.33883 9.02567 2.77861L9.02666 3.47826L14.8914 3.47027L14.8904 2.77062C14.8894 2.33084 15.2152 2.001 15.6497 2C16.0742 1.999 16.4099 2.32884 16.4109 2.76862ZM4.52052 8.86156L19.4687 8.84157V8.49174C19.4262 6.34282 18.348 5.21539 16.4129 5.04747L16.4139 5.81708C16.4139 6.24687 16.0792 6.5877 15.6546 6.5877C15.2202 6.5887 14.8934 6.24887 14.8934 5.81908L14.8924 5.00949L9.02767 5.01748L9.02866 5.82608C9.02866 6.25686 8.70383 6.59669 8.2694 6.59669C7.83498 6.59769 7.50817 6.25886 7.50817 5.82808L7.50718 5.05846C5.5819 5.25137 4.51657 6.3828 4.51953 8.55071L4.52052 8.86156ZM15.2383 13.4043V13.4153C15.2481 13.8751 15.6233 14.2239 16.0785 14.2139C16.5228 14.2029 16.8772 13.8221 16.8674 13.3623C16.8466 12.9225 16.4902 12.5637 16.0469 12.5647C15.5927 12.5747 15.2373 12.9445 15.2383 13.4043ZM16.0541 17.892C15.5999 17.882 15.2336 17.5032 15.2326 17.0435C15.2227 16.5837 15.5871 16.2029 16.0412 16.1919H16.0511C16.5152 16.1919 16.8913 16.5707 16.8913 17.0405C16.8923 17.5102 16.5171 17.891 16.0541 17.892ZM11.1719 13.4203C11.1916 13.88 11.5678 14.2389 12.022 14.2189C12.4663 14.1979 12.8207 13.8181 12.801 13.3583C12.7901 12.9085 12.4248 12.5587 11.9805 12.5597C11.5263 12.5797 11.1709 12.9605 11.1719 13.4203ZM12.0259 17.8471C11.5717 17.8671 11.1965 17.5082 11.1758 17.0485C11.1758 16.5887 11.5302 16.2089 11.9844 16.1879C12.4287 16.1869 12.795 16.5367 12.8049 16.9855C12.8256 17.4463 12.4702 17.8261 12.0259 17.8471ZM7.10351 13.4553C7.12326 13.915 7.49943 14.2748 7.9536 14.2539C8.3979 14.2339 8.75235 13.8531 8.73161 13.3933C8.72174 12.9435 8.35643 12.5937 7.91115 12.5947C7.45697 12.6147 7.10252 12.9955 7.10351 13.4553ZM7.95751 17.8521C7.50334 17.8731 7.12815 17.5132 7.10742 17.0535C7.10643 16.5937 7.46187 16.2129 7.91604 16.1929C8.36034 16.1919 8.72663 16.5417 8.73651 16.9915C8.75724 17.4513 8.40279 17.8321 7.95751 17.8521Z'
                            fill='#FFCD2C'
                        />
                    </svg>
                </SvgIcon>
            )
        }
        return (
            <SvgIcon>
                <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M3.0918 9.40427H20.9157'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M16.4429 13.3097H16.4522'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M12.0054 13.3097H12.0147'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M7.55818 13.3097H7.56744'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M16.4429 17.1962H16.4522'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M12.0054 17.1962H12.0147'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M7.55818 17.1962H7.56744'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M16.0433 2V5.29078'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M7.96515 2V5.29078'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M16.2383 3.57922H7.77096C4.83427 3.57922 3 5.21516 3 8.22225V17.2719C3 20.3263 4.83427 22 7.77096 22H16.229C19.175 22 21 20.3546 21 17.3475V8.22225C21.0092 5.21516 19.1842 3.57922 16.2383 3.57922Z'
                        stroke='white'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </SvgIcon>
        )
    }

    return (
        <div
            className={` w-full  custom-date-picker relative datepicker ${
                error ? 'error-state' : ''
            }`}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label={label}
                    value={value}
                    onChange={onChange}
                    inputFormat={inputFormat}
                    showDaysOutsideCurrentMonth
                    minDate={today}
                    readOnly={readonly}
                    renderInput={(params) => (
                        <TextField
                            label={label}
                            onKeyDown={(e) => {
                                e.preventDefault()
                            }}
                            fullWidth
                            {...params}
                            helperText={error}
                            error={true}
                            FormHelperTextProps={{ sx: inputSx }}
                        />
                    )}
                    PopperProps={{ sx: popperSx }}
                    components={{
                        OpenPickerIcon: DateIcon,
                    }}
                />
            </LocalizationProvider>
        </div>
    )
}

export default CommonDatepicker
