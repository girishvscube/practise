import Form from '../Create/Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const UpdateBrowser = () => (
  <div>
    <BreadCrumb links={[
      { path: 'Bowser', url: '/fleet_manage/bowser' },
      { path: 'Update Bowser', url: '' },
    ]}
    />
    <Form type="update" title="Update Bowser" value="" label="" helperText="" options="" width="" name="" />
  </div>
);

export default UpdateBrowser;
