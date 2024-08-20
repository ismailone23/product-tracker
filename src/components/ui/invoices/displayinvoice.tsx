import { InvoiceTableType } from '@/types'
import Sinvoice from './sinvoice'

export default function Displayinvoice({
    invoices,
    handleAction,
    searchText
}: {
    searchText: string;
    invoices: InvoiceTableType[];
    handleAction: (id: string, list: string) => void
}) {
    return (
        <div className='flex w-full flex-col px-4 gap-1'>
            <div className='flex flex-col gap-1 w-full'>
                <div className='w-full bg-gray-50 p-1 grid grid-cols-10' >
                    <p>sl no.</p>
                    <p className='col-span-4'>Dealer Id</p>
                    <p>MRP</p>
                    <p>final</p>
                    <p className='text-sm col-span-2'>loss/profit</p>
                    <p>Action</p>
                </div>
                <div className='flex flex-col gap-2'>
                    {invoices.length > 0 ?
                        ((searchText.length > 0 && searchText != "") ?
                            invoices.filter(inv => inv.id.toLowerCase().includes(searchText.toLowerCase())).map((invoice, i) =>
                                <Sinvoice handleAction={handleAction} invoice={invoice} key={i} i={i} />
                            ) :
                            invoices.map((invoice, i) =>
                                <Sinvoice handleAction={handleAction} invoice={invoice} key={i} i={i} />
                            )) :
                        <p>no data</p>
                    }
                </div>
            </div>
        </div >
    )
}
