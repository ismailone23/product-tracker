'use client'
import Input from './input'
export default function CreatStock({ loading }: { loading: boolean }) {
    return (
        <div>
            <Input type="text" name="product_name" title="Product Name" />
            <div className="w-full flex gap-2">
                <Input type="number" name="price" title="Product Price" />
                <Input type="number" name="stock" title="Product Quantity" />
            </div>
            <Input type="file" name="image" title="Product Image (optional)" color="bg-gray-100" />
            <button disabled={loading}
                className={`w-full outline-none bg-emerald-700 disabled:bg-emerald-600 disabled:cursor-not-allowed py-1 rounded text-white border-none cursor-pointer`}
            >Add</button>
        </div>
    )
}
