'use client'

import CreatStock from "@/components/ui/stocks/create-stock"

export default function page() {
    return (
        <div className="w-full h-full overflow-y-auto flex p-2 items-center flex-col">
            <div className="w-full max-w-[500px] flex flex-col items-center gap-2">
                <h1 className="text-center">Add new product to stocks</h1>
                <CreatStock />
            </div>
        </div>
    )
}