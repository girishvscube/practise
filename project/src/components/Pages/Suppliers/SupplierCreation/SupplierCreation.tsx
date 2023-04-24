import { useState } from 'react';
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';
import Form from './Form';
import CustomStepper from '../../../common/Stepper/CustomStepper';

const SupplierCreation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      title: 'Supplier Info',
      id: 1,
    },
    {
      title: 'Point of Contact',
      id: 2,
    },
  ];
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <div className="container mx-auto">
      <div>
        <BreadCrumb
          links={[
            { path: 'Suppliers', url: '/suppliers' },
            { path: 'Create New Supplier', url: '' },
          ]}
        />
        <p className="text-xl font-extrabold text-white font-nunitoRegular">
          Create Supplier Profile
        </p>

        <div className="my-4">
          <CustomStepper
            activeStep={activeStep}
            steps={steps}
            data={[<>1</>, <>2</>]}
          />
        </div>

        <div className="w-full  p-[6px] lg:p-[20px] bg-[#262938] rounded-lg">
          <Form handleNext={handleNext} handleBack={handleBack} />
        </div>
      </div>
    </div>
  );
};
export default SupplierCreation;
