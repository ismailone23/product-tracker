import React, { Dispatch, FormEvent, MutableRefObject, SetStateAction } from 'react'

export default function CreateCustomer({
    formref,
    handleInvoiceForm,
    loading,
    setIsOpen
}: {
    formref: MutableRefObject<HTMLFormElement | null>,
    handleInvoiceForm: (e: FormEvent<HTMLFormElement>) => void,
    loading: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <div className="w-full bg-gray-100 bg-opacity-50 top-0 items-center left-0 flex justify-center h-full absolute">
            <form ref={formref} onSubmit={(e) => handleInvoiceForm(e)}
                className="max-w-screen-sm w-full bg-white p-5 relative flex-col flex gap-2">
                <button className='absolute right-5 text-lg cursor-pointer top-2' onClick={() => setIsOpen(false)}>&times;</button>
                <div className='flex flex-col'>
                    <label htmlFor="name">Customer Name</label>
                    <input autoComplete='off' className='outline-none border border-gray-200 rounded py-1 px-2'
                        type="text" name="name" id="name" required />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="phone">Phone Number</label>
                    <input autoComplete='off' className='outline-none border border-gray-200 rounded py-1 px-2'
                        type="text" name="phone" id="phone" required />
                </div>
                <button disabled={loading}
                    className={`w-full outline-none bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed py-1 rounded text-white border-none cursor-pointer`}
                >{loading ? 'loading...' : 'Create Customer'}</button>
            </form>
        </div>
    )
}
