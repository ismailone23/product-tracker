'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import {
    CubeIcon,
    CurrencyDollarIcon,
    DocumentIcon,
    HomeIcon,
    PowerIcon,
    UserIcon,
    UsersIcon
} from '@heroicons/react/24/solid';

import { redirect, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const links = [
    { path: '/dashboard', name: "Dashboard", icon: HomeIcon, color: 'blue' },
    { path: '/dashboard/invoices', name: "Invoices", icon: DocumentIcon, color: 'emerald' },
    { path: '/dashboard/stocks', name: "Stocks", icon: CubeIcon, color: 'indigo' },
    { path: '/dashboard/customers', name: "Customers", icon: UsersIcon, color: 'purple' },
    { path: '/dashboard/users', name: "User", icon: UserIcon, color: 'teal' },
]

export default function Sidebar() {
    const path = usePathname();
    const session = useSession();
    useEffect(() => {
        if (session.status === 'unauthenticated') redirect('/login')
    }, [session])
    return (
        <>
            <div className='flex h-auto w-full flex-col justify-between'>
                <div className='justify-between flex w-full flex-col'>
                    {
                        links.map((link, i) => {
                            const LinkIcon = link.icon
                            return (
                                <Link key={i} href={link.path} className={`gap-1 lg:pl-5 md:pl-3 pl-2 items-center flex 
                        ${path === link.path && "bg-blue-500"} lg:py-2 py-1`}>
                                    <LinkIcon className={`${path === link.path ? "text-white" : `text-${link.color}-500`}  lg:w-4 w-3`} />
                                    <span className={`${path === link.path && "text-white"} lg:font-normal font-light xl:text-base lg:text-sm text-xs`}>
                                        {link.name}
                                    </span>
                                </Link>
                            )
                        })
                    }
                </div>
                <button onClick={() => signOut()} className='flex items-center w-full justify-between px-5 py-2 '>
                    <span className='text-sm lg:text-lg'>Logout</span><PowerIcon className='lg:w-5 w-4 text-red-500' />
                </button>
            </div>
            <div className='flex absolute py-1 px-1 left-1 bottom-2'>
                <p className='text-sm'>Developed by <a about='_ismail' href="mailto:ismailhsan45@gmail.com">Ismail Hossain</a></p>
            </div>
        </>
    )
}
