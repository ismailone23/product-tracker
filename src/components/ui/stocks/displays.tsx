'use client'
import { ProductTableType } from '@/types';
import Image from 'next/image';
import React from 'react'

export default function Displays({ products }: { products: ProductTableType[] | undefined }) {
    console.log(products);

    return (
        <div className="flex flex-col overflow-auto">
            {products && products.map((stock, i) =>
                <div key={i}>
                    <p>{stock.product_name}</p>
                    <p>in stock {stock.stock}</p>
                    <p>price {stock.price}</p>
                    {stock.image === 'no image' ?
                        <Image src={'/static/nophoto.jpeg'} alt="product image" width={400} height={350} />
                        :
                        // <Image src={'/static/nophoto.jpeg'} alt="product image" width={400} height={350} />
                        <Image src={stock.image as string} alt="product image" height={350} width={400} />
                    }
                </div>
            )
            }
        </div>
    )
}
