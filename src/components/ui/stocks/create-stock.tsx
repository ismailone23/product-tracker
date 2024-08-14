'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import Input from './input'
import Image from 'next/image'

export default function CreatStock({
    loading,
    isOpen,
    setIsOpen,
}: {
    loading: boolean,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}) {

    const [fileValue, setFileValue] = useState<string | null>(null)
    return (
        <div className='flex flex-col w-full gap-2'>
            <button className='absolute right-5 text-lg cursor-pointer top-2' onClick={() => setIsOpen(!isOpen)}>&times;</button>
            <Input type="text" name="product_name" title="Product Name" />
            <div className="w-full flex gap-2">
                <Input type="number" name="originalPrice" title="Original Price" />
                <Input type="number" name="discount" title="Discount" />
            </div>
            <div className="w-full flex gap-2">
                <Input type="number" name="price" title="Product Price" />
                <Input type="number" name="stock" title="Product Quantity" />
            </div>
            <Input setFileValue={setFileValue} type="file" name="image" title="Product Image (optional)" color="bg-gray-100" />
            {fileValue && <Image priority src={fileValue as string} className='rounded border border-black object-contain' alt="product image" height={150} width={200} />}
            <button disabled={loading}
                className={`w-full outline-none bg-emerald-700 disabled:bg-emerald-600 disabled:cursor-not-allowed py-1 rounded text-white border-none cursor-pointer`}
            >{loading ? 'loading...' : 'Add'}</button>
        </div>
    )
}
