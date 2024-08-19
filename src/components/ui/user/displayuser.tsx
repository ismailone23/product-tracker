import { UserTableType } from '@/lib/schema'
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/solid';
import React from 'react'

export default function DisplayUser({
    user,
    i,
    setId,
    setIsOpen,
    handledeleteeuser
}: {
    i: number;
    user: UserTableType;
    setId: React.Dispatch<React.SetStateAction<string>>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handledeleteeuser: (id: string) => void
}) {
    return (
        <div className='w-full grid grid-cols-7'>
            <h1>{i + 1}</h1>
            <h1>{user.name}</h1>
            <h1 className='col-span-3'>{user.email}</h1>
            <h1 className='text-sm'>{user.role}</h1>
            <div className='flex gap-2'>
                <button disabled={user.role === "OWNER"} onClick={() => { setIsOpen(true); setId(user.id) }}><PencilSquareIcon className={` w-4 ${user.role === "OWNER" ? " cursor-not-allowed" : " cursor-pointer "} outline-none`} /></button>
                <button disabled={user.role === "OWNER"} onClick={() => handledeleteeuser(user.id)}><TrashIcon className={`w-4 ${user.role === "OWNER" ? " text-red-200 cursor-not-allowed" : " text-red-500 cursor-pointer "} outline-none`} /></button>
            </div>
        </div>
    )
}
