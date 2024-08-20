'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";

import React, { useEffect } from 'react'

export default function Page() {
    const { push } = useRouter();
    const session = useSession();

    useEffect(() => {
        if (session.status === 'authenticated') push('/dashboard');
    }, [session, push])
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='p-4 max-w-[350px] w-full shadow-sm flex flex-col gap-2'>
                <h1 className='capitalize text-sm text-center'>
                    signin options
                </h1>
                <div className='flex w-full gap-2 flex-col'>
                    <button className='w-full flex items-center justify-center gap-1 rounded-sm text-md py-1 border border-gray-200 text-black'
                        onClick={() => signIn("google")}><FcGoogle className='w-5' /> Sign in with Google</button>
                </div>
            </div>
        </div>
    )
}
