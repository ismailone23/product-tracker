import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar, json, real, integer } from 'drizzle-orm/pg-core'

export const UserRole = pgEnum("userRole", ["OWNER", "ADMIN", "MEMBER"]);

export const UserTable = pgTable("users", {
    id: uuid("id").notNull().unique().defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    image: text("image"),
    role: UserRole("userRole").notNull().default("MEMBER"),
    createdAt: timestamp("created_at").notNull().defaultNow()
});

export const CustomersTable = pgTable('customers', {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: varchar("name").notNull(),
    email: varchar("email"),
    image: text("image"),
    phone: varchar("phone").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
}, table => {
    return {
        emailIndex: uniqueIndex("emailIndex").on(table.email),
        phoneIndex: uniqueIndex("phoneIndex").on(table.phone),
    }
})
type purchaselist = {
    product_name: string,
    prize: number,
    quantity: number,
    product_id: string
}
export const InvoiceTable = pgTable("invoices", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    customerId: uuid("customer_id").references(() => UserTable.id).notNull(),
    purchased_list: varchar("purchased_list").array().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})
// relation between customerTable and invoice table
export const CustomersTableRelation = relations(CustomersTable, ({ many }) => {
    return {
        invoices: many(InvoiceTable)
    }
})
export const InvoiceTableRelation = relations(InvoiceTable, ({ one }) => {
    return {
        user: one(UserTable, {
            fields: [InvoiceTable.customerId],
            references: [UserTable.id]
        })
    }
})

export const ProductTable = pgTable("products", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    product_name: varchar("product_name").notNull(),
    price: real("price").notNull(),
    stoc: integer("stock").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()

})
