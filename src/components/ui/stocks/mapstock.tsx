'use client'
import { ProductTableType } from '@/types';
import { TrashIcon, PencilSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import React, { Dispatch, SetStateAction, useState } from 'react'
import Imaged from './Imaged';
import StockModal from './stockmodal';

export default function Mapstock({
    stock,
    loading,
    isUpdateOpen,
    setIsUpdateOpen,
    handleDel,
    setId
}: {
    stock: ProductTableType;
    loading: boolean,
    isUpdateOpen: boolean
    setIsUpdateOpen: Dispatch<SetStateAction<boolean>>,
    handleDel: (id: string) => void,
    setId: Dispatch<SetStateAction<string>>
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
            <div className='flex w-fulll h-20 md:h-24 lg:gap-2 gap-1' >
                <div className='lg:w-32 w-28 h-full flex'>
                    {stock.image === 'no image' ?
                        <Imaged src={'/static/nophoto.jpeg'} />
                        :
                        <Imaged src={stock.image} />
                    }
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex w-full gap-2'>
                        <h1 className=' text-sm'>{stock.product_name} </h1>
                        <button onClick={() => setIsModalOpen(true)} ><InformationCircleIcon className='w-4' /></button>
                    </div>
                    <p className='text-xs font-light'>{Number(stock.pricetable?.discount) > 0 && 'Regular Price '} ৳ {stock.price}</p>
                    {
                        stock.pricetable && (stock.pricetable.discount > 0 && <p className='text-xs font-light'>Discound price {
                            `(${stock.pricetable.discount})% off`} ৳ {Math.floor(stock.price - stock.price * (stock.pricetable.discount / 100))}
                        </p>)
                    }
                    <div className='flex gap-1 items-center'>
                        <input disabled className='outline-none text-xs border border-gray-200 lg:w-12 md:w-8 w-6 text-center h-5' type='number' value={stock.stock} />
                        <button title='Clear this stock' className='cursor-pointer' onClick={() => handleDel(stock.id)}>
                            {loading ? '...' : <TrashIcon className='lg:w-5 w-4 text-red-600' />}</button>
                        <button title='Edit' onClick={() => { setIsUpdateOpen(!isUpdateOpen); setId(stock.id) }} className='cursor-pointer'>
                            {loading ? '...' : <PencilSquareIcon className='lg:w-5 w-3 text-blue-500' />}</button>
                    </div>
                </div>
            </div>
            {
                isModalOpen && <StockModal stock={stock} setIsModalOpen={setIsModalOpen} />
            }
        </>
    )
}
