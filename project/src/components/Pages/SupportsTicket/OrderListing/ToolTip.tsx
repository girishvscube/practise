import * as React from 'react';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface ToolTipProps {
  value: any
}
export const ToolTip = ({ value }: ToolTipProps) => {
  return (
    <Tooltip
      title={(
        <div>
          {value.customer_delivery_details?.address_type}
          <p className="wrap">
            {value.customer_delivery_details?.address_1}
            {' '}
            {value.customer_delivery_details?.address_2}
            {' '}
            {value.customer_delivery_details?.city}
            {' '}
            {value.customer_delivery_details?.state}
            {' '}
            {value.customer_delivery_details?.pincode}
          </p>

          {value.customer_delivery_details?.phone ? (
            <p>
              Phone : +91
              {value.customer_delivery_details?.phone}
            </p>
          ) : null}
        </div>
      )}
    >
      <IconButton>
        <svg
          className="cursor-pointer"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.334 0.75H5.665C2.644 0.75 0.75 2.889 0.75 5.916V14.084C0.75 17.111 2.635 19.25 5.665 19.25H14.333C17.364 19.25 19.25 17.111 19.25 14.084V5.916C19.25 2.889 17.364 0.75 14.334 0.75Z"
            stroke="#FFCD2C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer"
          />
          <path
            d="M9.99414 14V10"
            stroke="#FFCD2C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.98914 6.20312H9.99914"
            stroke="#FFCD2C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconButton>
    </Tooltip>
  );
}
