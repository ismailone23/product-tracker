'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Page() {
    const { push } = useRouter();
    const session = useSession();

    useEffect(() => {
        if (session.status === 'authenticated') push('/dashboard');
    }, [session, push])
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='p-2 max-w-[300px] w-full drop-shadow border border-gray-100 flex flex-col gap-2'>
                <h1 className='capitalize text-sm text-center'>
                    signin options
                </h1>
                <div className='flex w-full gap-2 flex-col'>
                    <button className='w-full rounded text-md py-1 border border-gray-100 text-black'
                        onClick={() => signIn("google")}>Sign in with Google</button>
                </div>
            </div>
        </div>
    )
}
