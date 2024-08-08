'use client'

import CreatStock from "@/components/ui/stocks/create-stock"
import Displays from "@/components/ui/stocks/displays";
import { storage } from "@/firebase";
import { api } from "@/trpc/shared"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FormEvent, useRef, useState } from "react";

export default function page() {
    const formref = useRef<HTMLFormElement | null>(null)
    const getStocks = api.product.getStock.useQuery();
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ error: boolean, message: string } | null>(null)
    const createStockapi = api.product.createStock.useMutation({
        onSuccess: () => {
            getStocks.refetch();
            setMessage({ error: false, message: "uploaded stock successfully" })
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
        }
    })
    const handleStockForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(!loading)
        setMessage(null)
        const formData = new FormData(formref.current as HTMLFormElement)
        const { price, stock, product_name, image } = Object.fromEntries(formData)
        const imagefile = formData.get("image") as File
        if (imagefile) {
            try {
                const imageblob = URL.createObjectURL(imagefile)
                const newImageRef = ref(storage, imageblob);
                await uploadBytesResumable(newImageRef, imagefile);
                const imgUrl = await getDownloadURL(newImageRef);
                createStockapi.mutate({
                    image: imgUrl,
                    price: Number(price),
                    product_name: product_name as string,
                    stock: Number(stock)
                })
            } catch (error) {
                setMessage({ error: true, message: 'some error occured' })
                console.log(error);
            }
        } else {
            createStockapi.mutate({
                image: 'no image',
                price: Number(price),
                product_name: product_name as string,
                stock: Number(stock)
            })
        }
        formref.current?.reset()
        setLoading(false);
    }
    return (
        <div className="w-full h-full overflow-y-auto flex p-2 items-center flex-col">
            <div className="w-full max-w-[500px] flex flex-col items-center h-full overflow-auto gap-2">
                <h1 className="text-center">Add new product to stocks</h1>
                {
                    message &&
                    <div>
                        {(message.error === true ? <p className='text-center text-red-400'>{message.message}</p> :
                            <p className='text-center text-green-400'>{message.message}</p>
                        )}
                    </div>
                }
                <form ref={formref} onSubmit={handleStockForm} className="w-full flex-col flex gap-2">
                    <CreatStock loading={loading} />
                </form>
                {
                    Number(getStocks.data?.length) > 0 ?
                        <Displays products={getStocks.data} />
                        :
                        <p>no data</p>
                }
            </div>
        </div>
    )
}