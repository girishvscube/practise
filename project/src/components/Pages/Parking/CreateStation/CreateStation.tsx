import React from 'react';
import Form from '../CommonForm/Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const CreateStation = () => (
  <div className="w-full">
    <BreadCrumb links={[
      { path: 'Parking Stations', url: '/fleet_manage/parking-station' },
      { path: 'Create New Parking Station', url: '' },
    ]}
    />
    <Form type="create" title="Create New Parking Station" />
  </div>
);

export default CreateStation;
