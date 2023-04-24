import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ redirectPath }: { redirectPath: string }) => {
  const { user } = useSelector((state: any) => state.auth);

  if (Object.keys(user).length) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
