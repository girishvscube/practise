import React from 'react';
import Form from './Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const CreateBrowser = () => (
  <div className="w-full">
    <BreadCrumb links={[
      { path: 'Bowser', url: '/fleet_manage/bowser' },
      { path: 'Create New Bowser', url: '' },
    ]}
    />
    <Form type="create" title="Create New Bowser" options="" />
  </div>
);

export default CreateBrowser;
