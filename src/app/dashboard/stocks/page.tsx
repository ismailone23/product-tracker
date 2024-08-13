'use client'

import Sharedtop from "@/components/ui/dashboard/sharedtop";
import CreatStock from "@/components/ui/stocks/create-stock"
import Displays from "@/components/ui/stocks/displays";
import EditStock from "@/components/ui/stocks/edit-stock";
import { handleFormForStock, handleUpdateStockForm } from "@/lib/client/productsubmit";
import { api } from "@/trpc/shared"
import { ProductTableType } from "@/types";
import { FormEvent, useRef, useState } from "react";

export default function Page() {
    const formref = useRef<HTMLFormElement | null>(null)
    const upformref = useRef<HTMLFormElement | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const allProductsApi = api.product.getProduct.useQuery({ title: null, id: null });
    const allProducts = allProductsApi.data as ProductTableType[]
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<{ error: boolean, message: string } | null>(null)
    const [id, setId] = useState<string>('')

    const createStockapi = api.product.createStock.useMutation({
        onSuccess: () => {
            allProductsApi.refetch();
            setMessage({ error: false, message: "uploaded stock successfully" })
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
        }
    })
    const updateProductApi = api.product.updateProduct.useMutation({
        onSuccess: () => {
            allProductsApi.refetch()
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
        }
    })
    const deleteProductApi = api.product.deleteProduct.useMutation({
        onSuccess: () => {
            allProductsApi.refetch()
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
        }
    })
    const handleStockForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        let data = await handleFormForStock(formref, setMessage).then(data => data) as ProductTableType
        createStockapi.mutate({ image: data.image as string, price: data.price, product_name: data.product_name, stock: data.stock })
        setLoading(false)
        setIsOpen(false)
        formref.current?.reset()
    }
    const handleupdateProductForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        let data = await handleUpdateStockForm(upformref, setMessage, allProducts, id).then(data => data) as ProductTableType
        updateProductApi.mutate({ ...data })
        e.preventDefault();
        setIsUpdateOpen(false)
        setLoading(false)
    }
    const handleIncDec = (type: "inc" | "dec" | "del", id: string, stock: ProductTableType) => {
        if (type === 'inc') {
            updateProductApi.mutate({ ...stock, updatedAt: new Date(Date.now()), stock: stock.stock + 1 })
        }
        else if (type === 'dec') {
            if (stock.stock === 0) return setMessage({ error: true, message: "stock cannot be negative" })
            updateProductApi.mutate({ ...stock, updatedAt: new Date(Date.now()), stock: stock.stock - 1 })
        }
        else {
            if (confirm("do you want to delete it for sure ? ")) { deleteProductApi.mutate({ id }) }
        }
    }
    return (
        <div className="w-full h-full overflow-y-auto flex p-2 items-center flex-col">
            <div className="w-full flex flex-col items-center h-full overflow-auto gap-2 px-5">
                <Sharedtop isOpen={isOpen} setIsOpen={setIsOpen} text="Stocks" />
                <div className="w-full">
                    <input placeholder="search product" className="outline-none border font-normal border-gray-200 rounded px-2 py-1 w-full" type="text" value={searchText} onChange={e => setSearchText(e.currentTarget.value)} />
                </div>
                {
                    Number(allProducts?.length) > 0 ?
                        <Displays setId={setId} searchText={searchText} products={allProducts}
                            handleIncDec={handleIncDec} isUpdateOpen={isUpdateOpen}
                            setIsUpdateOpen={setIsUpdateOpen} setMessage={setMessage} />
                        :
                        <p className="italic">No Data</p>
                }
                {
                    isOpen && <div className="w-full bg-gray-100 bg-opacity-50 top-0 items-center left-0 flex justify-center h-full absolute">
                        <form ref={formref} onSubmit={(e) => handleStockForm(e)}
                            className="max-w-screen-md w-full bg-white p-5 relative flex-col flex gap-2">
                            <CreatStock setIsOpen={setIsOpen} isOpen={isOpen} loading={loading} />
                        </form>
                    </div>
                }
                {
                    isUpdateOpen && <div className="w-full bg-gray-100 bg-opacity-50 top-0 items-center left-0 flex justify-center h-full absolute">
                        <form ref={upformref} onSubmit={(e) => handleupdateProductForm(e)}
                            className="max-w-screen-md w-full bg-white p-5 relative flex-col flex gap-2">
                            <EditStock id={id} setIsUpdateOpen={setIsUpdateOpen} isUpdateOpen={isUpdateOpen} products={allProducts} loading={loading} />
                        </form>
                    </div>
                }
                {
                    message &&
                    <div className="absolute right-10 top-5">
                        {(message.error === true ? <p onClick={() => setMessage(null)} className='text-center text-sm px-2 py-1 rounded text-white bg-red-400'>{message.message}</p> :
                            <p onClick={() => setMessage(null)} className='text-center text-sm px-2 py-1 rounded bg-green-500 text-black'>{message.message}</p>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}