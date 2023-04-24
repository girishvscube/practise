import Form from '../commonForm/Form';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';

const LeadUpdate = () => (
  <div>
    <BreadCrumb links={[
      { path: 'Leads', url: '/sales/leads' },
      { path: 'Edit Lead', url: '' },
    ]}
    />
    <Form type="update" title="Edit Lead" />
  </div>
);

export default LeadUpdate;
