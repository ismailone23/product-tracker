'use client'

import Sharedtop from '@/components/ui/dashboard/sharedtop'
import CreateInvoice from '@/components/ui/invoices/create-invoice'
import Displayinvoice from '@/components/ui/invoices/displayinvoice'
import Invoicefilter from '@/components/ui/invoices/invoicefilter'
import { api } from '@/trpc/shared'
import { invoiceformtype, invoiceIdtype } from '@/types'
import { FormEvent, useEffect, useRef, useState } from 'react'

export default function Page() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<{ error: boolean, message: string } | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [searchDate, setSearchDate] = useState<{ from: Date, to: Date }>({ from: new Date(Date.now()), to: new Date(Date.now()) })
    const formref = useRef<HTMLFormElement | null>(null)
    const [purchasedList, setPurchasedList] = useState<invoiceIdtype[] | []>([])

    const invoiceapi = api.invoice.getInvoice.useQuery({ from: new Date(searchDate.from), to: new Date(searchDate.to) });

    const createInvoiceApi = api.invoice.createInvoice.useMutation({
        onSuccess: () => {
            setLoading(false);
            setIsOpen(false)
            setPurchasedList([])
            setMessage({ message: "invoice created", error: false })
            invoiceapi.refetch()
        },
        onError: ({ message }) => {
            setLoading(false);
            setMessage({ message, error: true })
        }
    })

    const handleInvoiceForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const formData = new FormData(formref.current as HTMLFormElement)
        const { name, phone, originalbill, extradiscount, tax, totalbill } = Object.fromEntries(formData) as invoiceformtype;
        createInvoiceApi.mutate({
            name,
            phone,
            tax: Number(tax),
            totalbill: Number(totalbill),
            originalbill: Number(originalbill),
            extradiscount: Number(extradiscount),
            purchased_list: JSON.stringify(purchasedList)
        })
        formref.current?.reset();
    }
    return (
        <>
            <div className='flex w-full flex-col gap-2 mb-10'>
                <div className='w-full flex'>
                    <Sharedtop text='Invoice' isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
                <Invoicefilter setSearchDate={setSearchDate} />
                <hr />
                {((invoiceapi.isFetched && invoiceapi.data) && invoiceapi.data.length > 0) && <Displayinvoice invoices={invoiceapi.data} />}
            </div>
            {
                isOpen && <CreateInvoice setMessage={setMessage} purchasedList={purchasedList} setPurchasedList={setPurchasedList} setIsOpen={setIsOpen} loading={loading} handleInvoiceForm={handleInvoiceForm} formref={formref} />
            }
            {
                message &&
                <div className="absolute right-10 top-5">
                    {(message.error === true ? <p onClick={() => setMessage(null)} className='text-center text-sm px-2 py-1 rounded text-white bg-red-400'>{message.message}</p> :
                        <p onClick={() => setMessage(null)} className='text-center text-sm px-2 py-1 rounded bg-green-500 text-black'>{message.message}</p>
                    )}
                </div>
            }
        </>
    )
}
