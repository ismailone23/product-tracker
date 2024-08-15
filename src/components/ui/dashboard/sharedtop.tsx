'use client'

import { Dispatch, SetStateAction } from "react"

export default function Sharedtop({
    text,
    isOpen,
    setIsOpen
}: {
    text: string,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <div className="flex w-full flex-col ">
            <div className="flex w-full px-5 items-center justify-between py-1">
                <h1 className="xl:text-base lg:text-sm text-xs">All {text}s</h1>
                <button onClick={() => setIsOpen(!isOpen)} className="px-2 py-1 rounded-sm border-none bg-green-600
                lg:text-sm text-xs text-white cursor-pointer" type="button">New {text}</button>
            </div>
            <hr />
        </div>
    )
}
