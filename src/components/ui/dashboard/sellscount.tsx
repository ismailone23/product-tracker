import { api } from '@/trpc/shared'
import { invoiceIdtype } from '@/types';
import React from 'react'

export default function Sellscount() {
    const invoiceapi = api.invoice.getInvoice.useQuery({}, { refetchOnMount: false })
    let count = 0;
    if ((invoiceapi.isFetched && invoiceapi.data) && invoiceapi.data.length > 0) {
        for (let i = 0; i < invoiceapi.data.length; i++) {
            (JSON.parse(invoiceapi.data[i].purchased_list) as invoiceIdtype[]).map(pid => count += pid.count)
        }
    }
    return (
        <div>
            {(invoiceapi.isFetched && invoiceapi.data) && <div>
                <p>Total Invoices : {invoiceapi.data.length}</p>
                <p>Total sold Products in invoices : {count}</p>
            </div>}
        </div>
    )
}
