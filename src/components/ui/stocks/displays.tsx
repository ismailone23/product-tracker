'use client'
import { api } from '@/trpc/shared';
import { ProductTableType } from '@/types';
import { Dispatch, SetStateAction } from 'react'
import Pagination from '../dashboard/pagination';
import Mapstock from './mapstock';

export default function Displays({
    loading,
    isUpdateOpen,
    setIsUpdateOpen,
    handleDel,
    products,
    searchText,
    setId
}: {
    loading: boolean,
    isUpdateOpen: boolean
    setIsUpdateOpen: Dispatch<SetStateAction<boolean>>,
    products: ProductTableType[],
    handleDel: (id: string) => void,
    searchText: string,
    setId: Dispatch<SetStateAction<string>>
}) {
    const totalPages = api.product.fetchProductPages.useQuery(6, { refetchOnMount: false })
    return (
        <div className="flex w-full flex-col py-2 lg:gap-2 gap-1 overflow-y-auto mb-12">
            {products && products
                .filter(data => data.product_name.toLowerCase().includes(searchText.toLowerCase()))
                .map((stock, i) =>
                    <Mapstock
                        handleDel={handleDel}
                        isUpdateOpen={isUpdateOpen}
                        setId={setId}
                        setIsUpdateOpen={setIsUpdateOpen}
                        stock={stock}
                        loading={loading}
                        key={i}
                    />
                )}
            <div className='w-full flex justify-center'>
                {
                    (totalPages.isFetched &&
                        totalPages.data) && <Pagination totalPages={totalPages.data} />
                }
            </div>
        </div>
    )
}
