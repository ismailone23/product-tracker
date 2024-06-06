'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';


export default function page() {
    const session = useSession();
    if (session.status === 'unauthenticated') redirect('/login')
    return redirect("/dashboard")
}
