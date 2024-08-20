import { CustomersTable, InvoiceTable, ProductTable, UserTable } from "@/lib/schema";
import { createTRPCRouter, protectedRouter } from "@/server/api/trpc";
import { invoiceIdtype } from "@/types";
import { and, desc, eq, gt, lt, or } from "drizzle-orm";
import { z } from 'zod'
export const invoiceRouter = createTRPCRouter({
    getInvoice: protectedRouter
        .input(
            z.object({
                from: z.date().optional(),
                to: z.date().optional(),
                customerid: z.string().optional()
            }))
        .query(async ({ input: { from, to, customerid }, ctx: { db } }) => {
            if (from && to) {
                if (from.getTime() > to.getTime()) {
                    throw new Error("cannot possible to filter")
                }
                else if (from.getTime() < to.getTime()) {
                    return await db.query.InvoiceTable.findMany({
                        where: and(gt(InvoiceTable.createdAt, from),
                            lt(InvoiceTable.createdAt, to)), orderBy: desc(InvoiceTable.createdAt),
                        with: { customer: true }
                    })
                }
                else {
                    return await db.query.InvoiceTable.findMany({
                        where: or(lt(InvoiceTable.createdAt, from),
                            gt(InvoiceTable.createdAt, to)), orderBy: desc(InvoiceTable.createdAt),
                        with: { customer: true }
                    })
                }
            }
            else if (customerid) {
                return await db.query.InvoiceTable.findMany({
                    where: eq(InvoiceTable.customerId, customerid),
                    orderBy: desc(InvoiceTable.createdAt),
                    with: { customer: true }
                })
            } else {
                return await db.query.InvoiceTable.findMany({ orderBy: desc(InvoiceTable.createdAt), with: { customer: true } })
            }

        }),
    createInvoice: protectedRouter
        .input(
            z.object({
                purchased_list: z.string(),
                totalbill: z.number(),
                extradiscount: z.number(),
                tax: z.number(),
                originalbill: z.number(),
                id: z.string()
            }))
        .mutation(async ({ input:
            {
                purchased_list,
                totalbill,
                extradiscount,
                tax,
                originalbill,
                id
            },
            ctx: { db } }) => {

            const json_purchased_list = JSON.parse(purchased_list) as invoiceIdtype[]
            const productlist = await db.query.ProductTable.findMany({ columns: { id: true, stock: true } })
            json_purchased_list.forEach(async (list) => await db.update(ProductTable)
                .set({
                    stock: productlist.filter(plist => plist.id == list.id)[0].stock - list.count
                }).where(eq(ProductTable.id, list.id)))
            const customer = await db.query.CustomersTable.findFirst({ where: eq(CustomersTable.dealerId, id), columns: { id: true } })
            if (!customer) throw new Error("dealer not found")
            const newInvoice = await db.insert(InvoiceTable).values({
                customerId: customer.id,
                purchased_list,
                totalbill,
                extradiscount,
                tax,
                originalbill
            }).returning()
            if (!newInvoice) throw new Error("unable to create invoice")
            return newInvoice
        }),
    deleteInvoice: protectedRouter.input(z.object({ id: z.string(), list: z.string() })).mutation(async ({ input: { id, list }, ctx: { db } }) => {
        (JSON.parse(list) as invoiceIdtype[]).forEach(async (pid) => {
            const productliststock = await db.query.ProductTable.findFirst({ columns: { stock: true }, where: eq(ProductTable.id, pid.id) });
            return await db.update(ProductTable).set({ stock: Number(productliststock?.stock) + pid.count, updatedAt: new Date(Date.now()) }).where(eq(ProductTable.id, pid.id))
        })
        return await db.delete(InvoiceTable).where(eq(InvoiceTable.id, id)).returning();
    }),
    getCustomer: protectedRouter
        .input(z.object({
            phone: z.string().optional(),
            dealerId: z.string().optional()
        }))
        .query(async ({ input: { phone, dealerId }, ctx: { db } }) => {
            if (phone) {
                const customer = await db.select().from(CustomersTable).where(eq(CustomersTable.phone, phone))
                if (!customer) throw new Error("customer not found")
                return customer
            }
            else if (dealerId) {
                const customer = await db.select().from(CustomersTable).where(eq(CustomersTable.dealerId, dealerId))
                if (!customer) throw new Error("customer not found")
                return customer
            } else {
                const customers = await db.select().from(CustomersTable)
                    .orderBy(desc(CustomersTable.updatedAt))
                if (!customers) throw new Error("unable to found customers")
                return customers
            }
        }),
    createCustomer: protectedRouter.input(z.object({
        name: z.string(),
        phone: z.string()
    })).
        mutation(async ({ input: { name, phone }, ctx: { db } }) => {
            let dealercode = '2401' + String(Math.random()).split('.')[1].slice(0, 7)
            const newCustomer = await db.insert(CustomersTable).values({ name, phone, dealerId: dealercode })
                .onConflictDoUpdate({
                    set: {
                        name,
                        updatedAt: new Date(Date.now())
                    },
                    target: CustomersTable.phone
                }).returning()
            if (!newCustomer) throw new Error("unable to found customers")
            return newCustomer
        }),
    deleteCustomer: protectedRouter.input(z.string()).mutation(async ({ input: id, ctx: { db } }) => {
        const res = await db.delete(CustomersTable).where(eq(CustomersTable.id, id)).returning()
        if (!res) throw new Error("unable to delete")
        return res
    })
})