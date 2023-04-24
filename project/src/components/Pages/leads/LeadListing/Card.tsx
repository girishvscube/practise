import React from 'react'

interface CardProps {
    image: any
    text: any
    value: any
}

const Card = ({ image, text, value }: CardProps) => (
    <div>
        <div className=' bg-lightbg  p-4 flex gap-6 rounded-md items-center  border border-border'>
            <div>
                <img src={image} alt='logo1' />
            </div>
            <div className='flex flex-col space-y-1'>
                <p className='text-lg	 font-nunitoBold'>
                    {text.includes('Fuels') ? `${value} L` : value}
                </p>
                <p className='text-textgray text-sm'>{text}</p>
            </div>
        </div>
    </div>
)

export default Card
