'use client'
import { api } from '@/trpc/shared';
import { invoiceIdtype, InvoiceTableType, ProductTableType } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print';


export default function Infomodal({
    setIsModalOpen,
    invoice
}: {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    invoice: InvoiceTableType
}) {
    const productapi = api.product.getProduct.useQuery({}, { refetchOnMount: false })
    const purchased_list = (JSON.parse(invoice.purchased_list) as invoiceIdtype[])
    let purchased_products = []
    let price = 0;
    const [isCsCopy, setIsCsCopy] = useState(false)
    if (productapi.isFetched && productapi.data) {

        for (let i = 0; i < purchased_list.length; i++) {
            const filterdProduct = productapi.data.filter(data => data.id == purchased_list[i].id)[0] as ProductTableType
            purchased_products.push({
                ...filterdProduct,
                count: purchased_list[i].count
            });
            price += Math.round((filterdProduct.price - filterdProduct.price * (Number(filterdProduct.pricetable?.discount) / 100)) - Number(filterdProduct.pricetable?.originalPrice)) * purchased_list[i].count
        }
        price += Math.round(invoice.totalbill - invoice.originalbill)
    }
    const componentRef = useRef<HTMLDivElement | null>(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint: true,
    });
    return (
        <div className='absolute left-0 top-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center'>
            <div ref={componentRef} className="relative gap-2 items-end flex flex-col max-w-screen-lg w-full min-h-24 rounded-sm bg-white p-2">
                <button className='absolute right-2 top-2' onClick={() => setIsModalOpen(false)}><XMarkIcon className='w-5' /></button>
                {
                    <div className='flex w-full flex-col'>
                        <h1 className='w-full'>Dealer Code : <span className='text-sm'>{invoice.customer?.dealerId}</span></h1>
                        <h1 className='w-full'>Customer name : <span className='text-sm'>{invoice.customer?.name}</span></h1>
                        <h1 className='w-full'>Customer Phone Number : <span className='text-sm'>{invoice.customer?.phone}</span></h1>
                        <h1>Date : {invoice.createdAt.getHours()}:{invoice.createdAt.getMinutes()} {invoice.createdAt.getDate()}/{invoice.createdAt.getMonth() + 1}/{invoice.createdAt.getFullYear()}</h1>
                    </div>
                }
                <table className='w-full border border-gray-100 overflow-hidden'>
                    <tr>
                        <td className='border border-gray-100 items-center text-sm min-w-12 px-1'>sl no</td>
                        <td className='border border-gray-100 items-center text-sm px-1'>Product Name</td>
                        {!isCsCopy && <td className='border border-gray-100 items-center text-sm min-w-24 px-1'>Price</td>}
                        <td className='border border-gray-100 items-center text-sm min-w-24 px-1'>MRP</td>
                        <td className='border border-gray-100 items-center text-sm min-w-24 px-1'>Quantity</td>
                        <td className='border border-gray-100 items-center text-sm min-w-24 px-1'>Unit & MRP</td>
                        <td className='border border-gray-100 items-center text-sm min-w-24 px-1'>Asked Price</td>
                        <td className='border border-gray-100 items-center text-sm min-w-24 max-w-28 px-1'>Total Price & Discount & tax</td>
                        {!isCsCopy && <td className='border border-gray-100 items-center text-sm min-w-24 max-w-28 px-1'>Loss / Profit</td>}
                    </tr>
                    {
                        purchased_products.map((product, i) =>
                            <tr key={i}>
                                <td className='border border-gray-100 items-center text-sm px-1' align='center'>{i + 1}</td>
                                <td className='border border-gray-100 items-center text-sm px-1 line-clamp-1'>{product.product_name}</td>
                                {!isCsCopy && <td className='border border-gray-100 items-center text-sm px-1'>{product.pricetable?.originalPrice}</td>}
                                <td className='border border-gray-100 items-center text-sm px-1'>{Math.round(product.price - product.price * (Number(product.pricetable?.discount) / 100))}</td>
                                <td className='border border-gray-100 items-center text-sm px-1'>{product.count}</td>
                                <td className='border border-gray-100 items-center text-sm px-1'>{Math.round(product.price - product.price * (Number(product.pricetable?.discount) / 100)) * product.count}</td>
                                {i == 0 && <td rowSpan={purchased_list.length} className='border border-gray-100 items-center text-sm px-1'>{invoice.originalbill}</td>}
                                {i == 0 && <td rowSpan={purchased_list.length} className='border border-gray-100 items-center text-sm px-1'>{invoice.totalbill}</td>}
                                {(!isCsCopy && i == 0) && <td rowSpan={purchased_list.length} className='border border-gray-100 items-center text-sm px-1'>{price}</td>}
                            </tr>
                        )}
                </table>
                <div className='flex gap-2'>
                    <button onClick={() => setIsCsCopy(!isCsCopy)} className='bg-purple-600 px-2 text-white rounded-sm py-1'>{isCsCopy ? "Customer" : "Shop"} Copy</button>
                    <button onClick={handlePrint} className='bg-emerald-500 px-5 text-white rounded-sm py-1'>Print</button>
                </div>
                <div className='flex'>
                    <p>Developed by <a about='_ismail' href="mailto:ismailhsan45@gmail.com">Ismail Hossain email : ismailhsan45@gmail.com</a></p>
                </div>
            </div>
        </div >
    )
}
