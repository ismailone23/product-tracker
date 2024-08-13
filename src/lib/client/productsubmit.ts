import { storage } from "@/firebase"
import { ProductTableType } from "@/types";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { ChangeEvent, Dispatch, MutableRefObject, SetStateAction } from "react"

export const handleFormForStock = async (
    formref: MutableRefObject<HTMLFormElement | null>,
    setMessage: Dispatch<SetStateAction<{
        error: boolean;
        message: string;
    } | null>>
) => {
    setMessage(null)
    const formData = new FormData(formref.current as HTMLFormElement)
    const { price, stock, product_name } = Object.fromEntries(formData)
    const imagefile = formData.get("image") as File

    if (imagefile.size > 0) {
        try {
            const imageblob = URL.createObjectURL(imagefile)
            const newImageRef = ref(storage, imageblob);
            await uploadBytesResumable(newImageRef, imagefile);
            const imgUrl = await getDownloadURL(newImageRef);
            return {
                image: imgUrl as string,
                price: Number(price),
                product_name: product_name as string,
                stock: Number(stock)
            }
        } catch (error) {
            return { error }
        }
    } else {
        return {
            image: 'no image',
            price: Number(price),
            product_name: product_name as string,
            stock: Number(stock)
        }
    }
}
export const handleUpdateStockForm = async (
    formref: MutableRefObject<HTMLFormElement | null>,
    setMessage: Dispatch<SetStateAction<{
        error: boolean;
        message: string;
    } | null>>,
    allProducts: ProductTableType[],
    id: string
) => {
    setMessage(null)
    const formData = new FormData(formref.current as HTMLFormElement)
    const { price, stock, product_name } = Object.fromEntries(formData)
    const imagefile = formData.get("image") as File
    const product = allProducts.filter(product => product.id === id)[0]
    if (imagefile.size > 0) {
        try {
            const imageblob = URL.createObjectURL(imagefile)
            const newImageRef = ref(storage, imageblob);
            await uploadBytesResumable(newImageRef, imagefile);
            const imgUrl = await getDownloadURL(newImageRef);
            return {
                image: imgUrl as string,
                price: Number(price),
                product_name: product_name as string,
                stock: Number(stock),
                id,
                updatedAt: Number(stock) !== product.stock ? new Date(Date.now()) : product.updatedAt
            }
        } catch (error) {
            return { error }
        }
    } else {
        return {
            image: product.image,
            price: Number(price),
            product_name: product_name as string,
            stock: Number(stock),
            id,
            updatedAt: Number(stock) !== product.stock ? new Date(Date.now()) : product.updatedAt
        }
    }
}