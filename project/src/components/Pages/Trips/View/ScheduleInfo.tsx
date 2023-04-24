import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import ScheduleInfoTable from './ScheduleInfoTable';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NoScheduleInfo from './NoScheduleInfo';
import CustomButton from '../../../common/Button';
import ClockBlack from '../../../../assets/images/ClockBlack.svg';

const useStyles = makeStyles(() => ({
  root: {
    // backgroundColor: '#151929 !important',
    paddingY: '30px',
    '&:before': {
      backgroundColor: 'transparent',
    },
  },
  details: {
    margin: ' 24px',
    backgroundColor: '#151929',
    borderRadius: '1rem',
  },

  summary: {
    backgroundColor: '#151929 !important',
    borderRadius: '8px !important',
    margin: '0px',
    padding: '0px',
    // maxHeight: '25px',
  },
}));
interface DriversDetailsProps {
  response:any
}
const ScheduleInfo = ({ response }: DriversDetailsProps) => {
 
  const navigate = useNavigate();

  const classes = useStyles();

  const handleAction = (id:any) => {
    navigate(`/fleet_manage/trips/schedule/edit/${id}`);
  };


  return (
  <>
    {
      response?.schedule_trip?.start_time ?
      <div className="w-full rounded flex flex-col gap-6">
      <div className="bg-lightbg mobileView custom-sec-box">
        <div className=" flex flex-col justify-center ">
            <div className="bg-darkbg p-6 rounded-lg flex lg:flex-row lg:justify-between flex-col gap-7">
                <div className="flex gap-2 lg:justify-center lg:items-center">
                    <p className="text-textgray font-nunitoRegular">
                        Fuel Purchased:
                        <span className="text-white ml-2">
                            {response?.count?.ordered}L
                        </span>
                    </p>
                </div>
                
                    <div className="hidden lg:block h-10 border-r border-border" />
                    <div className="flex gap-2 lg:justify-center lg:items-center">
                        <p className="text-textgray font-nunitoRegular">
                            Fuel Delivered:
                            <span className="text-white ml-2">
                              {response?.count?.delivered ? response?.count?.delivered +'L' : 'NA'  }
                            </span>
                        </p>
                    </div>
                    <div className="hidden lg:block h-10 border-r border-border" />
                    <div className="flex gap-2 lg:justify-center lg:items-center">
                        <p className="text-textgray font-nunitoRegular">
                            Fuel Remaining:
                            <span className="text-white ml-2">
                              {response?.count?.left}L
                            </span>
                        </p>
                    </div>
                    {
                      !response?.schedule_trip?.po?.actual_start_time ?
                <div className="w-40 mt-2 lg:mt-0 mx-auto lg:mx-0">
                  <CustomButton
                    // onClick={handleAdd}
                    width="w-full"
                    variant="contained"
                    size="medium"
                    borderRadius="8px"
                    icon={<img src={ClockBlack} alt="" />}
                    onClick={() => {
                      handleAction(response?.trip?.id);
                    }}
                  >
                    Reschedule Trip
                  </CustomButton>
                </div> : <></>
            }
                   
                </div>
              <div />
            </div>
          </div>
          <div>
        {
          response?.schedule_trip  ?
            <ScheduleInfoTable scheduleData={response?.schedule_trip} 
            po={response?.schedule_trip?.po} tripId={response?.trip?.id} />
            : <></>
        }
          </div>
      </div> :<NoScheduleInfo id={response?.trip?.id} />
    }
   
   </>
  );
};
export default ScheduleInfo;
