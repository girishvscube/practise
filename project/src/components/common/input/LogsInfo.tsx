// import { useState } from 'react';

interface Props {
  data?: any
  height?: any
}

const LogsInfo: React.FC<Props> = ({ height }) => (
  // const [data, setData] = useState(data1);

  <div className=''>
    {' '}
    <div style={{ height }} className=' bg-darkbg rounded-md py-6 px-3 '>
      {[
        {
          name: 'Saravanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          msg: 'Sent the invoice to customer',
          date: 'Just Now',
          status: false,
        },
        {
          name: 'Sarvanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          msg: 'Edited the POC details',
          date: '1 Hours',
          status: false,
        },
        {
          name: 'Sarvanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          status: true,
          status_val: 'Delivered',
          date: '2 Hours',
        },
        {
          name: 'Sarvanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          status: true,
          status_val: 'Dispatched',
          date: '11:59 PM, 13/05/2022',
        },
        {
          name: 'Sarvanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          status: true,
          status_val: 'PO Linked',
          date: '10:42 PM, 13/05/2022',
        },
        {
          name: 'Sarvanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          status: true,
          status_val: 'Order Confirmed',
          date: '09:36 PM, 13/05/2022',
        },
        {
          name: 'Sarvanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          status: true,
          status_val: 'Order Processing',
          date: '06:06 PM, 13/05/2022',
        },
        {
          name: 'Saravanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          msg: 'Sent the invoice to customer',
          status: false,
          date: '05:01 PM, 13/05/2022',
        },
        {
          name: 'Sarvanan SampathKumar',
          img: 'https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png',
          msg: 'Edited the POC details',
          status: false,
          date: '02:46 PM, 13/05/2022',
        },
      ].map((e: any) => (
        <div className=' relative mb-6'>
          <div className=' flex w-full  gap-3 items-center '>
            <img
              className='w-9 h-9 object-contain rounded-[50%] bg-white '
              src='https://www.esports.net/wp-content/uploads/2022/08/Valorant-Brimstone-Guide.png'
              alt=''
            />
            {/* <img className=' w-9 h-9 object-contain rounded-[50%]' src={e.img} alt='blank' /> */}
            <div className='w-full flex justify-between'>
              {' '}
              <p className=' text-base text-white '>
                {e.name}{' '}
                <span className=' text-sm text-textgray'>
                  {!e?.status ? e.msg : 'Changed the Status'}
                </span>
              </p>
              <p className='hidden sm:block text-textgray text-sm'>{e?.date}</p>
            </div>
          </div>
          {e?.status && (
            <div className='flex sm:flex-row flex-col w-full justify-between pl-11 mt-3'>
              <div
                className={` bg-opacity-10 w-fit flex gap-3 items-center px-6 py-3 rounded-lg border-2  border-opacity-20 ${
                  e?.status_val === 'Delivered'
                    ? 'bg-limeGreen border-limeGreen'
                    : e?.status_val === 'Dispatched'
                    ? 'bg-azure border-azure'
                    : e?.status_val === 'PO Linked'
                    ? 'bg-vividYellow border-vividYellow'
                    : e?.status_val === 'Order Confirmed'
                    ? 'bg-yellowOrange border-yellowOrange'
                    : e?.status_val === 'Order Processing'
                    ? 'bg-metallicSilver border-metallicSilver'
                    : 'bg-carminePink border-carminePink'
                }`}
              >
                <div
                  className={` w-[18px] h-[18px] border-[4px] border-darkbg  rounded-[9px]   ${
                    e?.status_val === 'Delivered'
                      ? 'bg-limeGreen border-limeGreen'
                      : e?.status_val === 'Dispatched'
                      ? 'bg-azure border-azure'
                      : e?.status_val === 'PO Linked'
                      ? 'bg-vividYellow border-vividYellow'
                      : e?.status_val === 'Order Confirmed'
                      ? 'bg-yellowOrange border-yellowOrange'
                      : 'bg-carminePink border-carminePink'
                  }`}
                />
                <p className=' text-white'>
                  Status has been changed to{' '}
                  <span
                    className={`${
                      e?.status_val === 'Delivered'
                        ? 'text-limeGreen border-limeGreen'
                        : e?.status_val === 'Dispatched'
                        ? 'text-azure border-azure'
                        : e?.status_val === 'PO Linked'
                        ? 'text-vividYellow border-vividYellow'
                        : e?.status_val === 'Order Confirmed'
                        ? 'text-yellowOrange border-yellowOrange'
                        : 'text-carminePink border-carminePink'
                    }`}
                  >
                    {e?.status_val}
                  </span>
                </p>
              </div>
              <br className='sm:hidden block' />
              <p className='sm:hidden block text-textgray text-sm'>{e?.date}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)

export default LogsInfo
