'use client'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export default function Input({ type, name, title, color, setFileValue }: {
    type: string, name: string, title: string, color?: string, setFileValue?: Dispatch<SetStateAction<string | null>>
}) {
    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0 && setFileValue) {
            return setFileValue(URL.createObjectURL(e.target.files[0]));
        }
        setFileValue && setFileValue(null)
    }

    return (
        <div className="w-full flex flex-col items-start">
            <label htmlFor={name} className="text-sm">{title}</label>
            {(type != 'file' && !setFileValue) ? <input type={type} name={name} id={name}
                className={`outline-none ${color ? color : "border-blue-400 border-2"} w-full rounded-md px-2 py-2 text-sm`} /> :
                <input onChange={handleFile} type={type} name={name} id={name}
                    className={`outline-none ${color ? color : "border-blue-400 border-2"} w-full rounded-md px-2 py-2 text-sm`} />
            }
        </div>
    )
}
