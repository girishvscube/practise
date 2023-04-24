import { useState } from 'react'
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import Form from './Form'
import CustomStepper from '../../../common/Stepper/CustomStepper'
import { useSearchParams } from 'react-router-dom'
import { decryptData } from '../../../../utils/encryption'

const Create = () => {
  const [activeStep, setActiveStep] = useState(0)

  const [searchParams] = useSearchParams()
  const lead_id = decryptData(searchParams.get('lead_id'))
  console.log('lead_id:', lead_id)

  const steps = [
    {
      title: 'Company Info',
      id: 1,
    },
    {
      title: 'Point of Contact',
      id: 2,
    },
    {
      title: 'Delivery Location',
      id: 3,
    },
  ]
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  return (
    <div className='container mx-auto  mb-20'>
      <div>
        <BreadCrumb
          links={[
            { path: 'Customers', url: '/customers' },
            { path: 'Create New Customer', url: '' },
          ]}
        />
        <p className='text-xl font-extrabold text-white font-nunitoRegular'>
          Create Customer Profile
        </p>

        <div className='my-4'>
          <CustomStepper
            activeStep={activeStep}
            steps={steps}
            data={[<> 1</>, <> 2</>, <> 3</>, <> 4</>]}
          />
        </div>

        <div className='w-full  divstyles lg:p-[20px] bg-[#262938] rounded-lg'>
          <Form lead_id={lead_id} handleNext={handleNext} handleBack={handleBack} />
        </div>
      </div>
    </div>
  )
}
export default Create
