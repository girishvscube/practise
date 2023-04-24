import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import Form from './Form'
import { useParams, useLocation } from 'react-router-dom'
import { decryptData } from '../../../../utils/encryption'

const EditCustomer = () => {
  let { id } = useParams()
  id = decryptData(id)
  const { pathname } = useLocation()

  return (
    <div className='container mx-auto'>
      <div>
        <BreadCrumb
          links={[
            { path: 'Customers', url: '/customers' },
            { path: 'Edit Customer', url: '' },
          ]}
        />
        <p className='text-xl font-extrabold text-white font-nunitoRegular'>
          Edit Customer Profile
        </p>
        <div className='w-full mt-[29px] p-[6px] lg:p-[20px] bg-[#262938] rounded-lg'>
          <Form id={id} edit={!!pathname.includes('edit')} />
        </div>
      </div>
    </div>
  )
}

export default EditCustomer
