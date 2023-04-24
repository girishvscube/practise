import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

interface Props {
  defaultChecked?: boolean;
  handleCheck: any;
  ischecked?: boolean; //   Label?: string;
  name: string;
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const GreenSwitch = styled(Switch)(() => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFCD2C',
    '&:hover': {
      backgroundColor: 'rgba(255, 205, 44, 0.1)',
    },
  },
  ' & .MuiSwitch-switchBase': {
    '&:hover': {
      backgroundColor: 'rgba(255, 205, 44, 0.1);',
    },
  },
  '.MuiSwitch-track': {
    backgroundColor: '#6A6A78',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#FFCD2C',
  },
}));

const Toggle: React.FC<Props> = ({
  ischecked,
  handleCheck,
  defaultChecked,

  name,
}) => (
  <div>
    <GreenSwitch
      name={name}
      checked={ischecked}
      onChange={handleCheck}
      {...label}
      defaultChecked={defaultChecked}
    />
  </div>
);

export default Toggle;
