import { api } from '@/trpc/shared'
import React from 'react'

export default function Stocklength() {
    const productapi = api.product.getProduct.useQuery({})
    let stock = 0;
    if ((productapi.isFetched && productapi.data) && productapi.data.length > 0) {
        for (let i = 0; i < productapi.data.length; i++) {
            stock += productapi.data[i].stock;
        }
    }
    return (
        <div>
            {(productapi.isFetched && productapi.data) && <div>
                <p>Available products : {productapi.data.length}</p>
                <p>Products Quantity : {stock}</p>
            </div>}
        </div>
    )
}
