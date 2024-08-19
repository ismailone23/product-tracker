'use client'
import Revcalculate from '@/components/ui/dashboard/revcalculate'
import Sellscount from '@/components/ui/dashboard/sellscount'
import Stocklength from '@/components/ui/dashboard/stocklength'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'

export default function Page() {
    return (
        <div className='w-full grid grid-cols-2 p-2 gap-2'>
            <div className='col-span-1 w-full flex border border-gray-200 p-2 rounded-sm flex-col'>
                <div className='flex items-center gap-2 w-full justify-between'>
                    <h1> Availablity </h1>
                    <Link href={'/dashboard/stocks'} className='w-6 h-6 flex items-center rounded-sm justify-center bg-gray-100'><ChevronRightIcon className='w-4' /></Link>
                </div>
                <div>
                    <Stocklength />
                </div>
            </div>
            <div className='col-span-1 w-full flex border border-gray-200 p-2 rounded-sm flex-col'>
                <div className='flex items-center gap-2 w-full justify-between'>
                    <h1>Sells</h1>
                    <Link href={'/dashboard/invoices'} className='w-6 h-6 flex items-center rounded-sm justify-center bg-gray-100'><ChevronRightIcon className='w-4' /></Link>
                </div>
                <div>
                    <Sellscount />
                </div>
            </div>
            <div className='col-span-1 w-full flex border border-gray-200 p-2 rounded-sm flex-col'>
                <div className='flex items-center gap-2 w-full justify-between'>
                    <h1>Total Revenue</h1>
                    <Link href={'/dashboard/revenue'} className='w-6 h-6 flex items-center rounded-sm justify-center bg-gray-100'><ChevronRightIcon className='w-4' /></Link>
                </div>
                <div>
                    <Revcalculate />
                </div>
            </div>
            <div className='col-span-1 w-full flex border border-gray-200 p-2 rounded-sm flex-col'>
                <div className='flex items-center gap-2 w-full justify-between'>
                    <h1>Customers</h1>
                    <Link href={'/dashboard/customers'} className='w-6 h-6 flex items-center rounded-sm justify-center bg-gray-100'><ChevronRightIcon className='w-4' /></Link>
                </div>
            </div>
        </div>
    )
}
