import { customertype } from '@/types'
import React from 'react'
import Mapcustomer from './mapcustomer'

export default function Displaycustomer({
    customers,
    searchText,
    handledeletecustomer
}: {
    searchText: string;
    customers: customertype[],
    handledeletecustomer: (id: string) => void
}) {

    return (
        <div className='flex w-full flex-col gap-2 px-4'>
            <div className='grid grid-cols-4 w-full border-b border-gray-200 py-1'>
                <h1>Name</h1>
                <h1>Phone</h1>
                <h1>Total purchased</h1>
                <h1>Action</h1>
            </div>
            {
                customers.filter(cs => cs.phone.toLowerCase().includes(searchText.toLowerCase()))
                    .map((customer, i) => <Mapcustomer handledeletecustomer={handledeletecustomer} customer={customer} key={i} />)
            }
        </div>
    )
}
