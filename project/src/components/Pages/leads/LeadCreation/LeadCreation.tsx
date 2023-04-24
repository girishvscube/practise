import React from 'react';
import Form from '../commonForm/Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const LeadCreation = () => (
  <div className="w-full">
    <BreadCrumb links={[
      { path: 'Leads', url: '/sales/leads' },
      { path: 'Create New Lead', url: '' },
    ]}
    />
    <Form type="create" title="Create New Lead" />
  </div>
);

export default LeadCreation;
