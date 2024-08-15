export type ProductTableType = {
    id: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    product_name: string;
    price: number,
    extra?: {
        id?: string;
        createdAt?: Date;
        updatedAt?: Date;
        productId: string;
        originalPrice: number,
        discount: number,
    } | null
    stock: number;
}
export type handleformtype = {
    id: string;
    stock: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    originalPrice: number,
    product_name: string;
    price: number;
    riginalPrice: number;
    discount: number;
}
export type invoiceIdtype = {
    id: string,
    count: number
}
export type invoiceformtype = {
    id?: string;
    name: string;
    phone: string;
    originalbill: string;
    extradiscount: string;
    tax: string;
    totalbill: string;
}
export type InvoiceTableType = {
    id: string;
    customerId: string;
    originalbill: number;
    extradiscount: number;
    tax: number;
    totalbill: number;
    purchased_list: string
    createdAt: Date;
    updatedAt: Date;
}