'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import {
    CubeIcon,
    CurrencyDollarIcon,
    DocumentIcon,
    HomeIcon,
    PowerIcon,
    ShoppingBagIcon,
    UsersIcon
} from '@heroicons/react/24/solid';

import { redirect, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const links = [
    { path: '/dashboard', name: "Dashboard", icon: HomeIcon, color: 'blue' },
    { path: '/dashboard/invoices', name: "Invoices", icon: DocumentIcon, color: 'emerald' },
    { path: '/dashboard/stocks', name: "Stocks", icon: CubeIcon, color: 'indigo' },
    { path: '/dashboard/customers', name: "Customers", icon: UsersIcon, color: 'purple' },
    { path: '/dashboard/revenue', name: "Revenue", icon: CurrencyDollarIcon, color: 'emerald' },
    { path: '/dashboard/store', name: "Store", icon: ShoppingBagIcon, color: 'yellow' },
]

export default function Sidebar() {
    const path = usePathname();
    const session = useSession();
    useEffect(() => {
        if (session.status === 'unauthenticated') redirect('/login')
    }, [session])
    return (
        <div className='h-full flex w-full flex-col justify-between'>
            <div className=' flex w-full flex-col'>
                {
                    links.map((link, i) => {
                        const LinkIcon = link.icon
                        return (
                            <Link key={i} href={link.path} className={`gap-1 pl-5 text-md items-center flex 
                        ${path === link.path && "bg-blue-500"} py-2 `}>
                                <LinkIcon
                                    className={`${path === link.path ? "text-white" : `text-${link.color}-500`} w-4 h-4 `} />
                                <span className={`${path === link.path && "text-white"}`}>
                                    {link.name}
                                </span>
                            </Link>
                        )
                    })
                }
            </div>
            <button onClick={() => signOut()} className='flex items-center w-full justify-between px-5 gap-2 py-2 '>
                Logout <PowerIcon className='w-5 h-5 text-red-500' />
            </button>
        </div>
    )
}
