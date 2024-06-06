'use client'
import React, { Dispatch, SetStateAction } from 'react'

export default function Input({ type, name, title, color }: {
    type: string, name: string, title: string, color?: string,
}) {
    return (
        <div className="w-full flex flex-col items-start">
            <label htmlFor={name} className="text-sm">{title}</label>
            <input type={type} name={name} id={name}
                className={`outline-none ${color ? color : "border-blue-400 border-2"} w-full rounded-md px-2 py-2 text-sm`} />
        </div>
    )
}
