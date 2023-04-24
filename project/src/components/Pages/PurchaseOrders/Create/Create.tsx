import { useState } from 'react'
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import Form from './Form'
import CustomStepper from '../../../common/Stepper/CustomStepper'

const Create = () => {
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    {
      title: 'Enter PO Details',
      id: 1,
    },
    {
      title: 'Purchase Order',
      id: 2,
    }
  ]
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  return (
    <div className='container mx-auto mb-16'>
      <div>
        <BreadCrumb
          links={[
            { path: 'Purchase', url: '/purchase-orders' },
            { path: 'Create New PO', url: '' },
          ]}
        />
        <p className='text-xl font-extrabold text-white font-nunitoRegular'>
          Create Purchase Order
        </p>

        <div className='my-4'>
          <CustomStepper
            activeStep={activeStep}
            steps={steps}
            data={[<> 1</>, <> 2</>]}
          />
        </div>

        <div className='w-full  rounded-lg'>
          <Form handleNext={handleNext} handleBack={handleBack} />
        </div>
      </div>
    </div>
  )
}
export default Create
