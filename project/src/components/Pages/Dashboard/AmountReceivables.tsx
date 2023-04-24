import React from 'react'
import Timer from '../../../assets/images/Timer.svg'
import OverDue from '../../../assets/images/OverDue.svg'
const AmountReceivables = ({ data }) => {
    return (
        <div className='mobileView bg-lightbg' >
            <p className="subheading">Amount Receivables</p>

            <div className=" flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className='bg-darkGray mobileView border border-none flex flex-col gap-4'>
                        <div className='flex gap-6'>
                            <p className='text-textgray font-nunitoRegular text-xs'>Total Unpaid Invoice:</p>
                            <p className='text-[18px] font-nunitoRegular' >₹ {data?.unpaidAmount}</p>
                        </div>
                        <div className='w-full border-b border-border'></div>
                        <div className='flex flex-row gap-10'>
                            <div className='flex gap-6'>

                                <img src={Timer} alt="timer" />
                                <div>
                                    <p className='text-textgray font-nunitoRegular text-xs'>Current due</p>
                                    <p className='text-[18px] font-nunitoRegular'>₹ {data?.current_due
                                    }</p>
                                </div>
                            </div>


                            <div className='flex gap-6'>
                                <img src={OverDue} alt="timer" />
                                <div>
                                    <p className='text-textgray font-nunitoRegular text-xs'>Over due</p>
                                    <p className='text-[18px] font-nunitoRegular'>₹ {data?.over_due
                                    }</p>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className='bg-darkGray mobileView border border-none flex flex-col gap-4 pt-2'>
                        <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
                            <p className='text-xs text-textgray'>1-15 days</p>
                            <p className='text-sm'>₹ {data?.one_to_15 || 0}</p>
                        </div>

                        <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
                            <p className='text-xs text-textgray'>16-30 days</p>
                            <p className='text-sm'>₹ {data?.sixteen_to_30
                                || 0}</p>
                        </div>

                        <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
                            <p className='text-xs text-textgray'>31-45 days</p>
                            <p className='text-sm'>₹ {data?.thirty_1_to_45

                                || 0}</p>
                        </div>

                        <div className='flex justify-between lg:grid lg: grid-cols-2 px-3 lg:px-0'>
                            <p className='text-xs text-textgray'>Above 45 days</p>
                            <p className='text-sm'>₹ {data?.above_45

                                || 0}</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AmountReceivables


// html to create two circles ??



