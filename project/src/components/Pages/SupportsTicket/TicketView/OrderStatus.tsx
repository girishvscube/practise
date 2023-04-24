import CustomButton from '../../../common/Button';
import { TimeandDatePicker } from '../../../common/DateTimePicker';
import { SelectInput } from '../../../common/input/Select';
import TextArea from '../../../common/input/TextArea';
import Status from '../../../common/Status';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

const OrderStatus = ({ ticketId, ticketStatusList, params, showStatus, handleChange, handleStatus }) => {

  return (
    <div>
      <div className="bg-lightbg mobileView">
        <p className="subheading">Ticket Status</p>
        <div className="bg-darkbg  flex flex-col gap-y-6 rounded-lg p-4 font-nunitoRegular">
          <div className="flex justify-between pb-3 border-b border-border">
            <p className="text-textgray text-xs">Current Ticket status:</p>
            <Status>
              {showStatus}

            </Status>
          </div>

          <div>
            <SelectInput
              options={ticketStatusList}
              handleChange={handleChange}
              value={params?.status}
              label="Select Status"
              name="status"
            />
          </div>
          <div>
            {/* <TimeandDatePicker handleChange={handleDate} value={value} error={formErrors.callback_time} />
            {formErrors.callback_time ? <p className="text-red-600">*required</p> : null}

          </div> */}

            <TextArea
              rows={5}
              handleChange={handleChange}
              name="notes"
              value={params?.notes}
              placeholder="Additional Info"
            />

            <div className="w-full flex justify-end">

              <CustomButton
                onClick={handleStatus}
                borderRadius="1rem"
                width="m-auto w-fit "
                variant="outlined"
                size="medium"
                icon={(
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.92632 5.98919H4.30432C2.94766 5.98919 1.84766 7.08919 1.84766 8.44586V11.6959C1.84766 13.0519 2.94766 14.1519 4.30432 14.1519H11.7243C13.081 14.1519 14.181 13.0519 14.181 11.6959V8.43919C14.181 7.08652 13.0843 5.98919 11.7317 5.98919H11.103" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.01449 1.45997V9.4873" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.07031 3.4126L8.01365 1.4606L9.95765 3.4126" stroke="#FFCD2C" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                )}
              >
                Update Status
              </CustomButton>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
