'use client'

import Displayerror from '@/components/shared/displayerror'
import Searchbar from '@/components/shared/searchbar'
import Sharedtop from '@/components/ui/dashboard/sharedtop'
import CreateInvoice from '@/components/ui/invoices/create-invoice'
import Displayinvoice from '@/components/ui/invoices/displayinvoice'
import Invoicefilter from '@/components/ui/invoices/invoicefilter'
import { api } from '@/trpc/shared'
import { invoiceformtype, invoiceIdtype } from '@/types'
import { FormEvent, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

export default function Page() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<{ error: boolean, message: string } | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [searchDate, setSearchDate] = useState<{ from: Date, to: Date }>({ from: new Date(Date.now()), to: new Date(Date.now()) })
    const formref = useRef<HTMLFormElement | null>(null)
    const [purchasedList, setPurchasedList] = useState<invoiceIdtype[] | []>([])
    const [searchText, setSearchText] = useState<string>('')
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
    const deleteInvoiceapi = api.invoice.deleteInvoice.useMutation({
        onSuccess: () => {
            invoiceapi.refetch();
            setLoading(false)
            setMessage({ error: false, message: "invoice deleted" })
        },
        onError: ({ message }) => {
            setLoading(false)
            setMessage({ error: true, message })

        }
    })
    const handleAction = (id: string, list: string) => {
        setMessage(null)
        setLoading(true)
        deleteInvoiceapi.mutate({ id, list })
    }
    return (
        <>
            <div className='flex w-full flex-col gap-2 mb-10'>
                <div className='w-full flex'>
                    <Sharedtop text='Invoice' isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
                <div className='flex w-full items-end'>
                    <Invoicefilter setSearchDate={setSearchDate} />
                    <Searchbar searchText={searchText} setSearchText={setSearchText} text='Invoice' />
                </div>
                <hr />
                {
                    invoiceapi.isFetching ?
                        <div className='flex flex-col gap-1 w-full px-4'>
                            <Skeleton width={300} height={10} count={5} />
                        </div>
                        : (invoiceapi.data && (invoiceapi.data.length > 0 ?
                            <Displayinvoice searchText={searchText} handleAction={handleAction} invoices={invoiceapi.data} /> :
                            <p className='px-4'>no data</p>
                        ))
                }
            </div>
            {
                isOpen && <CreateInvoice setMessage={setMessage} purchasedList={purchasedList} setPurchasedList={setPurchasedList} setIsOpen={setIsOpen} loading={loading} handleInvoiceForm={handleInvoiceForm} formref={formref} />
            }
            <Displayerror message={message} setMessage={setMessage} />

        </>
    )
}
