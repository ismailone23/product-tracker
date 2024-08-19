import { ProductTableType, stockTrack, trackType } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/solid'
import React, { Dispatch, SetStateAction } from 'react'

export default function StockModal({ setIsModalOpen, stock }: { stock: ProductTableType; setIsModalOpen: Dispatch<SetStateAction<boolean>> }) {
    const jsondetails = JSON.parse(stock.stockdetails.details) as trackType[];

    return (
        <div className='absolute left-0 top-0 w-full h-full bg-black bg-opacity-20 flex p-5 justify-center'>
            <div className="relative gap-2 items-center flex flex-col max-w-screen-md w-full h-auto rounded-sm bg-white p-2">
                <button className='absolute right-2 top-2' onClick={() => setIsModalOpen(false)}><XMarkIcon className='w-5' /></button>
                <h1 className='text-lg'>Stock Details</h1>
                <div className='flex flex-col w-full '>
                    <h1>Product Name : {stock.product_name}</h1>
                    <ol className='list-decimal pl-5'>
                        {
                            jsondetails.map((data, i) => <li key={i}>
                                <h1>Stock Added : {data.quantity}</h1>
                                <h1>On : {new Date(data.createdat).getDate()}/{new Date(data.createdat).getMonth() + 1}/{new Date(data.createdat).getFullYear()}</h1>
                            </li>)
                        }
                    </ol>
                </div>
            </div>
        </div>
    )
}
