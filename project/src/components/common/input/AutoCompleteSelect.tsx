// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import Select from '@mui/material/Select';
// import DownLight from '../../../assets/icons/lightIcons/DownLight.svg'
// import Checkbox from '@mui/material/Checkbox'
// import ListItemText from '@mui/material/ListItemText'
// import OutlinedInput from '@mui/material/OutlinedInput'
import { makeStyles } from '@mui/styles';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { color } from '@mui/system';

interface Props {
  name?: string
  value?: string
  label?: string
  error?: boolean
  helperText?: string
  handleChange?: any
  options: any
  width?: string
}

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
      color: '#FFCD2C',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFCD2C',
    },
    '& .MuiSvgIcon-root ': {
      fill: 'white !important',
    },
  },
});

export const AutoCompleteSelect: React.FC<Props> = ({
  handleChange,
  value,
  label,
  error,
  helperText,
  options,
  // width,
  name,
}) => {
  const classes = useStyles();
  return (
    <div>
      <Autocomplete
        id={name}
        onChange={handleChange}
        className={classes.root}
        options={options}
        getOptionLabel={(option: any) => option.name}
        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            style={{ color: 'white' }}
            error={error}
            helperText={helperText}
            {...params}
            label={label}
            variant="outlined"
            fullWidth
            value={value}
            name='role_id'
          />
        )}
      />
    </div>
  );
};
