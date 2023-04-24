import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import { uuid } from '../../../../utils/helpers'

interface Props {
    name?: string
    value?: any
    label?: string
    error?: boolean
    helperText?: string
    handleChange?: any
    options?: any
    width?: string
    required?: boolean
    readonly?: boolean
}

const useStyles = makeStyles({
    error: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red',
            borderRadius: '8px',
        },
    },
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
    },
})

export const SelectInputId: React.FC<Props> = ({
    handleChange,
    value,
    label,
    error,
    helperText,
    options,
    width,
    name,
    required,
    readonly,
}) => {
    const classes = useStyles()
    return (
        <div className='w-full'>
            <FormControl className={!error ? classes.root : classes.error} fullWidth error={error}>
                <InputLabel id='select-input-label'>{label}</InputLabel>
                <Select
                    labelId='select-input-label'
                    style={{
                        width,
                    }}
                    // IconComponent={KeyboardArrowDownIcon}
                    MenuProps={{
                        sx: {
                            '&& .MuiMenuItem-root': {
                                backgroundColor: '#2F3344',
                                border: '1px solid #404050 !important',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#444757 !important',
                                },
                            },
                            '&& .MuiMenu-list': {
                                padding: '0',
                            },

                            '&& .Mui-selected': {
                                color: '#FFCD2C !important',
                                backgroundColor: '#333748',
                            },
                        },
                    }}
                    sx={{
                        color: 'white',
                        '.MuiSvgIcon-root ': {
                            fill: 'white !important',
                        },
                    }}
                    required={required}
                    value={value}
                    onChange={handleChange}
                    label={label}
                    name={name}
                    error={error}
                    fullWidth
                    readOnly={readonly}
                >
                    {options.length > 0 ? (
                        options?.map((item: any) => (
                            <MenuItem key={uuid()} value={item.id}>
                                {item?.name}
                            </MenuItem>
                        ))
                    ) : (
                        <p className='text-white p-4 text-xl'>Not found !</p>
                    )}
                </Select>

                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </div>
    )
}
