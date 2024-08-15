'use client'
import Searchbar from '@/components/shared/searchbar'
import CreateCustomer from '@/components/ui/customers/create-customer'
import Sharedtop from '@/components/ui/dashboard/sharedtop'
import { api } from '@/trpc/shared'
import React, { FormEvent, useRef, useState } from 'react'


export default function Page() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<{ error: boolean, message: string } | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const formref = useRef<HTMLFormElement | null>(null)

    const createCustomerApi = api.invoice.createCustomer.useMutation({
        onSuccess: () => {
            setMessage({ error: false, message: "customer created" })
            setLoading(false)
            setIsOpen(false)
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
            setLoading(false)
        }
    });
    const handleInvoiceForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(formref.current as HTMLFormElement)
        const { name, phone } = Object.fromEntries(formData) as { name: string, phone: string };
        createCustomerApi.mutate({ name, phone })
        formref.current?.reset()
    }
    return (
        <>
            <div className='flex w-full flex-col gap-2'>
                <div className='w-full flex'>
                    <Sharedtop text='Customer' isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
                <Searchbar text='customer' searchText={searchText} setSearchText={setSearchText} />
                <div>

                </div>
            </div>
            {
                isOpen && <CreateCustomer setIsOpen={setIsOpen} loading={loading} handleInvoiceForm={handleInvoiceForm} formref={formref} />
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
