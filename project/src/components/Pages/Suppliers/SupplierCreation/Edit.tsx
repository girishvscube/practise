import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';
import Form from './Form';

const SupplierEdit = () => (
  <div className="container mx-auto">
    <div>
      <BreadCrumb links={[
        { path: 'Supplier', url: '/suppliers' },
        { path: 'Edit Supplier', url: '' },
      ]}
      />
      <p className="text-xl font-extrabold text-white font-nunitoRegular">Edit Supplier Profile</p>
      <div className="w-full mt-[29px] p-[6px] lg:p-[20px] bg-lightbg rounded-lg">
        <Form />
      </div>
    </div>
  </div>
);

export default SupplierEdit;
