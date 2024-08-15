import React from 'react'
import Skeleton from "react-loading-skeleton";

export default function Displayskeleton() {
    return (
        <div className="flex w-full gap-2">
            <Skeleton count={1} width={120} height={120} />
            <div className="flex flex-col gap-1">
                <Skeleton count={1} width={300} height={10} />
                <Skeleton count={1} width={100} height={10} />
                <Skeleton count={1} width={100} height={10} />
            </div>
        </div>
    )
}
