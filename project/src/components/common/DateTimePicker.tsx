import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { SxProps } from '@mui/material'

interface DateProps {
  handleChange: any
  value: any
  error: any
  label?: string
}

export const TimeandDatePicker = ({
  handleChange,
  value,
  error,
  label = 'Date time',
}: DateProps) => {
  const popperSx: SxProps = {
    '& .MuiPickersDay-dayWithMargin': {
      color: 'white',
      background: 'none',
      borderRadius: '10px !important',
      '&:hover': {
        background: '#FFCD2C1A',
      },
    },
    '& .MuiPickersDay-today': {
      // background: "#FFCD2C !important",
      // color: "#000",
      border: 'none !important',
    },
    '& .MuiPickersDay-dayOutsideMonth': {
      color: '#6A6A78 !important',
      '&:hover': {
        background: 'none !important',
      },
    },

    '& .css-pgdzhj-MuiButtonBase-root-MuiPickersDay-root-MuiDateRangePickerDay-day.Mui-selected': {
      // backgroundColor: "#FFCD2C !important",
      color: '#000',
      borderRadius: '10px !important',
    },
    '& .MuiTypography-root': {
      color: '#6A6A78',
      // borderTop: "1px solid #404050",
    },
    '& .css-1n2mv2k': {
      // borderTop: "1px solid #404050 ",
      // borderBottom: "1px solid #404050 ",
    },
    '& .MuiTypography-caption': {
      height: '30px !important',
    },

    '& .css-l0iinn': {
      color: 'white',
      '& .MuiSvgIcon-root': {
        color: 'white',
      },
    },
    '& .PrivatePickersYear-yearButton': {
      color: 'white',
    },
    '& .css-m1gykc.Mui-selected': {
      backgroundColor: '#FFCD2C !important',
      color: '#000',
    },

    '& .MuiPickersArrowSwitcher-root': {
      '& .MuiSvgIcon-root': {
        color: 'white',
        // border: "1px solid white",
        borderRadius: '11px',
      },

      '& button .MuiDateRangePickerDay-dayOutsideRangeInterval': {
        backgroundColor: 'red !important',
      },

      '& .MuiDateRangePickerDay-rangeIntervalDayHighlight': {
        backgroundColor: 'red !important',
      },
    },
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        spacing={3}
        sx={{
          '& .MuiInputBase-input': {
            color: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#404050',
            borderRadius: '8px',
          },
          backgroundColor: 'transparent',
          textarea: { color: '#FFFFFF' },
          label: { color: '#6A6A78' },
          '& .MuiFormLabel-root.Mui-hovered': {
            color: '#FFCD2C',
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: '#FFCD2C',
          },
          '& .MuiOutlinedInput-root:hover': {
            '& > fieldset': {
              borderColor: '#FFFFFF',
            },
          },
          '& .MuiOutlinedInput-root': {
            '& > fieldset': {
              borderColor: '#404050',
            },
          },
          '& .MuiOutlinedInput-root.Mui-focused': {
            '& > fieldset': {
              borderColor: '#FFCD2C',
            },
          },
        }}
      >
        <DateTimePicker
          label={label}
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} error={error} />}
          components={
            {
              // OpenPickerIcon: MoreTimeIcon,
              // LeftArrowIcon: ArrowBackIcon,
              // RightArrowIcon: ArrowForwardIcon,
              // SwitchViewIcon: ChangeCircleIcon
            }
          }
          onError={() => error}
          PopperProps={{ sx: popperSx }}
          OpenPickerButtonProps={{ style: { color: 'white' } }}
        />
      </Stack>
    </LocalizationProvider>
  )
}
