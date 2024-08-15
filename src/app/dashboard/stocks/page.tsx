'use client'

import Sharedtop from "@/components/ui/dashboard/sharedtop";
import CreatStock from "@/components/ui/stocks/create-stock"
import Displays from "@/components/ui/stocks/displays";
import EditStock from "@/components/ui/stocks/edit-stock";
import { handleFormForStock, handleUpdateStockForm } from "@/lib/client/productsubmit";
import { api } from "@/trpc/shared"
import { handleformtype, ProductTableType } from "@/types";
import { FormEvent, Suspense, useRef, useState } from "react";
import Displayskeleton from '@/app/dashboard/stocks/displayskeleton'
import Searchbar from "@/components/shared/searchbar";

export default function Page({ searchParams }: { searchParams?: { page?: string } }) {
    const formref = useRef<HTMLFormElement | null>(null)
    const upformref = useRef<HTMLFormElement | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const pagen = Number(searchParams?.page) || 1;
    const allProductsApi = api.product.getProduct.useQuery({ page: pagen, pagesize: 6 });
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
        let data = await handleFormForStock(formref, setMessage).then(data => data) as handleformtype
        createStockapi.mutate({ ...data })
        formref.current?.reset()
        setLoading(false)
        setIsOpen(false)
    }
    const handleupdateProductForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        let data = await handleUpdateStockForm(upformref, setMessage, allProducts, id).then(data => data) as handleformtype
        updateProductApi.mutate({ ...data })
        formref.current?.reset()
        setIsUpdateOpen(false)
        setLoading(false)
    }
    const handleIncDec = (type: "inc" | "dec" | "del", id: string, stock: ProductTableType) => {
        setLoading(true)
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
        setLoading(false)
    }
    return (
        <div className="w-full h-full overflow-y-auto flex items-center flex-col">
            <div className="w-full flex flex-col items-center h-full overflow-auto gap-2">
                <Sharedtop isOpen={isOpen} setIsOpen={setIsOpen} text="Stock" />
                <Searchbar searchText={searchText} setSearchText={setSearchText} text="product" />
                <div className="w-full flex px-4 flex-col">
                    {allProductsApi.isFetching ?
                        <Suspense fallback={<p>loading....</p>}>
                            <div className="flex flex-col gap-2">
                                <Displayskeleton />
                                <Displayskeleton />
                            </div>
                        </Suspense>
                        :
                        allProducts && (
                            allProducts.length > 0 ?
                                <Displays loading={loading} setId={setId} searchText={searchText} products={allProducts}
                                    handleIncDec={handleIncDec} isUpdateOpen={isUpdateOpen}
                                    setIsUpdateOpen={setIsUpdateOpen} />
                                :
                                <p className="italic">No Data</p>)
                    }
                </div>
                {
                    isOpen &&
                    <CreatStock
                        formref={formref}
                        handleStockForm={handleStockForm}
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                        loading={loading}
                    />
                }
                {
                    isUpdateOpen &&
                    <EditStock
                        handleupdateProductForm={handleupdateProductForm}
                        id={id}
                        upformref={upformref}
                        setIsUpdateOpen={setIsUpdateOpen}
                        isUpdateOpen={isUpdateOpen}
                        products={allProducts}
                        loading={loading} />

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