'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

export default function Invoicefilter({ setSearchDate }: {
    setSearchDate: Dispatch<SetStateAction<{
        from: Date;
        to: Date;
    }>>
}) {
    const [queryDate, setQueryDate] = useState<{ from: Date, to: Date }>({ from: new Date(Date.now()), to: new Date(Date.now()) })

    useEffect(() => {
        const timeOutId = setTimeout(() => setSearchDate({ from: queryDate.from, to: queryDate.to }), 1500);
        return () => clearTimeout(timeOutId);
    }, [queryDate]);
    return (
        <div className='flex w-full px-4 items-center gap-2'>
            <h1>Search Invoice: </h1>
            <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1'>
                    <label htmlFor="from">From</label>
                    <input onChange={e => setQueryDate((prev) => ({ ...prev, from: new Date(e.target.value) }))}
                        className='border px-2 cursor-pointer outline-none border-gray-200 rounded-sm' type="date" id='from' name='from' />
                </div>
                <div className='flex items-center gap-1'>
                    <label htmlFor="to">To</label>
                    <input onChange={e => setQueryDate((prev) => ({ ...prev, to: new Date(e.target.value) }))}
                        className='border px-2 cursor-pointer outline-none border-gray-200 rounded-sm' type="date" id='to' name='to' />
                </div>
            </div>
        </div>
    )
}
