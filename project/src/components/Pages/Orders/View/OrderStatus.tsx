import React, { useState } from 'react';
import TextArea from '../../../common/input/TextArea';
import CustomButton from '../../../common/Button';
import { SelectInput } from '../../../common/input/Select';
import Status from '../../../common/Status';
import Validator from 'validatorjs';
import { orderStatusUpdation } from '../../../../features/orders/orderSlice';
import { useDispatch } from 'react-redux';
import { CountItems } from '../../../../utils/helpers';

interface Props {
  orderStatusList: any
  orderByid: any
  orderId: number
}

const fields = {
  orderStatus: '',
  notes: '',
};

const OrderStatus: React.FC<Props> = ({ orderId, orderByid, orderStatusList }) => {
  const dispatch = useDispatch();

  const [params, setParams] = useState(fields);
  const [errors, setErrors] = useState(fields);
  // console.log('errors:', errors);

  const handleOrderStatus = (e: any) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const UpdateStatus = async () => {
    const validation = new Validator(params, {
      orderStatus: 'required',
      // notes: 'required',
    });
    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });

      setErrors(fieldErrors);
      return false;
    }
    setErrors({
      orderStatus: '',
      notes: '',
    });

    dispatch(orderStatusUpdation({ status: params.orderStatus }, orderId));
    return true;
  };

  return (
    <div className="divstyles bg-lightbg p-4 border border-border rounded-lg">
      <p className="subheading">Order Status</p>
      <div className="bg-darkbg  flex flex-col gap-y-6 rounded-lg p-4 font-nunitoRegular">
        <div className="flex pb-3 border-b  border-border items-center justify-between ">
          <p className="text-textgray text-xs">Current Order Status:</p>
          <Status>{orderByid?.order?.status}</Status>
        </div>

        <SelectInput
          // width="100%"
          options={orderStatusList}
          handleChange={handleOrderStatus}
          value={params?.orderStatus}
          error={errors?.orderStatus?.length > 0}
          helperText={errors?.orderStatus}
          label="Status"
          name="orderStatus"
        />

        <TextArea
          rows={5}
          handleChange={handleOrderStatus}
          name="notes"
          value={params?.notes}
          placeholder="Additional Info"
          // error={errors?.notes?.length > 0}
          // helperText={errors?.notes}
        />
        {/* {errors?.notes && <p className='ml-4 text-errortext text-xs'>{`*${errors?.notes}`}</p>} */}

        <div className="  flex justify-between ">
          <div />
          <CustomButton
            disabled={CountItems(params) === 0}
            onClick={UpdateStatus}
            borderRadius="0.5rem"
            width="w-fit "
            variant="outlined"
            size="medium"
            icon={(
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.2735 10.3407H10.2535C10.0767 10.3407 9.90712 10.4109 9.78209 10.5359C9.65707 10.6609 9.58683 10.8305 9.58683 11.0073C9.58683 11.1841 9.65707 11.3537 9.78209 11.4787C9.90712 11.6037 10.0767 11.674 10.2535 11.674H11.8535C11.1181 12.4425 10.1698 12.9735 9.13027 13.1989C8.09078 13.4243 7.00764 13.3337 6.02001 12.9388C5.03239 12.5439 4.18541 11.8627 3.58789 10.9828C2.99037 10.1028 2.66961 9.0643 2.66683 8.00065C2.66683 7.82384 2.59659 7.65427 2.47157 7.52925C2.34654 7.40422 2.17697 7.33398 2.00016 7.33398C1.82335 7.33398 1.65378 7.40422 1.52876 7.52925C1.40373 7.65427 1.3335 7.82384 1.3335 8.00065C1.33702 9.30252 1.72164 10.5749 2.4399 11.6607C3.15815 12.7465 4.17861 13.5982 5.37532 14.1108C6.57204 14.6234 7.89265 14.7743 9.17417 14.5451C10.4557 14.3158 11.6421 13.7163 12.5868 12.8207V14.0007C12.5868 14.1775 12.6571 14.347 12.7821 14.4721C12.9071 14.5971 13.0767 14.6673 13.2535 14.6673C13.4303 14.6673 13.5999 14.5971 13.7249 14.4721C13.8499 14.347 13.9202 14.1775 13.9202 14.0007V11.0007C13.9185 10.8284 13.8503 10.6635 13.7297 10.5404C13.6092 10.4174 13.4457 10.3458 13.2735 10.3407ZM8.00016 1.33398C6.29109 1.33886 4.64916 1.99993 3.4135 3.18065V2.00065C3.4135 1.82384 3.34326 1.65427 3.21823 1.52925C3.09321 1.40422 2.92364 1.33398 2.74683 1.33398C2.57002 1.33398 2.40045 1.40422 2.27542 1.52925C2.1504 1.65427 2.08016 1.82384 2.08016 2.00065V5.00065C2.08016 5.17746 2.1504 5.34703 2.27542 5.47206C2.40045 5.59708 2.57002 5.66732 2.74683 5.66732H5.74683C5.92364 5.66732 6.09321 5.59708 6.21823 5.47206C6.34326 5.34703 6.4135 5.17746 6.4135 5.00065C6.4135 4.82384 6.34326 4.65427 6.21823 4.52925C6.09321 4.40422 5.92364 4.33398 5.74683 4.33398H4.14683C4.88181 3.5659 5.82956 3.03498 6.86843 2.80939C7.9073 2.5838 8.98989 2.67381 9.97723 3.06789C10.9646 3.46197 11.8116 4.14213 12.4097 5.02105C13.0077 5.89998 13.3294 6.93757 13.3335 8.00065C13.3335 8.17746 13.4037 8.34703 13.5288 8.47206C13.6538 8.59708 13.8234 8.66732 14.0002 8.66732C14.177 8.66732 14.3465 8.59708 14.4716 8.47206C14.5966 8.34703 14.6668 8.17746 14.6668 8.00065C14.6668 7.12517 14.4944 6.25827 14.1594 5.44943C13.8243 4.64059 13.3333 3.90566 12.7142 3.28661C12.0952 2.66755 11.3602 2.17649 10.5514 1.84145C9.74255 1.50642 8.87564 1.33398 8.00016 1.33398Z"
                  fill={`${CountItems(params) === 0 ? '#6A6A78' : '#FFCD2C'}`}
                />
              </svg>
            )}
          >
            Update Status
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
