import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import { makeStyles } from '@mui/styles'

interface Props {
  defaultChecked?: boolean
  handleCheck: any
  ischecked?: boolean
  Label?: string
  name: string
  color: string
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'rgba(255, 205, 44, 0.1) !important',
    },
  },
}))

const CustomCheckbox: React.FC<Props> = ({
  defaultChecked,
  handleCheck,
  ischecked,
  Label,
  name,
  color,
}) => {
  const classes = useStyles()
  return (
    <div className=''>
      <Checkbox
        name={name}
        id={Label}
        checked={ischecked}
        className={classes.root}
        {...label}
        defaultChecked={defaultChecked}
        onChange={handleCheck}
        sx={{
          padding: 0,
          color: '#6A6A78',
          '&:hover': {
            color: 'white',
          },
          '&.Mui-checked': {
            color: '#FFCD2C',
          },
        }}
      />

      <label
        htmlFor={Label}
        className={` sm:ml-2 break-word sm:text-sm text-xs  cursor-pointer ${
          ischecked ? 'text-yellow' : `${color}`
        }`}
      >
        {Label}
      </label>
    </div>
  )
}
CustomCheckbox.defaultProps = {
  defaultChecked: false,
  ischecked: false,
  Label: '',
}

export default CustomCheckbox
