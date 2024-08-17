'use client'
import { api } from '@/trpc/shared'
import { InvoiceTableType } from '@/types'
import { TrashIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react'
import Calculate from './calculate';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Infomodal from './infomodal';

export default function Sinvoice({ invoice, i, handleAction }: { invoice: InvoiceTableType; i: number; handleAction: (id: string, list: string) => void }) {
    const productapi = api.product.getProduct.useQuery({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleInfoModal = (id: string) => {
        setIsModalOpen(true)
        console.log(id);

    }
    return (
        <>
            <div className='w-full items-center grid border-b px-1 py-1 grid-cols-10' key={invoice.id}>
                <p>{i + 1}</p>
                <h1 className='col-span-4 text-sm'>{invoice.id}</h1>
                <p className='text-sm'>{invoice.originalbill}</p>
                <p className='text-sm'>{invoice.totalbill}</p>
                <div className='col-span-2'>
                    {
                        productapi.data &&
                        <Calculate invoice={invoice} products={productapi.data} />
                    }
                </div>
                <div className='flex items-center gap-2'>
                    <button onClick={() => handleInfoModal(invoice.id)} title='more info'><InformationCircleIcon className='w-5 text-gray-500' /></button>
                    <button onClick={() => handleAction(invoice.id, invoice.purchased_list)}><TrashIcon className='w-4 text-red-500' /></button>
                </div>
            </div>
            {
                isModalOpen && <Infomodal invoice={invoice} setIsModalOpen={setIsModalOpen} />
            }
        </>

    )
}

{/* 
{(
                    JSON.parse(invoice.purchased_list) as invoiceIdtype[]).map((list, i) =>
{productapi.data?.filter(data => data.id == list.id)[0].product_name} &times;
                            <span>{list.count}</span>
                            <span>({productapi.data?.filter(data => data.id == list.id)[0].pricetable?.originalPrice})</span>
)}
*/}