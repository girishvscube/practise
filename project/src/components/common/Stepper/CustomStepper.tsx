import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { makeStyles } from '@mui/styles';
import RightLight from '../../../assets/icons/lightArrows/RightLight.svg';

const useStyles = makeStyles(() => ({
  root: {
    '& .Mui-active .MuiStepIcon-root': {
      color: '#FFCD2C',
      width: '36px',
      height: '36px',
    },
    '& .Mui-completed .MuiStepIcon-root': {
      color: '#FFCD2C',
      width: '36px',
      height: '36px',
    },

    '& .Mui-disabled .MuiStepIcon-root': {
      color: '#262938',
      width: '36px',
      height: '36px',
    },
    '& .MuiStepLabel-label.Mui-active': {
      color: '#FFCD2C',
      fontWeight: '600',
      fontSize: '14px',
    },
    '& .MuiStepLabel-label.Mui-disabled': {
      color: '#6A6A78',
      fontWeight: '600',
      fontSize: '14px',
    },
    '& .MuiStepLabel-label.Mui-completed': {
      color: '#FFF',
      fontWeight: '600',
      fontSize: '14px',
    },

    '& .MuiStepIcon-text': {
      fill: '#6A6A78 !important',
    },

    '& .Mui-active .MuiStepIcon-text': {
      fill: '#000 !important',
    },
  },
}));

const CustomStepper = (props: any) => {
  const { activeStep } = props;
  const classes = useStyles();
  return (
    <Box sx={{ width: '90%', justifyItems: 'center', alignItems: 'center' }}>
      <Stepper connector={<img src={RightLight} alt="" />} activeStep={activeStep}>
        {props.steps.map((label: any) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode
          } = {};

          return (
            <Step key={label.title} {...stepProps}>
              <StepLabel {...labelProps} className={classes.root}>
                <p className="sm:block hidden text-white">{label.title}</p>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
export default CustomStepper;
