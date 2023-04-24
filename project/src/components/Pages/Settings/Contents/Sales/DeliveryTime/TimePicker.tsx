
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { SxProps } from '@mui/material';
const BasicTimePicker = ({ value, handleChange, label }) => {
    const popperSx: SxProps = {

    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label={label}
                value={value}
                onChange={handleChange}
                PopperProps={{
                    sx: popperSx
                }}

                renderInput={(params) => <TextField {...params} sx={{
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
                }} />}

            />
        </LocalizationProvider>
    );
}

export default BasicTimePicker
