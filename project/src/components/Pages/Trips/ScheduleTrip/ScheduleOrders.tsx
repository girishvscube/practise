import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import CustomButton from '../../../common/Button';
import axiosInstance from '../../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import Validator from 'validatorjs';
import { TimeandDatePicker } from '../../../common/DateTimePicker';
import { showToastMessage } from '../../../../utils/helpers';
import Popup from '../../../common/Popup';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#ffffff',
    },
    '& th ': {
      color: '#6A6A78',
    },
    '& .css-i4bv87-MuiSvgIcon-root': {
      color: '#ffffff'
    },

  },

  tr: {
    '& td:first-child ': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
    '& td:last-child ': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
    },

  },

  statusAssigned: {
    color: '#3AC430',
  },
  statusUnassigned: {
    color: '#EF4949',
  },

  scheduleheading: {
    color: '#6A6A78',
    fontSize: '14px'
  },

  customWidth: {
    minWidth: '700px',
  },

}));

let initialValues = {
  start_time: '',
  end_time: '',
  po_arrival_time: '',
}

const ScheduleOrders = ({ type, selectedItems, timeChange, trip }: any) => {
  const classes = useStyles();
  const dragItem: any = useRef();
  const dragOverItem: any = useRef();

  const [isLoading, setLoading] = useState(false);
  const [open, setopen] = useState({
    warning: false,
    update: false,
    success: false,
  });
  const [formErrors, setFormErrors] = useState(initialValues);
  const [params, setParams] = useState(initialValues);

  const [dragList, setDragList] = useState(selectedItems)

  useEffect(() => {
    setDragList(selectedItems)
  }, [selectedItems])



  useEffect(() => {
    if (trip) {
      setParams({
        start_time: trip.start_time,
        end_time: trip.end_time,
        po_arrival_time: trip.po_arrival_time
      })
    }
  }, [trip])
  const navigate = useNavigate();

  const handleSubmit = async () => {
    let payload = {
      start_time: params?.start_time ? dayjs(params.start_time).format('YYYY-MM-DD HH:mm:ss') : '',
      end_time: params?.end_time ? dayjs(params.end_time).format('YYYY-MM-DD HH:mm:ss') : '',
      po_arrival_time: params?.po_arrival_time ? dayjs(params.po_arrival_time).format('YYYY-MM-DD HH:mm:ss') : '',
      orders: dragList.map(x => {
        return {
          so_id: x.id,
          schedule_time: dayjs(x.schedule_time).format('YYYY-MM-DD HH:mm:ss')
        }

      })
    }
    // console.log(payload, 'payload')
    const validation = new Validator(payload, {
      start_time: 'required',
      end_time: 'required',
      po_arrival_time: 'required',
      orders: 'required',
    });
    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });
      console.log(fieldErrors)
      setFormErrors(fieldErrors);
      return false;
    }
    createTrip(payload)
    return true;
  };
  const handleChange = (e, type): any => {
    setFormErrors(initialValues)
    const value = moment(new Date(e)).format('YYYY-MM-DD HH:mm:ss')
    setParams({ ...params, [type]: value })
  }

  const handleOrderTimeChange = (e, id) => {
    setFormErrors(initialValues)
    timeChange(e, id)
  }


  // console.log(type === 'update', 'type')

  const createTrip = (payload) => {
    setLoading(true)
    axiosInstance
      .put(`/admin/trip-orders/${trip.id}`, payload)
      .then((response) => {
        console.log(response, 'res...')
        setLoading(false)
        navigate('/fleet_manage/trips');
        showToastMessage('Trip Scheduled Successfully!', 'success')
      })
      .catch((error) => {
        // show error message and navigate to list
        setLoading(false)
        showToastMessage(error?.response?.data?.errors?.message, 'error')
      })

  }

  const handleOpen = (key: any, value: any) => {
    setopen({ ...open, [key]: value });
  };

  const handleOkay = () => {
    navigate(`/fleet_manage/trips`);
  };

  //drag and drop
  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    const copyListItems = [...dragList];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setDragList(copyListItems);
  };


  const handleNo = () => {
    handleOpen('warning', false)
  }




  return (
    <>
      <div className={classes.customWidth}>
        <div className='subdiv'>
          {/* ----------heading row------------ */}
          <div className='flex justify-left'>
            <div className="w-[60px]">
              <span></span>
            </div>
            <div className="w-[150px]">
              <span className={classes.scheduleheading}>Order</span>
            </div>
            <div className="w-[500px]">
              <span className={classes.scheduleheading}>Select the location inside trip</span>
            </div>
            <div className="w-[700px]">
              <span className={classes.scheduleheading}>Est Time of Arrival</span>
            </div>
          </div>
          {/* --------------------parking row---------------------- */}
          <div className='flex justify-left mt-8 items-center'>
            <div className="w-[60px]">
              <span></span>
            </div>
            <div className="w-[150px]">
              <span>1.</span>
            </div>
            <div className="w-[500px]">
              <span style={{ color: '#FFCD2C' }}>Parking Station/ Start time</span>
            </div>
            <div className="w-[700px]">
              <TimeandDatePicker
                label="Select Time of Arrival"
                value={params.start_time}
                error={!!formErrors?.start_time}
                handleChange={(e) => handleChange(e, 'start_time')}
              />
              {formErrors.start_time ? <p className='text-xs text-red-600 ml-4'>*required</p> : <></>}
            </div>
          </div>
          {/* -----------------------PO row---------------------- */}
          <div className='flex justify-left mt-4 items-center'>
            <div className="w-[60px]">
              <span></span>
            </div>
            <div className="w-[150px]">
              <span>2.</span>
            </div>
            <div className="w-[500px]">
              <span style={{ color: '#FFCD2C' }}>PO{trip?.po_id}</span>
            </div>
            <div className="w-[700px]">
              <TimeandDatePicker
                error={!!formErrors?.po_arrival_time}
                label="Select Time of Arrival"
                value={params.po_arrival_time}
                handleChange={(e) => handleChange(e, 'po_arrival_time')}
              />
              {formErrors.po_arrival_time ? <p className='text-xs text-red-600 ml-4'>*required</p> : <></>}
            </div>
          </div>
        </div>
        {/* --------------------SO row---------------------- */}


        {
          dragList.map((x, index) =>
            <div className='subdiv mt-5 cursor-move' onDragStart={(e) => dragStart(e, index)}
              onDragEnter={(e) => dragEnter(e, index)}
              onDragEnd={drop}
              key={index}
              draggable>
              <div className='flex justify-left items-center'>
                <div className="w-[60px]">
                  <div className="">
                    <svg
                      width="10"
                      height="18"
                      viewBox="0 0 10 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-move"
                    >
                      <circle cx="2" cy="2" r="2" fill="#404050" />
                      <circle cx="8" cy="2" r="2" fill="#404050" />
                      <circle cx="2" cy="9" r="2" fill="#404050" />
                      <circle cx="8" cy="9" r="2" fill="#404050" />
                      <circle cx="2" cy="16" r="2" fill="#404050" />
                      <circle cx="8" cy="16" r="2" fill="#404050" />
                    </svg>
                  </div>
                </div>
                <div className="w-[150px]">
                  <span>{index + 3}</span>
                </div>
                <div className="w-[500px]">
                  <span style={{ color: '#FFCD2C' }}>{x.id}</span>
                </div>
                <div className="w-[700px]">
                  <TimeandDatePicker
                    error={false}
                    label="Select Time of Arrival"
                    value={x.schedule_time}
                    handleChange={(e) => handleOrderTimeChange(e, x.id)}
                  />
                </div>
              </div>
            </div>
          )}




        <div className='subdiv mt-5'>
          {/* --------------------SO row---------------------- */}
          <div className='flex justify-left items-center'>
            <div className="w-[60px]">
              <span></span>
            </div>
            <div className="w-[150px]">
              <span>{selectedItems.length + 3}</span>
            </div>
            <div className="w-[500px]">
              <span style={{ color: '#FFCD2C' }}>Parking Station/ End time</span>
            </div>
            <div className="w-[700px]">
              <TimeandDatePicker
                error={!!formErrors?.end_time}
                label="Select Time of Arrival"
                value={params.end_time}
                handleChange={(e) => handleChange(e, 'end_time')}
              />
              {formErrors.end_time ? <p className='text-xs text-red-600 ml-4'>*required</p> : <></>}
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------buttons-------------------- */}
      <div className="flex items-center justify-center lg:justify-end lg:mt-8">
        <div className="flex gap-8 pb-3 lg:pb-0">
          <div className=" w-[150px] lg:w-[106px]">
            <CustomButton
              disabled={isLoading}
              onClick={() => {
                setopen({ ...open, warning: true });
              }}
              // width="w-[106px]"
              width="w-full"
              variant="outlined"
              size="large"
              borderRadius={'8px'}
            >
              Cancel
            </CustomButton>
          </div>
          <div className=" w-[150px] lg:w-[307px]">
            <CustomButton
              disabled={!selectedItems.length || isLoading}
              onClick={handleSubmit}
              // width="w-[307px]"
              width="w-full"
              variant="contained"
              size="large"
              borderRadius={'8px'}
            >
              Submit Details
            </CustomButton>
          </div>
        </div>
      </div>
      <Popup
        open={open.warning}
        Confirmation={handleOkay}
        handleNo={handleNo}
        handleClickOpen={handleOpen}
        popup="warning"
        subtitle="Changes are not Saved!"
        popupmsg="Do you want to proceed without changes?"
        handleOkay={handleOkay}
      />
    </>
  );
};
export default ScheduleOrders;