import CustomButton from '../../../common/Button';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SelectInput } from '../../../common/input/Select';
import { decryptData } from '../../../../utils/encryption';
import { Input } from '../../../common/input/Input';
import { CountItems, showToastMessage } from '../../../../utils/helpers';
import CommonDatepicker from '../../../common/input/Datepicker';
import OrdersTable from './OrdersTable';
import axiosInstance from '../../../../utils/axios';

const initialValues = {
  order_type: '',
  time_slot: '',
  order_date: '',
  searchText: '',
};

const OrdersToDeliver = ({ type, tripsId, trip, tripResp }: any) => {

  const navigate = useNavigate();
  const [params, setParams] = useState(initialValues);
  const [formErrors, setFormErrors] = useState(initialValues);
  const [open, setopen] = useState({
    warning: false,
    update: false,
    success: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [orders, setOrders] = useState([] as any)

  const orderType = [
    {
      id: 'Same Day Delivery', name: 'Same Day Delivery',
    },
    {
      id: 'Normal', name: 'Normal',
    },
  ];

  const timeSlot = [
    {
      id: '9:00 - 12:00', name: '9:00 - 12:00',
    },
    {
      id: '12:00 - 15:00', name: '12:00 - 15:00',
    },
    {
      id: '15:00 - 18:00', name: '15:00 - 18:00',
    },
  ];


  const handleCancel = () => {
    setParams({ ...params, order_type: '', time_slot: '', searchText: '', order_date: '' });
    setApplyFilter(false);
  };

  const onDateChange = (event, name) => {
    setParams({ ...params, [name]: event });
    // setFilter(true);
    // console.log(params, 'cccc')
  };

  const handleSearch = (event: any) => {
    setParams({ ...params, [event.target.name]: event.target.value });
    setFilter(true);
    setApplyFilter(false);
  };

  const handleSubmit = async () => {
    setApplyFilter(true);
  }

  const fetchTrip = () => {
    axiosInstance
      .get(`/admin/trips/orders/confirmed/${tripsId}?order_type=${params.order_type}&time_slot=${params.time_slot}&order_date=${params.order_date}&search_key=${params.searchText}`)
      .then((response) => {
        let res = response.data.data
        let list: any = []
        if (res.confirmed_orders && res.linked_orders) {
          let confirmed_orders = res.confirmed_orders?.map(x => {
            x['checked'] = false;
            return x
          }) || []
          let linked_orders = res.linked_orders?.map(x => {
            x['checked'] = true;
            return x
          }) || [];

          list = [...linked_orders, ...confirmed_orders]
        }else{
          list = response.data.data
        }

        if (tripResp && tripResp.schedule_trip && tripResp.schedule_trip.orders) {
          list = list.map(x => {
            x['checked'] = tripResp.schedule_trip.orders.find(y => y.order_id === x.id) ? true : false
            return x
          })
        }
        setOrders(list)
      })
      .catch(() => {
        // showToastMessage('UNABLE TO FETCH TRIP ORDERS', 'error')
      })
  }


  useEffect(() => {
    fetchTrip();
  }, [params]);


  const onOrderSelectOrDeselect = (id) => {
    let list: any = [...orders];
    let index = list.findIndex(x => x.id === id);
    list[index].checked = !list[index].checked;
    setOrders(list)
  }

  // console.log(orders, 'orders...')

  return (
    <>
      <div className="divstyles bg-lightbg flex flex-col gap-6">
        <div className="h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mb-[5px]">
          <p className="text-[18px] font-bold font-nunitoRegular">Select Orders to be Delivered</p>
        </div>
        <div className="flex lg:flex-row flex-col gap-4 filters">
          <div className="w-full lg:w-[160px]">
            <SelectInput
              width="100%"
              options={orderType}
              handleChange={handleSearch}
              value={params.order_type}
              label="Order Type"
              name="order_type"
            />
          </div>
          <div className="w-full lg:w-[160px]">
            <SelectInput
              width="100%"
              options={timeSlot}
              handleChange={handleSearch}
              value={params.time_slot}
              label="Time Slot"
              name="time_slot"
            />
          </div>
          <div className="w-full lg:w-[260px]">
            <CommonDatepicker label="Order Date" onChange={(e) => onDateChange(e, 'order_date')} value={params.order_date} />
          </div>
          <div className="w-full lg:w-[320px]">
            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              value={params?.searchText}
              handleChange={handleSearch}
              label="Search"
              name="searchText"
            />
          </div>
          {
            filter === true ? (
              <>
                <div className="mt-2 flex justify-end ">
                  {applyFilter === false ? (
                    <CustomButton
                      disabled={CountItems(params) === 0}
                      onClick={handleSubmit}
                      width="w-[130px]"
                      variant="outlined"
                      size="large"
                      borderRadius={'0.5rem'}
                    >
                      Apply Filter
                    </CustomButton>
                  ) : (
                    <CustomButton
                      onClick={handleCancel}
                      width="w-[110px]"
                      variant="outlined"
                      size="large"
                      borderRadius="8px"
                    >
                      <p className="font-bold text-yellow font-nunitoRegular text-sm">Clear All</p>
                    </CustomButton>
                  )}
                </div>
              </>
            ) : null
          }
        </div>

        <OrdersTable type={type} onChange={onOrderSelectOrDeselect} orders={orders} tripResp={tripResp} trip={trip} />

      </div>
    </>
  );
};

export default OrdersToDeliver;
