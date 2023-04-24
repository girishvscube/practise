import { useState, useEffect } from 'react';
import CustomButton from '../../../common/Button';
import { Input } from '../../../common/input/Input';
import { SelectInput } from '../../../common/input/Select';
import Validator from 'validatorjs';
// import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createParkingStation, updateParkingStation, setApiSuccess, updateApi } from '../../../../features/parking/parkingSlice';
import Popup from '../../../common/Popup';
import { getStateList } from '../../../../features/dropdowns/dropdownSlice';
import axiosInstance from '../../../../utils/axios';
import { toast } from 'react-toastify';

interface StationProps {
  type: string
  title: string
}

const initialValues = {
  station_name: '',
  capacity: '',
  address: '',
  city: '',
  pincode: '',
  state: '',
};

const Form = ({ type, title }: StationProps) => {
  const { states } = useSelector((state: any) => state.dropdown);
  const { apiSuccess, updateApiSuccess } = useSelector((state: any) => state.parking);
  const navigate = useNavigate();
  const { id } = useParams();
  const [params, setParams] = useState(initialValues);
  const [formErrors, setFormErrors] = useState(initialValues);
  const capacityList = [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }, { name: 5 }, { name: 6 }, { name: 7 }, { name: 8 }];
  const [open, setopen] = useState({
    warning: false,
    update: false,
    success: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStateList());
  }, []);

  const handleChange = (e: any) => {
    if (e.target) {
      const { name, value } = e.target;
      if (name === 'capacity' || name === 'pincode') {
        const re = /^[0-9\b]+$/
        if (value && !re.test(value)) {
          return
        }
      }
      setParams({ ...params, [e.target.name]: e.target.value });
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  useEffect(() => {
    if (type === 'update') {
      fetchStations();
    }
  }, []);

  useEffect(() => {
    if (apiSuccess === true) {
      setopen({ ...open, success: true });
    }
    if (updateApiSuccess === true) {
      setopen({ ...open, update: true });
    }
  }, [apiSuccess, updateApiSuccess]);

  // auto fill data for edit
  const fetchStations = async () => {
    const data: any = await axiosInstance.get(
      `${process.env.REACT_APP_BACKEND_URL}/admin/parking-station/${id}`,
    );
    setParams(data.data.data);
  };

  const handleSubmit = async () => {

    if (params.station_name.length > 100)
      return setFormErrors({ ...formErrors, station_name: "The station name field can't contain more than 100 characters." });

    if (params.city.length > 30)
      return setFormErrors({ ...formErrors, city: "The city field can't contain more than 30 characters." });

    if (params.address.length > 500)
      return setFormErrors({ ...formErrors, address: "The address field can't contain more than 500 characters." });

    const validation = new Validator(
      params,
      {
        station_name: 'required|string|max:20',
        capacity: 'required',
        address: 'required|string|max:200',
        city: 'required',
        pincode: 'required|numeric|min:100000|max:999999',
        state: 'required',
      },
    );

    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });

      setFormErrors(fieldErrors);
      return false;
    }
    /* eslint-disable */
    id ? dispatch(updateParkingStation(params, id)) : dispatch(createParkingStation(params))
    /* eslint-enable */
    showToastMessage();
    return true;
  };

  const showToastMessage = () => {
    toast.success('Parking Station Created Successfully!', {
      position: toast.POSITION.TOP_RIGHT,
    });
    navigate('/fleet_manage/parking-station');
  };

  const handleOpen = (key: any, value: any) => {
    setopen({ ...open, [key]: value });
  };

  const handleOkay = () => {
    navigate('/fleet_manage/parking-station');
  };

  return (
    <div>
      <div>
        <p className="text-xl font-extrabold text-white font-nunitoRegular">{title}</p>
        <div className="w-full mt-[29px] p-[6px] lg:p-[20px] bg-lightbg rounded-lg border border-border">
          <div className="h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mb-[24px]">
            <p className="text-[18px] font-bold font-nunitoRegular">Station Details</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
              <div className="flex flex-col gap-[24px]">
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.station_name}
                  value={params.station_name}
                  handleChange={handleChange}
                  helperText={formErrors.station_name}
                  label="Parking Station Name"
                  name="station_name"
                />

                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.capacity}
                  value={params.capacity}
                  handleChange={handleChange}
                  helperText={formErrors.capacity}
                  label="Parking capacity"
                  name="capacity"
                />

                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.address}
                  value={params.address}
                  handleChange={handleChange}
                  helperText={formErrors.address}
                  label="Parking Address"
                  name="address"
                />
              </div>
              <div className="flex flex-col gap-[24px]">
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors.city}
                  value={params.city}
                  handleChange={handleChange}
                  helperText={formErrors.city}
                  label="City"
                  name="city"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                  <Input
                    rows={1}
                    width="w-full"
                    disabled={false}
                    readOnly={false}
                    error={!!formErrors.pincode}
                    value={params.pincode}
                    handleChange={handleChange}
                    helperText={formErrors.pincode}
                    label="Pincode"
                    name="pincode"
                  />
                  <SelectInput
                    options={states}
                    handleChange={handleChange}
                    value={params.state}
                    error={!!formErrors.state}
                    helperText={formErrors.state}
                    label="Select State"
                    name="state"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end mt-20 lg:mt-10">
              <div className="flex gap-8 pb-3 lg:pb-0">
                <div className=" w-[150px] lg:w-[106px]">
                  <CustomButton
                    onClick={() => {
                      setopen({ ...open, warning: true });
                    }}
                    // width="w-[106px]"
                    width="w-full"
                    variant="outlined"
                    size="large"
                    borderRadius="7px"
                  >
                    Cancel
                  </CustomButton>
                </div>
                <div className=" w-[150px] lg:w-[307px]">
                  <CustomButton
                    onClick={handleSubmit}
                    // width="w-[307px]"
                    width="w-full"
                    variant="contained"
                    size="large"
                    borderRadius="7px"
                  >
                    Submit Details
                  </CustomButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <Popup
        open={open.update}
        handleClickOpen={handleOpen}
        popup="success"
        subtitle=""
        popupmsg="User Updated Successfully!"
        handleOkay={handleOkay}
      />

      <Popup
        open={open.success}
        handleClickOpen={handleOpen}
        popup="success"
        subtitle=""
        popupmsg="User Created Successfully!"
        handleOkay={handleOkay}
      /> */}

      <Popup
        open={open.warning}
        Confirmation={handleOkay}
        handleClickOpen={handleOpen}
        popup="warning"
        subtitle="Changes are not Saved!"
        popupmsg="Do you want to proceed without changes?"
        handleOkay={handleOkay}
      />
    </div>
  );
};

export default Form;
