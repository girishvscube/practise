
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BreadCrumb from '../../../common/Breadcrumb/BreadCrumb';
import axiosInstance from '../../../../utils/axios';
import { decryptData } from '../../../../utils/encryption';
import Tab from './Tab/Tab';
import BowserDetails from './Tab/BowserDetails/BowserDetails';
import PODetails from './PODetails';
import OrdersToDeliver from './OrdersToDeliver';
import { showToastMessage } from '../../../../utils/helpers';
import CircularProgress from '@mui/material/CircularProgress';

interface ScheduleProps {
  type: string,
  title: string
}

const Schedule = ({ type, title }: ScheduleProps) => {
  const { id } = useParams();
  const [trip, setTrip] = useState('' as any)
  const [tripResp, setTripResp] = useState('' as any)
  const [isLoading, setLoading] = useState(true)

  const TabConstants = [
    {
      title: 'PO Detail',
    },
    {
      title: 'Bowser Details',
    },
  ];



  const fetchTrip = (id) => {
    axiosInstance
      .get(`/admin/trip-orders/${id}`)
      .then((response) => {
        let resp = response.data.data
        setTrip(resp.trip)
        setTripResp(resp)
        setLoading(false)
      })
      .catch(() => {
        // show error message and navigate to list
        setLoading(false)
        showToastMessage('UNABLE TO FETCH ORDER', 'error')
      })
  }

  useEffect(() => {
    fetchTrip(decryptData(id))
  }, [id]);

  return (
    <>
      <BreadCrumb
        links={[
          { path: 'Trips', url: '/fleet_manage/trips' },
          { path: 'Schedule Trips', url: '' },
        ]}
      />

      <p className="font-black mb-7">Schedule Trip</p>

      {
        isLoading ? <div className="w-full h-80 flex justify-center items-center">
          <CircularProgress />
          <span className="text-3xl">Loading...</span>
        </div> :
          <div className="flex flex-col  sm:flex-row gap-5">
            <div className="flex flex-col w-full gap-5 ">
              <div className="bg-lightbg  rounded-lg">
                <Tab
                  cols={TabConstants}
                  data={[<PODetails data={trip} />, <BowserDetails data={trip.purchase_order} />]}
                />
              </div>
              <OrdersToDeliver trip={trip} type={type} tripsId={decryptData(id)} poId={trip?.po_id} tripResp={tripResp} />
            </div>
          </div>
      }

    </>
  );
};

export default Schedule;
