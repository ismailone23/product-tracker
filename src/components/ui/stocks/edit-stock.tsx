import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ProductTableType } from '@/types'
import Image from 'next/image'

export default function EditStock({
    isUpdateOpen,
    setIsUpdateOpen, loading,
    id,
    products
}: {
    id: string
    products: ProductTableType[]
    isUpdateOpen: boolean,
    setIsUpdateOpen: Dispatch<SetStateAction<boolean>>,
    loading: boolean,
}) {
    const [product, setProduct] = useState<ProductTableType | null>(null)
    const [isUrl, setIsUrl] = useState<string | null>(null)
    useEffect(() => {
        setProduct(products.filter(item => item.id === id)[0])
    }, [id, products, isUrl])

    function urlCreator(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            return URL.createObjectURL(e.target.files[0]);
        }
        return null
    }
    return (
        <div className='flex flex-col w-full gap-2'>
            <button className='absolute right-5 text-lg cursor-pointer top-2' onClick={() => setIsUpdateOpen(!isUpdateOpen)}>&times;</button>
            <div className='flex flex-col w-full'>
                <label htmlFor="product_name">Product Name</label>
                <input className='outline-none border border-gray-100 rounded py-1 px-2' type="text" name="product_name" id="product_name" defaultValue={product?.product_name} />
            </div>
            <div className='grid grid-cols-2 gap-1 w-full'>
                <div className='flex flex-col'>
                    <label htmlFor="price">Price</label>
                    <input className='outline-none border border-gray-100 rounded py-1 px-2' type="number" name="price" id="price" defaultValue={product?.price} />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="stock">Stock</label>
                    <input className='outline-none border border-gray-100 rounded py-1 px-2' type="number" name="stock" id="stock" defaultValue={product?.stock} />
                </div>
            </div>
            <div className='flex flex-col w-full'>
                <label htmlFor="image">Product Image</label>
                <input
                    onChange={e => setIsUrl(urlCreator(e))}
                    className='outline-none border border-gray-100 rounded py-1 px-2' type="file" name="image" id="image" />
            </div>
            {
                product && (isUrl ?
                    <Image priority
                        src={isUrl} className='w-32 object-cover h-24 rounded' alt="product image" width="0"
                        height="0"
                        sizes="100vw" />

                    : product.image === 'no image' ?
                        <Image priority src={'/static/nophoto.jpeg'} className='w-32 object-cover h-24 rounded' alt="product image" width="0"
                            height="0"
                            sizes="100vw" />
                        :
                        <Image priority
                            src={product.image as string} className='w-32 object-cover h-24 rounded' alt="product image" width="0"
                            height="0"
                            sizes="100vw" />
                )
            }
            <button disabled={loading}
                className={`w-full outline-none bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed py-1 rounded text-white border-none cursor-pointer`}
            >{loading ? 'loading...' : 'Update'}</button>
        </div>
    )
}