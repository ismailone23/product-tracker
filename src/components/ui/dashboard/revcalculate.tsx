'use client'

import { api } from '@/trpc/shared';
import { invoiceIdtype } from '@/types';

export default function Revcalculate() {
  let investamountinsells = 0;
  let totalamountinsells = 0;
  let revenue = 0;
  const invoiceapi = api.invoice.getInvoice.useQuery({}, { refetchOnMount: false })
  const productseapi = api.product.getProduct.useQuery({}, { refetchOnMount: false })

  if (((invoiceapi.isFetched && productseapi.isFetched)
    && (invoiceapi.data && productseapi.data)) &&
    (invoiceapi.data.length > 0 && productseapi.data.length > 0)) {
    for (let i = 0; i < invoiceapi.data.length; i++) {
      const jsonlist = (JSON.parse(invoiceapi.data[i].purchased_list) as invoiceIdtype[])
      for (let j = 0; j < jsonlist.length; j++) {
        const filterdproduct = productseapi.data.filter(product => product.id == jsonlist[j].id)[0]
        if (!filterdproduct.pricetable) throw new Error("no price table")
        investamountinsells += (Number(filterdproduct.pricetable?.originalPrice) * jsonlist[j].count)
      }
      totalamountinsells += invoiceapi.data[i].totalbill
    }
    revenue = totalamountinsells - investamountinsells
  }
  return (
    <div>
      <h1>Total invested amount in products {investamountinsells} </h1>
      <h1>Total amount from sells {totalamountinsells}</h1>
      <h1>Final Revenue {revenue}</h1>
    </div>
  )
}
