import CustomButton from '../../../../common/Button';
import React, { useEffect, useState } from 'react';
import Plus from '../../../../../assets/icons/filledIcons/Plus.svg';
import OrderTable from './Table';
import axiosInstance from '../../../../../utils/axios';
import { decryptData } from '../../../../../utils/encryption';
import { DateFiter } from '../../../../../components/common/DateFiter';
import { Navigate, useNavigate } from 'react-router-dom';

interface PoProps {
  supplierId: any
  orders: any
}
const PurchaseOrders = ({ supplierId, orders }: PoProps) => {
  const [poStats, setPoStats] = useState({
    count: 0,
    total: 0,
  });

  const [date, setDate] = useState({
    start_date: '',
    end_date: ''
  })

  const navigate = useNavigate();

  const handleAdd = () =>{
    navigate(`/purchase-orders/create/?supplier_id=${supplierId}`);
  }

  // const dispatch = useDispatch()

  useEffect(() => {
    fetchSupplierStats();
  }, [supplierId, date]);

  const fetchSupplierStats = () => {
    axiosInstance
      .get(
        `/admin/supplier/view/purchase/count/${decryptData(supplierId)}?start_date=${date.start_date}&end_date=${date.end_date}`,
      )
      .then((response) => {
        setPoStats(response?.data?.data);
      })
      .catch(() => { });
  };

  const onDateSelect = (date: any) => {
    setDate(date)
  };


  return (
    <div className="mobileView bg-lightbg flex flex-col gap-6">
      <div className="flex justify-between">
        <p className="subheading"> Purchase Orders</p>
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>

      <div className="bg-darkbg p-6 rounded-lg flex lg:flex-row lg:justify-between flex-col gap-7">
        <div className="flex gap-2 lg:justify-center lg:items-center">
          <p className="text-textgray font-nunitoRegular">
            Total purchase Orders:
            <span className="text-white">
              {' '}
              {poStats?.count}
            </span>
          </p>
        </div>
        <div className="hidden lg:block h-10 border-r border-border" />
        <div className="flex gap-2 lg:justify-center lg:items-center">
          <p className="text-textgray font-nunitoRegular">
            Total PO Value:
            <span className="text-white">
              {' '}
              {Number(poStats?.total).toFixed(2) || 0}
            </span>
          </p>
        </div>
        <div className="w-40 mt-2 lg:mt-0 mx-auto lg:mx-0">
          <CustomButton
            onClick={handleAdd}
            width="w-full"
            variant="outlined"
            size="medium"
            borderRadius="8px"
            icon={<img src={Plus} alt="" />}
          >
            Create New PO
          </CustomButton>
        </div>
      </div>
      <div className="bg-darkbg  rounded-lg">
        <OrderTable rows={orders} />
      </div>
    </div>
  );
};

export default PurchaseOrders;
