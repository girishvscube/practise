import { useState } from 'react'
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import Form from './Form'
import CustomStepper from '../../../common/Stepper/CustomStepper'
import { useSearchParams } from 'react-router-dom'
import { decryptData } from '../../../../utils/encryption'

const Create = () => {
  const [searchParams] = useSearchParams()
  const cust_id = searchParams.get('cust_id')
  // console.log('leadid', leadid)

  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    {
      title: 'Order Details',
      id: 1,
    },
    {
      title: 'Order Confirmation & PI',
      id: 2,
    },
    {
      title: 'Proforma invoice',
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
    <div className='container mx-auto mb-16'>
      <div>
        <BreadCrumb
          links={[
            { path: 'Orders', url: '/sales/orders' },
            { path: 'Create New Customer', url: '' },
          ]}
        />
        <p className='text-xl font-extrabold text-white font-nunitoRegular'>Create New Order</p>

        <div className='my-4'>
          <CustomStepper
            activeStep={activeStep}
            steps={steps}
            data={[<> 1</>, <> 2</>, <> 3</>, <> 4</>]}
          />
        </div>

        <div className='w-full  rounded-lg'>
          <Form
           
            cust_id={cust_id}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </div>
      </div>
    </div>
  )
}
export default Create
