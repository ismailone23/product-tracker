'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navbar() {
    const path = usePathname()
    const session = useSession();
    return (
        <div className='grid grid-cols-6 w-full h-12 items-center border-b'>
            <div className='col-span-1 border-r h-full justify-center items-center flex'>
                <Link style={{ fontFamily: "Zen Tokyo Zoo, system-ui" }} href={'/dashboard'}
                    className='zen-tokyo-zoo text-3xl font-thin text-blue-500'>
                    ZenMode
                </Link>
            </div>
            <div className='col-span-5 flex justify-between w-full px-2'>
                <h1 >
                    <Link href={'/dashboard'} className={`${path.split('/').length > 2 && "text-gray-400"}`}>Dashboard</Link>
                    <span> / </span>
                    {
                        path.split('/').length > 1 &&
                        <span className='capitalize text-gray-600'>{path.split('/')[2]}</span>
                    }
                </h1>
                <div className='pr-3'>
                    {
                        session.status === 'authenticated' &&
                        <h1>{session.data.user.name}</h1>
                    }
                </div>
            </div>
        </div>
    )
}
