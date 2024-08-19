'use client'
import Displayerror from '@/components/shared/displayerror';
import DisplayUser from '@/components/ui/user/displayuser';
import EditUser from '@/components/ui/user/edituser';
import { api } from '@/trpc/shared'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton';

export default function Page() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState<{ error: boolean, message: string } | null>(null)
    const [id, setId] = useState('')
    const getUserapi = api.user.getUser.useQuery({});
    const session = useSession().data?.user.email;
    const checkOwnerapi = api.user.getUser.useQuery({ email: session as string })
    const updateUserapi = api.user.updateUser.useMutation({
        onSuccess: () => {
            setIsOpen(false)
            setMessage({ error: false, message: "done" })
            getUserapi.refetch()
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
        }
    });
    const deleteUserapi = api.user.deleteUser.useMutation({
        onSuccess: () => {
            setMessage({ error: false, message: "done" })
            getUserapi.refetch()
        },
        onError: ({ message }) => {
            setMessage({ error: true, message })
        }
    });

    const handleupdateuserfunc = (val: "ADMIN" | "OWNER" | "MEMBER" | string) => {
        if (val === 'role') return setMessage({ error: true, message: "select role correctly" })
        updateUserapi.mutate({ id, role: val })
    }
    const handledeleteeuser = (id: string) => {
        deleteUserapi.mutate({ id })
    }
    if ((checkOwnerapi.isFetched && checkOwnerapi.data) && checkOwnerapi.data[0].role !== "OWNER") return (<p>you are not allowed to come here</p>)
    return (
        <>
            <div className='flex flex-col w-full gap-1 px-4'>
                <div className='w-full grid grid-cols-7 py-1 items-center border-b border-gray-200'>
                    <h1>sl.no</h1>
                    <h1>Name</h1>
                    <h1 className='col-span-3'>Email</h1>
                    <h1>Role</h1>
                    <h1>Action</h1>
                </div>
                {
                    (getUserapi.isFetched && getUserapi.data) ? getUserapi.data.map((user, i) =>
                        <DisplayUser handledeleteeuser={handledeleteeuser} setIsOpen={setIsOpen} setId={setId} i={i} user={user} key={i} />
                    )
                        :
                        <Skeleton count={2} width={300} height={10} />
                }
            </div>
            {
                isOpen && <EditUser handleupdateuserfunc={handleupdateuserfunc} setIsOpen={setIsOpen} />
            }
            <Displayerror message={message} setMessage={setMessage} />
        </>
    )
}
