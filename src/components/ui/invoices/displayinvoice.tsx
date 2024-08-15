import { api } from '@/trpc/shared'
import { invoiceIdtype, InvoiceTableType } from '@/types'
import React from 'react'
import Skeleton from 'react-loading-skeleton'

export default function Displayinvoice({ invoices }: { invoices: InvoiceTableType[] }) {
    const productapi = api.product.getProduct.useQuery({})
    return (
        <div className='flex w-full flex-col px-4 gap-1'>
            {productapi.isFetching ?
                <div className='flex flex-col gap-1 w-full'>
                    <Skeleton width={300} height={10} count={5} />
                </div>
                :
                <div className='flex flex-col gap-1 w-full'>
                    <div className='w-full bg-gray-50 p-1 grid grid-cols-8' >
                        <p>sl no.</p>
                        <p className='col-span-5'>products</p>
                        <p>product prices</p>
                        <p>final price</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {invoices.map((invoice, i) =>
                            <div className='w-full bg-gray-50 p-1 items-center grid grid-cols-8' key={invoice.id}>
                                <p>{i + 1}</p>
                                <ol className='col-span-5'>
                                    {(
                                        JSON.parse(invoice.purchased_list) as invoiceIdtype[]).map((list, i) =>
                                            <li className=' text-xs'
                                                key={i}>{productapi.data?.filter(data => data.id == list.id)[0].product_name} &times; {list.count}
                                            </li>
                                        )}
                                </ol>
                                <p className='text-xs'>{invoice.originalbill}</p>
                                <p className='text-xs'>{invoice.totalbill}</p>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}
