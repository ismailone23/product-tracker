'use client'
import { api } from '@/trpc/shared';
import { invoiceIdtype, InvoiceTableType } from '@/types';
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
    const productapi = api.product.getProduct.useQuery({})
    const customerapi = api.invoice.getCustomer.useQuery({ id: invoice.customerId })
    const purchased_list = (JSON.parse(invoice.purchased_list) as invoiceIdtype[])
    let purchased_products = []
    let price = 0;
    const [isCsCopy, setIsCsCopy] = useState(false)
    if ((productapi.isFetched && productapi.data) && (customerapi.isFetched && customerapi.data)) {

        for (let i = 0; i < purchased_list.length; i++) {
            const filterdProduct = productapi.data.filter(data => data.id == purchased_list[i].id)[0]
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
                    customerapi.data && <div className='flex w-full flex-col'>
                        <h1 className='w-full'>Invoice Id : <span className='text-sm'>{invoice.id}</span></h1>
                        <h1 className='w-full'>Customer name : <span className='text-sm'>{customerapi.data[0].name}</span></h1>
                        <h1 className='w-full'>Customer Phone Number : <span className='text-sm'>{customerapi.data[0].phone}</span></h1>
                        <h1>Date : {invoice.createdAt.getHours()}:{invoice.createdAt.getMinutes()} {invoice.createdAt.getDate()}/{invoice.createdAt.getMonth()}/{invoice.createdAt.getFullYear()}</h1>
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
            </div>
        </div >
    )
}
