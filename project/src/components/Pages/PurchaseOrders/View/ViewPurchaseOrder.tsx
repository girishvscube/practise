import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'

import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb'
import Tab from './Tab/Tab'
import POStatus from './POStatus'
import PODetails from './PODetails'
import SupplierDetails from './SupplierDetails'
import PaymentsInfo from './PaymentsInfo'
import PriceInfo from './PriceInfo'
import { decryptData } from '../../../../utils/encryption'
import { fetchPoById } from '../../../../features/PurchaseOrders/purchaseOrderSlice'
import AssiciatedSo from './AssiciatedSo'
import CircularProgress from '@mui/material/CircularProgress'
import Logs from '../../../common/Logs'

const ViewPurchaseOrder = () => {
  /* eslint-disable*/
  const dispatch = useDispatch()
  const { id } = useParams()
  const PoId: any = id

  const [tabGroup, setTabGroup] = useState([
    {
      title: 'Supplier Details',
    },
    {
      title: 'PO Price & Payments',
    },
    {
      title: 'Activity Logs',
    },
  ])

  const { PoById, isLoading } = useSelector((state: any) => state.purchaseOrder)

  useEffect(() => {
    PoId && dispatch(fetchPoById(PoId))
  }, [])

  useMemo(() => {
    if (PoById.status === 'PO_CONFIRMED') {
      let index = tabGroup.findIndex((x) => x.title === 'Associate PO')
      if (index == -1) {
        let list = [
          ...tabGroup,
          ...[
            {
              title: 'Associate PO',
            },
          ],
        ]
        setTabGroup(list)
      }
    }
  }, [PoById])

  /* eslint-enable */

  return (
    <>
      <BreadCrumb
        links={[
          { path: 'Purchase Order', url: '/purchase-orders' },
          { path: 'View Purchase Order', url: '' },
        ]}
      />

      <p className='font-black mb-7'>View Purchase Order</p>
      {isLoading ? (
        <div className='w-full h-80 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : (
        <div className='mb-24 grid grid-cols-1 sm:grid-cols-[20rem,minmax(670px,_1fr)] gap-5 '>
          <div className='flex flex-col gap-5  '>
            <PODetails PoId={PoId} PoById={PoById} />
            <POStatus PoId={PoId} PoById={PoById} />
          </div>

          <div className='flex flex-col gap-5 '>
            <div className='rounded-lg'>
              <Tab
                cols={tabGroup}
                data={[
                  <div className=''>
                    <SupplierDetails PoById={PoById} />
                  </div>,

                  <div className=''>
                    <PriceInfo PoById={PoById} />
                    <PaymentsInfo PoById={PoById} />
                  </div>,

                  <Logs logs={PoById?.logs} />,
                  <AssiciatedSo PoId={PoId} />,
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ViewPurchaseOrder
