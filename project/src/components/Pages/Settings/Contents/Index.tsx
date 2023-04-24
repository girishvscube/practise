import React, { useState } from 'react'

interface IndexProps {
  constTabs: any
  pages: any
  cols: any
  length: any
}
const Index = ({ constTabs, pages, cols, length }: IndexProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleClick = (id: any) => {
    setActiveIndex(id)
  }

  return (
    <div className='border border-border rounded-lg bg-lightbg'>
      <div className={cols}>
        {constTabs.map((item: any, index: any) => (
          <div
            className={
              index === length
                ? 'border-none flex justify-center'
                : 'border-r border-border flex justify-center'
            }
          >
            {index === activeIndex ? (
              <p
                className='mb-1 py-2 px-4 text-yellow font-nunitoRegular font-semibold cursor-pointer'
                onClick={() => {
                  handleClick(item?.id)
                }}
              >
                {item?.name}
              </p>
            ) : (
              <p
                className='mb-1 py-2 px-4 cursor-pointer'
                onClick={() => {
                  handleClick(item?.id)
                }}
              >
                {item?.name}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className='w-full border-b border-border mb-1 font-nunitoRegular font-semibold' />
      {pages[activeIndex]}
    </div>
  )
}

export default Index
