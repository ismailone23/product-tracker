import React from 'react'
import { api } from '@/trpc/shared'
import { customertype } from '@/types'
import { TrashIcon } from '@heroicons/react/24/solid';

export default function Mapcustomer({ customer, handledeletecustomer }: { customer: customertype, handledeletecustomer: (id: string) => void }) {
    const invoices = api.invoice.getInvoice.useQuery({ customerid: customer.id }, { refetchOnMount: false })
    let x = 0;
    if (invoices.data) {
        for (let i = 0; i < invoices.data.length; i++) {
            x += invoices.data[i].totalbill
        }
    }
    return (
        <div className='grid grid-cols-5 w-full items-center'>
            <h1>{customer.name}</h1>
            <h1>{customer.phone}</h1>
            <h1>{customer.dealerId}</h1>
            <h1>{x}</h1>
            <button onClick={() => handledeletecustomer(customer.id)} disabled={x > 0}><TrashIcon className={`w-4 ${x > 0 ? "text-red-300 cursor-not-allowed" : "text-red-500 cursor-pointer"}`} /></button>
        </div>
    )
}
