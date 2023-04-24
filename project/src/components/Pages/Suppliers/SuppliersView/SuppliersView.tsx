import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import SupplierDetails from './SupplierDetails'
import Tab from './Tab/Tab'
import PurchaseOrders from './PurchaseOrders/PurchaseOrders'
import Payments from './Payments/Payments'
import PocList from './Pocs/PocList'
import { fetchSupplier } from '../../../../features/suppliers/supplierSlice'
import axiosInstance from '../../../../utils/axios'
import { decryptData } from '../../../../utils/encryption'
import CircularProgress from '@mui/material/CircularProgress'
import Logs from '../../../common/Logs'

const SuppliersView = () => {
  /* eslint-disable*/
  const dispatch = useDispatch()
  const { id } = useParams()
  const supplierId: any = id

  const [po, setPo] = useState()

  const { supplier } = useSelector((state: any) => state.supplier)

  const isLoading = false
  /* eslint-enable */
  const TabConstants = [
    {
      title: 'Purchase Orders',
    },

    {
      title: 'Point of Contact',
    },
    {
      title: 'Activity Logs',
    },
  ]

  useEffect(() => {
    dispatch(fetchSupplier(decryptData(supplierId)))
    fetchPO()
  }, [])

    const fetchPO = () => {
        axiosInstance
            .get(`/admin/supplier/view/purchase/${decryptData(supplierId)}`)
            .then((response) => {
                setPo(response?.data?.data?.data)
            })
            .catch(() => { })
    }

    return (
        <>
            <BreadCrumb
                links={[
                    { path: 'Suppliers', url: '/suppliers' },
                    { path: 'View Supplier', url: '' },
                ]}
            />

            <p className='font-black mb-7'>View Supplier</p>
            {
                !isLoading ? <> {isLoading ? (
                    <div className='w-full h-80 flex justify-center items-center'>
                        <CircularProgress />
                        <span className='text-3xl'>Loading...</span>
                    </div>
                ) : (
                    <div className=' flex flex-col lg:grid lg:grid-cols-[20rem,minmax(670px,_1fr)] gap-5 '>
                        <div className='flex flex-col gap-5  '>
                            {/* <SupplierDetails/> */}
                            <SupplierDetails supplier={supplier} />
                        </div>

                        <div className='flex flex-col gap-5 '>
                            <div className='rounded-lg custom-tab'>
                                <Tab
                                    cols={TabConstants}
                                    data={[
                                        <PurchaseOrders supplierId={supplierId} orders={po} />,

                                        <PocList supplierId={decryptData(supplierId)} />,
                                        <Logs logs={supplier?.logs} />,
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                )}</> : <div className='w-full h-80 flex justify-center items-center'>
                    <CircularProgress />
                    <span className='text-3xl'>Loading...</span>
                </div>
            }
        </>
    )
}

export default SuppliersView
