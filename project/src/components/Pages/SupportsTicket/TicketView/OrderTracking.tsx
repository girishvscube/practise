import React from 'react'
import TrackingTable from './TrackingTable'
import { useEffect, useState } from 'react'
import axiosInstance from './../../../../utils/axios'
import PocList from './PocList'

const OrderTracking = ({ orderId }: any) => {
  const [trackingData, setTrackingData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axiosInstance
      .get(`/admin/support-tickets/orders/tracking/${orderId}`)
      .then((response) => {
        // console.log('response:', response)
        setLoading(false)
        setTrackingData(response.data.data)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error:', error)
      })
  }, [orderId])

  return (
    <div>
      <p className='subheading'>Tracking Info </p>
      {/* <TrackingTable rows={rows} /> */}
      <TrackingTable loading={loading} trackingData={trackingData} />
    </div>
  )
}
export default OrderTracking
