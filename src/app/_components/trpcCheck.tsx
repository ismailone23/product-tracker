'use client'

import { api } from '@/trpc/shared'
import React from 'react'

export default function TrpcCheck() {
    const hello = api.hello.useQuery().data
    console.log(hello);

    return (
        <div>TrpcCheck</div>
    )
}
