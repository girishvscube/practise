import * as React from 'react';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DangerIcon from '../../../../assets/images/DangerIcon.svg';
import { makeStyles } from '@mui/styles';

interface ToolTipProps {
  value: any
}

const useStyles = makeStyles(() => ({
  tooltip: {
    backgroundColor: 'none',
  },

}));
export const ToolTip = ({ value }: ToolTipProps) => {
  const classes = useStyles();
  return (
    <Tooltip
      sx={{ backgroundColor: 'none' }}
      title={(
        <div>
          <p>
            <p>
              call Back at {' '}
              {moment(value?.call_back_time).format('LT')}
              ,
              {moment(value?.call_back_time).format('DD/MM/YYYY')}
            </p>
          </p>
        </div>
            )}
    >
      <IconButton>
        <img src={DangerIcon} alt="" />
      </IconButton>
    </Tooltip>
  );
};
