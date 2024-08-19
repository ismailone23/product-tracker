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
import Displayerror from "@/components/shared/displayerror";

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
            setLoading(false)
            setIsOpen(false)
            setMessage({ error: false, message: "uploaded stock successfully" })
        },
        onError: ({ message }) => {
            setLoading(false)
            setMessage({ error: true, message })
        }
    })
    const updateProductApi = api.product.updateProduct.useMutation({
        onSuccess: () => {
            allProductsApi.refetch()
            setIsUpdateOpen(false)
            setLoading(false)
        },
        onError: ({ message }) => {
            setLoading(false)
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
    }
    const handleupdateProductForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        let data = await handleUpdateStockForm(upformref, setMessage, allProducts, id).then(data => data) as handleformtype
        updateProductApi.mutate({ ...data })
        formref.current?.reset()
    }
    const handleDel = (id: string) => {
        setLoading(true)
        if (confirm("do you want to delete it for sure ? ")) { deleteProductApi.mutate({ id }) }
        setLoading(false)
    }
    return (
        <div className="w-full h-full overflow-y-auto flex items-center flex-col">
            <div className="w-full flex flex-col items-center h-full overflow-auto gap-2">
                <div className="w-full flex flex-col items-center h-full overflow-hidden gap-2">
                    <Sharedtop isOpen={isOpen} setIsOpen={setIsOpen} text="Stock" />
                    <Searchbar searchText={searchText} setSearchText={setSearchText} text="product" />
                    <div className="w-full flex px-4 flex-col h-auto overflow-y-auto">
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
                                        handleDel={handleDel} isUpdateOpen={isUpdateOpen}
                                        setIsUpdateOpen={setIsUpdateOpen} />
                                    :
                                    <p className="italic">No Data</p>)
                        }
                    </div>
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
                <Displayerror message={message} setMessage={setMessage} />
            </div>
        </div>
    )
}