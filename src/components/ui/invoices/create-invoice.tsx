import { api } from '@/trpc/shared'
import { invoiceIdtype } from '@/types';
import React, { ChangeEvent, Dispatch, FormEvent, MutableRefObject, SetStateAction, useEffect, useState } from 'react'

export default function CreateInvoice({
    formref,
    handleInvoiceForm,
    loading,
    setIsOpen,
    setPurchasedList,
    purchasedList,
    setMessage
}: {
    formref: MutableRefObject<HTMLFormElement | null>,
    handleInvoiceForm: (e: FormEvent<HTMLFormElement>) => Promise<void>,
    loading: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
    setPurchasedList: Dispatch<SetStateAction<{
        id: string;
        count: number;
    }[] | []>>
    purchasedList: [] | invoiceIdtype[]
    setMessage: Dispatch<SetStateAction<{
        error: boolean;
        message: string;
    } | null>>
}) {
    const [bills, setBills] = useState<{ totalBill: number, originalbill: number }>({ totalBill: 0, originalbill: 0 })
    const [count, setCount] = useState<string>('0')
    const selectArray: invoiceIdtype[] = []
    const [tbil, setTbil] = useState<{ discount: number, tax: number }>({ discount: 0, tax: 0 })
    const allProductsApi = api.product.getProduct.useQuery({})

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        (e.target.value === '00110' || count == '0') ?
            setPurchasedList(prev => [...prev]) :
            ((Number(allProductsApi.data?.filter(product => product.id == e.target.value)[0].stock) < Number(count)) ?
                (setPurchasedList(prev => [...prev]), setMessage({ error: true, message: "not enough stock" }))
                :
                (
                    setPurchasedList(prev => [...prev, { count: Number(count) ?? 1, id: e.target.value }]),
                    allProductsApi.data?.filter(data => data.id != e.target.id)
                )
            )
        if (e.target.value !== '00110' && count != '0' && !(Number(allProductsApi.data?.filter(product => product.id == e.target.value)[0].stock) < Number(count))) {
            selectArray.push({ count: Number(count) ?? 1, id: e.target.value });
            (allProductsApi.isFetched && allProductsApi.data) && selectArray.forEach(list => {
                setBills(prevBill => ({
                    ...prevBill,
                    originalbill: allProductsApi.data.filter(product => product.id == list.id)[0].price * list.count + prevBill.originalbill
                }))
            })
        }
    }

    const calculatetotal = () => {
        setBills(prevbil => ({ ...prevbil, totalBill: prevbil.originalbill + tbil.tax - tbil.discount }));
    }
    return (
        <div className="w-full bg-gray-100 bg-opacity-50 top-0 items-center left-0 flex justify-center h-full absolute">
            <form ref={formref} onSubmit={(e) => handleInvoiceForm(e)}
                className="max-w-screen-md w-full bg-white p-5 relative flex-col flex gap-2">
                <button className='absolute right-5 text-lg cursor-pointer top-2' onClick={() => setIsOpen(false)}>&times;</button>
                <div className='flex w-full gap-2'>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="name">Customer Name</label>
                        <input autoComplete='off' className='outline-none border w-full border-gray-200 rounded py-1 px-2'
                            type="text" name="name" id="name" required />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="phone">Phone Number</label>
                        <input autoComplete='off' className='outline-none border w-full border-gray-200 rounded py-1 px-2'
                            type="text" name="phone" id="phone" required />
                    </div>
                </div>
                <div className='flex w-full flex-col gap-2'>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="quantity">Quantity (define first)</label>
                        <input value={count} onChange={e => setCount(e.target.value)} autoComplete='off' className='outline-none border w-full border-gray-200 rounded py-1 px-2'
                            type="number" name="quantity" id="quantity" />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="purchased_list">Select Products</label>
                        <select onChange={handleSelect} className='border border-gray-200 py-1 px-2' name="purchased_list" id="purchased_list">
                            <option value="00110">select</option>
                            {
                                allProductsApi.isFetched &&
                                (allProductsApi.data && allProductsApi.data
                                    .filter(data => data.stock > 0)
                                    .map(product =>
                                        <option key={product.id} value={product.id}>{product.product_name}</option>
                                    ))
                            }
                        </select>
                    </div>
                </div>
                <div>
                    {
                        (purchasedList.length) > 0 &&
                        <ul>
                            {
                                purchasedList.map((list, i) =>
                                    <li className='text-xs' onClick={() => (
                                        setPurchasedList(purchasedList.filter(filterlist => filterlist.id != list.id)),
                                        setBills(prevbil => ({
                                            ...prevbil,
                                            originalbill: prevbil.originalbill - Number(allProductsApi.data?.filter(data => data.id == list.id)[0].price) * list.count,
                                        })))}
                                        key={i}>{allProductsApi.data?.filter(data => data.id == list.id)[0].product_name} &times; {list.count}
                                    </li>
                                )
                            }
                        </ul>
                    }
                </div>
                <div className='flex w-full gap-2'>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="extradiscount">Extra Discount tk</label>
                        <input defaultValue={tbil.discount} onChange={e => setTbil(p => ({ ...p, discount: Number(e.target.value) }))} autoComplete='off' className='outline-none border w-full border-gray-200 rounded py-1 px-2'
                            type="number" name="extradiscount" id="extradiscount" required />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="tax">Tax</label>
                        <input defaultValue={tbil.tax} onChange={e => setTbil(p => ({ ...p, tax: Number(e.target.value) }))} autoComplete='off' className='outline-none border w-full border-gray-200 rounded py-1 px-2'
                            type="number" name="tax" id="tax" required />
                    </div>
                </div>
                <div className='flex w-full gap-2'>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="originalbill">Original Bill</label>
                        <input value={bills.originalbill} readOnly autoComplete='off' className='outline-none border w-full border-gray-200 rounded py-1 px-2'
                            type="number" name="originalbill" id="originalbill" />
                    </div>
                </div>
                <button onClick={() => calculatetotal()} type='button' className='py-1 bg-sky-500 rounded text-white outline-none border border-gray-100'>calculate total bill</button>
                <div className='flex w-full gap-2'>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="totalbill">Total Bill</label>
                        <input value={bills.totalBill} readOnly autoComplete='off' className='outline-none border w-full border-gray-200 rounded py-1 px-2'
                            type="number" name="totalbill" id="totalbill" />
                    </div>
                </div>
                <button disabled={loading}
                    className={`w-full outline-none bg-emerald-700 disabled:bg-emerald-600 disabled:cursor-not-allowed py-1 rounded text-white border-none cursor-pointer`}
                >{loading ? 'loading...' : 'Create Invoice'}</button>
            </form>
        </div>
    )
}
