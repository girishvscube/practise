import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import Form from './Form'
import { useParams } from 'react-router-dom'

const EditPO = () => {
    const { id } = useParams()
    // console.log('Edit Order', id);
    return (
        <div className='container mx-auto'>
            <div>
                <BreadCrumb
                    links={[
                        { path: 'Purchase', url: '/purchase-orders' },
                        { path: 'View PO', url: `/purchase-orders/view/${id}` },
                        { path: 'Edit PO', url: '' },
                    ]}
                />
                <p className='text-xl font-extrabold text-white font-nunitoRegular'>
                    Edit Customer Profile
                </p>

                <br />
                <Form edit={true} id={id} />
            </div>
        </div>
    )
}

export default EditPO
