'use client'
import { Dispatch, FormEvent, MutableRefObject, SetStateAction, useState } from 'react'
import Input from './input'
import Image from 'next/image'

export default function CreatStock({
    loading,
    isOpen,
    setIsOpen,
    formref,
    handleStockForm
}: {
    loading: boolean,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    formref: MutableRefObject<HTMLFormElement | null>,
    handleStockForm: (e: FormEvent<HTMLFormElement>) => Promise<void>
}) {

    const [fileValue, setFileValue] = useState<string | null>(null)
    return (
        <div className="w-full bg-gray-100 bg-opacity-50 top-0 items-center left-0 flex justify-center h-full absolute">
            <form ref={formref} onSubmit={(e) => handleStockForm(e)}
                className="max-w-screen-md w-full bg-white p-5 relative flex-col flex gap-2">
                <div className='flex flex-col w-full gap-2'>
                    <button className='absolute right-5 text-lg cursor-pointer top-2' onClick={() => setIsOpen(!isOpen)}>&times;</button>
                    <Input type="text" name="product_name" title="Product Name" />
                    <div className="w-full flex gap-2">
                        <Input type="number" name="originalPrice" title="Original Price" />
                        <Input type="number" name="stock" title="Product Quantity" />
                    </div>
                    <div className="w-full flex gap-2">
                        <Input type="number" name="price" title="MRP" />
                        <Input type="number" name="discount" title="Discount" />
                    </div>
                    <Input setFileValue={setFileValue} type="file" name="image" title="Product Image (optional)" color="bg-gray-100" />
                    {fileValue && <Image priority src={fileValue as string} className='rounded object-contain' alt="product image" height={150} width={200} />}
                    <button disabled={loading}
                        className={`w-full outline-none bg-emerald-700 disabled:bg-emerald-600 disabled:cursor-not-allowed py-1 rounded text-white border-none cursor-pointer`}
                    >{loading ? 'loading...' : 'Add'}</button>
                </div>
            </form>
        </div >
    )
}
