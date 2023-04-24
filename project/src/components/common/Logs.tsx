import moment from 'moment';
import { useState } from 'react';
import { defaultFiltersDropDown } from '../../utils/helpers';
import { DateFiter } from './DateFiter';
import { SelectInput } from './input/Select';
interface Props {
    logs: any;
    height?: any;
    enable_date?: boolean,
    onDateSelect?: any,
    dateFilterValue?: string,
    image?: any
}

const statusList = [
    {
        list: ['un_assigned', 'unassigned', 'processing'],
        class: 'bg-metallicSilver'
    },
    {
        list: ['call_back', 'call back', 'inactive', 'confirmed', 'dispatching'],
        class: 'bg-yellowOrange'
    },
    {
        list: ['linked', 'interested'],
        class: 'bg-vividYellow'
    },
    {
        list: ['dispatched', 'assigned', 'order placed', 'order_placed'],
        class: 'bg-azure'
    },
    {
        list: ['delivered', 'converted', 'Active'],
        class: 'bg-limeGreen'
    }
]

const getBgClass = (status: string) => {
    let className = 'bg-carminePink';
    for (let item of statusList) {
        if (item.list.some(x => status.toLowerCase().includes(x.toLowerCase()))) {
            className = item.class;
            break;
        }
    }

    return className;
}

const Logs: React.FC<Props> = ({ logs, height, enable_date, onDateSelect, image }: Props) => {

    return (
        <div className="mobileView bg-lightbg rounded-xl py-6">
            <div className='flex justify-between items-center'>
                <p className="text-white  text-base font-medium hidden lg:block w-full">
                    Logs Info
                </p>
                {
                    enable_date ?

                        <DateFiter onDateRangeSelect={onDateSelect} />
                        :
                        <>
                        </>

                }

            </div>
            <p className="text-white text-base font-medium lg:hidden w-full">Logs info</p>
            <hr className="line border-1 mt-1" />
            <div
                className="childstyles bg-darkbg rounded-md mt-2 py-6 px-4 "
            >
                {logs && Array.isArray(logs) && logs.map((e: any) =>
                    <div className=" relative mb-3" >
                        {
                            e.type !== 'STATUS' ?
                                <div className=" flex w-full  gap-2 items-center ">
                                    {
                                        image
                                            ? (
                                                <img
                                                    className=" w-8 h-8  rounded-full"
                                                    src={image}
                                                    alt="blank"
                                                />
                                            )

                                            : (
                                                <div
                                                    className="m-1 mr-1 w-10 h-9 relative flex justify-center
                                                    items-center rounded-full bg-lightbg text-sm text-white uppercase
                                                    cursor-pointer"
                                                >
                                                    {e?.user?.name.charAt(0)}
                                                </div>
                                            )
                                    }

                                    <div className="w-full flex justify-between">
                                        {' '}
                                        <p className=" text-base text-white ">
                                            {e.user.name}
                                            {' '}
                                            {
                                                e.type === 'NOTE' ?
                                                    <span className=" text-sm text-textgray">
                                                        added notes :
                                                    </span> : ''
                                            }
                                            {' '}
                                            <span className=" text-sm text-textgray">
                                                {e.message}
                                            </span>
                                        </p>

                                        <p className=" text-textgray text-sm">{moment(e.created_at).format('h:mm A; DD/M/yy')}</p>

                                    </div>
                                </div> :
                                <div className='flex sm:flex-row flex-col w-full justify-between mt-3'>
                                    <div
                                        className={` bg-opacity-10 w-fit flex gap-3 items-center px-4 py-2 rounded-lg border-2  border-opacity-20 ${getBgClass(e.message)} ${getBgClass(e.message).replace('bg', 'border')}`}>
                                        <div
                                            className={` w-2.5 h-2.5  rounded-md border border-black  ${getBgClass(e.message)} ${getBgClass(e.message).replace('bg', 'border')}`}
                                        />
                                        <div className='text-sm' dangerouslySetInnerHTML={{ __html: e.message.replace('<span>', `<span class=${getBgClass(e.message).replace('bg', 'text')}> `) }} />
                                    </div>

                                    <p className=" text-textgray text-sm">{moment(e.created_at).format('h:mm A; d/M/yy')}</p>
                                </div>
                        }


                    </div>
                )}

                {
                    logs && !logs.length
                        ? (
                            <>
                                <p className="my-8 text-center">No Logs Found</p>
                            </>
                        )
                        : ''
                }

            </div>
        </div>

    );
};

export default Logs;