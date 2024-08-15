
import { type AdapterAccount } from 'next-auth/adapters';
import { relations, sql } from 'drizzle-orm';
import {
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
    real,
    integer,
    primaryKey
} from 'drizzle-orm/pg-core'
import { invoiceIdtype } from '@/types';


export const UserRole = pgEnum("userRole", ["OWNER", "ADMIN", "MEMBER"]);

export const UserTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    image: text("image"),
    role: UserRole("userRole").notNull().default("MEMBER"),
    emailVerified: timestamp("email_verified"),
    createdAt: timestamp("created_at").notNull().defaultNow()
});

// 

export const usersRelations = relations(UserTable, ({ many }) => ({
    accounts: many(AccountsTable),
}));

export type User = typeof UserTable.$inferSelect;

export const AccountsTable = pgTable(
    "accounts",
    {
        createdAt: timestamp("created_at").notNull().defaultNow(),
        userId: uuid("user_id")
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        type: varchar("type").$type<AdapterAccount["type"]>().notNull(),
        provider: varchar("provider").notNull(),
        providerAccountId: varchar("provider_account_id").notNull(),
        refreshToken: text("refresh_token"),
        accessToken: text("access_token"),
        expiresAt: integer("expires_at"),
        tokenType: varchar("token_type").$type<AdapterAccount["token_type"]>(),
        scope: varchar("scope"),
        idToken: text("id_token"),
        session_state: varchar("session_state"),
    },
    (table) => ({
        pk: primaryKey({
            columns: [table.provider, table.providerAccountId],
        }),
    }),
);

export const AccountRelations = relations(AccountsTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [AccountsTable.userId],
        references: [UserTable.id],
    }),
}));

export type Account = typeof AccountsTable.$inferSelect;


export const SessionsTable = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
        .notNull()
        .references(() => UserTable.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const SessionsTableRelations = relations(SessionsTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [SessionsTable.userId],
        references: [UserTable.id],
    }),
}));

export type Session = typeof SessionsTable.$inferSelect;

export const VerificationTokensTable = pgTable(
    "verificationToken",
    {
        identifier: uuid("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verficationToken) => ({
        pk: primaryKey({
            columns: [verficationToken.identifier, verficationToken.token],
        }),
    })
)

export const VerificationTokensRelations = relations(
    VerificationTokensTable,
    ({ }) => ({}),
);
export const CustomersTable = pgTable('customers', {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: varchar("name").notNull(),
    phone: varchar("phone").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
}, table => {
    return {
        phoneIndex: uniqueIndex("phoneIndex").on(table.phone),
    }
})

export type CustomersTableType = typeof CustomersTable;

export const InvoiceTable = pgTable("invoices", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    customerId: uuid("customer_id").references(() => CustomersTable.id).notNull(),
    purchased_list: text("purchased_list").notNull(),
    totalbill: real("total_bill").notNull(),
    originalbill: real("original_bill").notNull(),
    extradiscount: real("extra_discount").notNull(),
    tax: real("tax").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const CustomerInvoiceRelation = relations(CustomersTable, ({ many }) => {
    return {
        invoices: many(InvoiceTable)
    }
})

export const InvoiceCustomerRelation = relations(InvoiceTable, ({ one }) => {
    return {
        customer: one(CustomersTable, {
            fields: [InvoiceTable.customerId],
            references: [CustomersTable.id]
        })
    }
})

export const ProductTable = pgTable("products", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    product_name: varchar("product_name").notNull(),
    price: real("price").notNull(),
    stock: real("stock").notNull(),
    image: text("image").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})
export const PriceDiscountTable = pgTable("pricediscount", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    productId: uuid("product_id").references(() => ProductTable.id).notNull(),
    originalPrice: real("original_price").notNull(),
    discount: real('discount').notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})
export const ProductPriceDiscountRelation = relations(ProductTable, ({ one }) => {
    return {
        extra: one(PriceDiscountTable)
    }
})
export const PriceProductRelation = relations(PriceDiscountTable, ({ one }) => {
    return {
        product: one(ProductTable,
            {
                fields: [PriceDiscountTable.productId],
                references: [ProductTable.id]
            }
        )
    }
})