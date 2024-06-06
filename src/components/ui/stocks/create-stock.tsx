'use client'
import React, { FormEvent, useRef, useState } from 'react'
import Input from './input'
import { api } from '@/trpc/shared';

export default function CreatStock() {
    const formref = useRef<HTMLFormElement | null>(null)
    const createStockapi = api.product.createStock.useMutation({
        onSuccess: () => {

        }
    })
    const handleStockForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(formref.current as HTMLFormElement)
        const { price, stock, product_name, image } = Object.fromEntries(formData)
        const imagefile = formData.get("image") as File
        if (imagefile.size > 0) {

        } else {
            createStockapi.mutate({
                image: 'no image',
                price: Number(price),
                product_name: product_name as string,
                stock: Number(stock)
            })
        }
        formref.current?.reset()
    }
    return (
        <form ref={formref} onSubmit={handleStockForm} className="w-full flex-col flex gap-2">
            <Input type="text" name="product_name" title="Product Name" />
            <div className="w-full flex gap-2">
                <Input type="number" name="price" title="Product Price" />
                <Input type="number" name="stock" title="Product Quantity" />
            </div>
            <Input type="file" name="image" title="Product Image (optional)" color="bg-gray-100" />
            <button className="w-full outline-none bg-emerald-700 py-1 rounded text-white border-none cursor-pointer">Add</button>
        </form>
    )
}
