import Form from '../CommonForm/Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const UserUpdate = () => (
  <div>
    <BreadCrumb links={[
      { path: 'Users', url: '/users' },
      { path: 'Edit User Details', url: '' },
    ]}
    />
    <Form type="update" title="Edit User Details" />
  </div>
);

export default UserUpdate;
