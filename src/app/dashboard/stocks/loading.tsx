import React from 'react'
import Skeleton from 'react-loading-skeleton'

export default function Loading() {
    return (
        <div className='flex flex-col w-full'>
            <Skeleton count={5} width={300} height={15} />
        </div>
    )
}
