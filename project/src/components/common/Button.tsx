import Button from '@mui/material/Button';
import React from 'react';

interface Props {
  disabled?: boolean
  children?: React.ReactNode | null
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  variant?: any
  width?: any
  size?: any
  icon?: any
  borderRadius?: any
  type?: any
}
const styles: any = {
  border: '1px solid #FFCD2C',
  color: '#FFCD2C',
  '&:hover': {
    border: '1px solid #FFCD2C',
    backgroundColor: '#FFE1801A',
  },
};

const styles1: any = {
  border: 'none',
  color: '#000',
  fontWeight: '700',
  background: 'linear-gradient(180deg, #FFD756 0%,#FFCD2C 100%)',
  backgroundColor: '#FFCD2C',
  '&:hover': {
    border: 'none',
    background: '#B5952F',
    backgroundColor: '#B5952F',
  },
  '&:active': {
    background: '#FFE180',
  },
};

const disabledStyles: any = {
  '&:disabled': {
    fontWeight: '700',
    border: '1px solid #6A6A78',
    color: '#6A6A78',
    backgroundColor: '#2F3344',
  },
};

const CustomButton: React.FC<Props> = ({
  disabled,
  children,
  onClick,
  variant = 'outlined',
  width,
  size,
  icon,
  borderRadius,
  type = 'button',
}) => (
  <div className={width}>
    <Button
      style={{ borderRadius, textTransform: 'none' }}
      fullWidth
      size={size}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
      startIcon={icon}
      className="font-nunitoRegular"
      type={type}
      sx={
        variant === 'outlined' && !disabled
          ? styles
          : variant === 'contained' && !disabled
            ? styles1
            : disabled && variant === 'contained'
              ? {
                '&:disabled': {
                  fontWeight: '700',
                  border: 'none',
                  color: '#6A6A78 !important',
                  backgroundColor: '#2F3344',
                },
              }
              : disabled
                ? disabledStyles
                : ''
      }
    >
      <p className="w-full font-bold font-nunitoRegular text-sm">{children}</p>
    </Button>
  </div>
);
CustomButton.defaultProps = {
  disabled: false,
  children: null,
  variant: '',
  width: '',
  size: '',
  icon: '',
  borderRadius: '',
  onClick: function test() {},
};
export default CustomButton;
