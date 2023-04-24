import Form from '../CommonForm/Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const StationUpdate = () => (
  <div>
    <BreadCrumb links={[
      { path: 'Parking Stations', url: '/fleet_manage/parking-station' },
      { path: 'Update Parking Station', url: '' },
    ]}
    />
    <Form type="update" title="Update Parking Station" />
  </div>
);

export default StationUpdate;
