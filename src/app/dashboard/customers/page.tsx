'use client'
import Displayerror from '@/components/shared/displayerror'
import Searchbar from '@/components/shared/searchbar'
import CreateCustomer from '@/components/ui/customers/create-customer'
import Displaycustomer from '@/components/ui/customers/displaycustomer'
import Sharedtop from '@/components/ui/dashboard/sharedtop'
import { api } from '@/trpc/shared'
import React, { FormEvent, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'


export default function Page() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<{ error: boolean, message: string } | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const formref = useRef<HTMLFormElement | null>(null)
    const allcustomersapi = api.invoice.getCustomer.useQuery({})
    const deleteCustomerapi = api.invoice.deleteCustomer.useMutation({
        onSuccess: () => {
            setMessage({ error: false, message: 'deleted user' })
            setLoading(false)
            allcustomersapi.refetch()
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
            setLoading(false)
        }
    })

    const createCustomerApi = api.invoice.createCustomer.useMutation({
        onSuccess: () => {
            setMessage({ error: false, message: "customer created" })
            setLoading(false)
            setIsOpen(false)
            allcustomersapi.refetch()
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
    const handledeletecustomer = (id: string) => {

    }
    return (
        <>
            <div className='flex w-full flex-col gap-2'>
                <div className='w-full flex'>
                    <Sharedtop text='Customer' isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
                <Searchbar text='customer' searchText={searchText} setSearchText={setSearchText} />
                {allcustomersapi.isFetching ?
                    <div className='flex flex-col gap-1 w-full px-4'>
                        <Skeleton width={400} height={10} count={5} />
                    </div>
                    :
                    allcustomersapi.data && (allcustomersapi.data.length > 0 ?
                        <Displaycustomer handledeletecustomer={handledeletecustomer} searchText={searchText} customers={allcustomersapi.data} />
                        :
                        <p className='px-4'>no customer</p>)
                }
            </div>
            {
                isOpen && <CreateCustomer setIsOpen={setIsOpen} loading={loading} handleInvoiceForm={handleInvoiceForm} formref={formref} />
            }
            <Displayerror message={message} setMessage={setMessage} />

        </>
    )
}
