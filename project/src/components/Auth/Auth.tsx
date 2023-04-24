import React from 'react';

interface Props {
  children: any
}
const Auth: React.FC<Props> = ({ children }) => (
  <div className="bg-darkGray p-8 lg:p-0 h-screen block lg:grid grid-cols-2 justify-between items-center">
    {children}
  </div>
);

export default Auth;
