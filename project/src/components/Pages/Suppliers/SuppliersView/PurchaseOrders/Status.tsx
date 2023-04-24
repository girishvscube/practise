import React from 'react';

interface StatusProps {
  status: any
}
const Status = ({ status }: StatusProps) => (
  <div>
    {status?.includes('Done') ? (
      <p className="text-limeGreen">{status}</p>
    ) : (
      <>
        {status?.includes('Processing') ? (
          <p className="text-[#9EA7AD]">{status}</p>
        ) : (
          <>
            {status?.includes('Raised') ? (
              <p className="text-High">{status}</p>
            ) : (
              <p className="text-yellowOrange">{status}</p>
            )}
          </>
        )}
      </>
    )}
  </div>
);

export default Status;
