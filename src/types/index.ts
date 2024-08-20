export type ProductTableType = {
    id: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    product_name: string;
    price: number,
    pricetable: {
        id?: string;
        createdAt?: Date;
        updatedAt?: Date;
        productId: string;
        originalPrice: number,
        discount: number,
    };
    isdeleted: boolean;
    stockdetails: stockTrack;
    stock: number;
}
export type handleformtype = {
    id: string;
    stock: number;
    image: string;
    createdAt: Date;
    add_stock: number;
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
    id: string;
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
    customer?: customertype
    createdAt: Date;
    updatedAt: Date;
}

export type customertype = {
    id: string;
    dealerId: string;
    name: string;
    createdAt: Date;
    phone: string;
    updatedAt: Date;
}
export type stockTrack = {
    id: string;
    productId: string;
    details: string,
}
export type trackType = { quantity: number, createdat: Date }