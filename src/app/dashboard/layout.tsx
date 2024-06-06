import Navbar from '@/components/shared/navbar'
import Sidebar from '@/components/shared/sidebar'
import React, { ReactNode } from 'react'

export default function page({ children }: { children: ReactNode }) {
    return (
        <div className='flex justify-center overflow-hidden h-screen items-center w-full'>
            <div className='flex flex-col h-full w-full'>
                <div><Navbar /></div>
                <div className='w-full h-full grid grid-cols-6'>
                    <div className='col-span-1 h-full overflow-y-auto border-r'><Sidebar /></div>
                    <div className='w-full col-span-5'>{children}</div>
                </div>
            </div>
        </div>
    )
}
