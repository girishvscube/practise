import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '../../../../assets/images/SearchIcon.svg';
import { TextField, Tooltip } from '@mui/material';

interface State {
  label: string,
  handleChange: any,
  value: any,
  name: any,
  width: any
}

export const InputAdornments = ({ handleChange, value, name, label, width }: State) => (

  <div className={width}>
    <TextField
      variant="outlined"
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
      fullWidth
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="demo">
              <img src={SearchIcon} alt="" />
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  </div>

);
