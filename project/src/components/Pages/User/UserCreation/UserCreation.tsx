import React from 'react';
import Form from '../CommonForm/Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const UserCreate = () => (
  <div className="w-full">
    <BreadCrumb links={[
      { path: 'Users', url: '/users' },
      { path: 'Create New User', url: '' },
    ]}
    />
    <Form type="create" title="Create New User" />
  </div>
);

export default UserCreate;
