'use client'
import { api } from '@/trpc/shared';
import { ProductTableType } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react'

export default function Displays({
    setMessage,
    isUpdateOpen,
    setIsUpdateOpen,
    handleIncDec,
    products,
    searchText,
    setId
}: {
    setMessage: Dispatch<SetStateAction<{
        error: boolean;
        message: string;
    } | null>>,
    isUpdateOpen: boolean
    setIsUpdateOpen: Dispatch<SetStateAction<boolean>>,
    products: ProductTableType[],
    handleIncDec: (type: "inc" | "dec" | "del", id: string, stock: ProductTableType) => void,
    searchText: string,
    setId: Dispatch<SetStateAction<string>>
}) {
    return (
        <div className="flex w-full flex-col py-2 gap-2 overflow-y-auto mb-10">
            {products && products.filter(data => data.product_name.toLowerCase().includes(searchText.toLowerCase())).map((stock, i) =>
                <div className='flex w-fulll gap-2' key={i}>
                    <div className=''>
                        {stock.image === 'no image' ?
                            <Image priority src={'/static/nophoto.jpeg'} className='w-32 object-cover h-24 rounded' alt="product image" width="0"
                                height="0"
                                sizes="100vw" />
                            :
                            <Image priority src={stock.image as string} className='w-32 object-cover h-24 rounded' alt="product image" width="0"
                                height="0"
                                sizes="100vw" />
                        }
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-lg'>{stock.product_name}</p>
                        <p className='text-sm'>৳ {stock.price}</p>
                        <div className='flex gap-1 items-center'>
                            <button type='button' className='text-lg' onClick={() => handleIncDec('dec', stock.id, stock)}>-</button>
                            <input disabled className='outline-none text-sm border border-gray-200 w-10 text-center h-5' type='number' value={stock.stock} />
                            <button type='button' className='text-lg' onClick={() => handleIncDec('inc', stock.id, stock)}>+</button>
                        </div>
                        <div className='flex mt-2 gap-4'>
                            <button title='Clear this stock' className='cursor-pointer' onClick={() => handleIncDec('del', stock.id, stock)}><TrashIcon className='w-6 text-red-600' /></button>
                            <button title='Edit' onClick={() => { setIsUpdateOpen(!isUpdateOpen); setId(stock.id) }} className='cursor-pointer'><PencilIcon className='w-5 text-blue-500' /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
