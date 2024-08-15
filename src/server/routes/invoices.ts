import { CustomersTable, InvoiceTable, ProductTable } from "@/lib/schema";
import { createTRPCRouter, protectedRouter } from "@/server/api/trpc";
import { invoiceIdtype } from "@/types";
import { and, desc, eq, gt, lt, or } from "drizzle-orm";
import { z } from 'zod'
export const invoiceRouter = createTRPCRouter({
    getInvoice: protectedRouter
        .input(
            z.object({
                from: z.date(),
                to: z.date()
            }))
        .query(async ({ input: { from, to }, ctx: { db } }) => {
            if (from.getTime() > to.getTime()) {
                console.log('lt');
                throw new Error("cannot possible to filter")
            }
            else if (from.getTime() < to.getTime()) {
                console.log('gt');
                return await db.query.InvoiceTable.findMany({ where: and(gt(InvoiceTable.createdAt, from), lt(InvoiceTable.createdAt, to)), orderBy: desc(InvoiceTable.createdAt) })
            }
            else {
                return await db.query.InvoiceTable.findMany({ where: or(lt(InvoiceTable.createdAt, from), gt(InvoiceTable.createdAt, to)), orderBy: desc(InvoiceTable.createdAt) })
            }
        }),
    createInvoice: protectedRouter
        .input(
            z.object({
                name: z.string(),
                phone: z.string(),
                purchased_list: z.string(),
                totalbill: z.number(),
                extradiscount: z.number(),
                tax: z.number(),
                originalbill: z.number()
            }))
        .mutation(async ({ input:
            {
                name,
                phone,
                purchased_list,
                totalbill,
                extradiscount,
                tax,
                originalbill
            },
            ctx: { db } }) => {
            const json_purchased_list = JSON.parse(purchased_list) as invoiceIdtype[]
            const productlist = await db.query.ProductTable.findMany({ columns: { id: true, stock: true } })
            json_purchased_list.forEach(async (list) => await db.update(ProductTable)
                .set({
                    stock: productlist.filter(plist => plist.id == list.id)[0].stock - list.count
                }).where(eq(ProductTable.id, list.id)))
            const newCustomer = await db.insert(CustomersTable).values({ name, phone })
                .onConflictDoUpdate({
                    set: {
                        name,
                        updatedAt: new Date(Date.now())
                    },
                    target: CustomersTable.phone
                }).returning({ id: CustomersTable.id })
            if (!newCustomer) throw new Error("unable to create customers")

            const newInvoice = await db.insert(InvoiceTable).values({
                customerId: newCustomer[0].id,
                purchased_list,
                totalbill,
                extradiscount,
                tax,
                originalbill
            }).returning()
            if (!newInvoice) throw new Error("unable to create invoice")
            return newInvoice
        }),
    getCustomer: protectedRouter
        .input(z.object({
            phone: z.string().optional()
        }))
        .query(async ({ input: { phone }, ctx: { db } }) => {
            if (phone) {
                const customer = await db.select().from(CustomersTable).where(eq(CustomersTable.phone, phone))
                if (!customer) throw new Error("customer not found")
                return customer
            }
            const customers = await db.select().from(CustomersTable)
            if (!customers) throw new Error("unable to found customers")
            return customers
        }),
    createCustomer: protectedRouter.input(z.object({
        name: z.string(),
        phone: z.string()
    })).
        mutation(async ({ input: { name, phone }, ctx: { db } }) => {
            const newCustomer = await db.insert(CustomersTable).values({ name, phone })
                .onConflictDoUpdate({
                    set: {
                        name,
                        updatedAt: new Date(Date.now())
                    },
                    target: CustomersTable.phone
                }).returning()
            if (!newCustomer) throw new Error("unable to found customers")
            return newCustomer
        })
})