import { invoiceIdtype, InvoiceTableType, ProductTableType } from '@/types'
import React from 'react'

export default function Calculate({ invoice, products }: { invoice: InvoiceTableType, products: ProductTableType[] }) {
    let price = 0;

    if (products) {
        let plists = JSON.parse(invoice.purchased_list) as invoiceIdtype[]
        for (let i = 0; i < plists.length; i++) {
            const filterproduct = products.filter(prdct => prdct.id == plists[i].id)[0]
            price += Math.round((filterproduct.price - filterproduct.price * (Number(filterproduct.pricetable?.discount) / 100)) - Number(filterproduct.pricetable?.originalPrice)) * plists[i].count
        }
        price += Math.round(invoice.totalbill - invoice.originalbill)
    }

    return (
        <h1 className={`${price > 0 ? "text-emerald-500" : "text-red-500"} text-sm`}>{price}</h1>
    )
}
