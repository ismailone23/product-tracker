'use client'
import { api } from '@/trpc/shared';
import { ProductTableType } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react'
import Pagination from '../dashboard/pagination';

export default function Displays({
    loading,
    isUpdateOpen,
    setIsUpdateOpen,
    handleIncDec,
    products,
    searchText,
    setId
}: {
    loading: boolean,
    isUpdateOpen: boolean
    setIsUpdateOpen: Dispatch<SetStateAction<boolean>>,
    products: ProductTableType[],
    handleIncDec: (type: "inc" | "dec" | "del", id: string, stock: ProductTableType) => void,
    searchText: string,
    setId: Dispatch<SetStateAction<string>>
}) {
    const totalPages = api.product.fetchProductPages.useQuery(6)
    return (
        <div className="flex w-full flex-col py-2 lg:gap-2 gap-1 overflow-y-auto mb-12">
            {products && products.filter(data => data.product_name.toLowerCase().includes(searchText.toLowerCase())).map((stock, i) =>
                <div className='flex w-fulll lg:gap-2 gap-1' key={i}>
                    <div className='lg:w-32 w-28 h-20 lg:h-24 flex'>
                        {stock.image === 'no image' ?
                            <Image priority src={'/static/nophoto.jpeg'} className='w-full h-full object-cover rounded' alt="product image" width="0"
                                height="0"
                                sizes="100vw" />
                            :
                            <Image priority src={stock.image as string} className='w-full h-full object-cover rounded' alt="product image" width="0"
                                height="0"
                                sizes="100vw" />
                        }
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='lg:text-base text-xs'>{stock.product_name}</h1>
                        <p className='lg:text-sm text-xs font-light md:font-normal'>{Number(stock.extra?.discount) > 0 && 'Regular Price '} ৳ {stock.price}</p>
                        {stock.extra && (stock.extra.discount > 0 && <p className='lg:text-sm text-xs'>Discound price {`(${stock.extra.discount})% off`} ৳ {Math.floor(stock.price - stock.price * (stock.extra.discount / 100))}</p>)}
                        <div className='flex gap-1 items-center'>
                            <button type='button' className='text-lg' onClick={() => handleIncDec('dec', stock.id, stock)}>{loading ? '...' : '-'}</button>
                            <input disabled className='outline-none lg:text-sm text-xs border border-gray-200 lg:w-10 md:w-8 w-6 text-center h-5' type='number' value={stock.stock} />
                            <button type='button' className='text-lg' onClick={() => handleIncDec('inc', stock.id, stock)}>{loading ? '...' : '+'}</button>
                        </div>
                        <div className='flex lg:gap-4 gap-1'>
                            <button title='Clear this stock' className='cursor-pointer' onClick={() => handleIncDec('del', stock.id, stock)}>{loading ? '...' : <TrashIcon className='xl:w-6 lg:w-5 w-4 text-red-600' />}</button>
                            <button title='Edit' onClick={() => { setIsUpdateOpen(!isUpdateOpen); setId(stock.id) }} className='cursor-pointer'>{loading ? '...' : <PencilIcon className='xl:w-5 lg:w-4 w-3 text-blue-500' />}</button>
                        </div>
                    </div>
                </div>
            )}
            <div className='w-full flex justify-center'>
                {
                    (totalPages.isFetched &&
                        totalPages.data) && <Pagination totalPages={totalPages.data} />
                }
            </div>
        </div>
    )
}
