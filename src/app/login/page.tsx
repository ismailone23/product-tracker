'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function page() {
    const { push } = useRouter();
    const session = useSession();

    useEffect(() => {
        if (session.status === 'authenticated') push('/dashboard');
    }, [session])
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='p-2 max-w-[300px] w-full border flex flex-col gap-2'>
                <h1 className='capitalize text-center'>
                    signin options
                </h1>
                <div className='flex w-full gap-2 flex-col'>
                    <button className='w-full rounded text-md py-1 text-white bg-neutral-800'
                        onClick={() => signIn("github")}>Sign in with Github</button>
                    <button className='w-full rounded text-md py-1 bg-indigo-500 text-white'
                        onClick={() => signIn("discord")}>Sign in with Discord</button>
                </div>
            </div>
        </div>
    )
}
