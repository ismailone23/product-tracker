'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function AuthCheck() {
    const { data: session } = useSession()
    if (!session) return (
        <div className='flex p-2 flex-col gap-2 max-w-[200px]'>
            <p>please login</p>
            <button onClick={() => signIn('github')} className='ouline-none bg-gray-500 text-white rounded px-3 py-1 '>signin with github</button>
            <button onClick={() => signIn('discord')} className='ouline-none bg-purple-500 text-white rounded px-3 py-1 '>signin with discord</button>
        </div >
    )
    return (
        <>
            <p>{session.user.name}</p>
            <button onClick={() => signOut()} className='ouline-none bg-red-500 text-white rounded px-3 py-1 '>signout</button>
        </>
    )
}
