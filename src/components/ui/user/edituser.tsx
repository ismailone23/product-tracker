import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react'

export default function EditUser({ setIsOpen, handleupdateuserfunc }: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleupdateuserfunc: (val: string) => void;
}) {
    const [selectValue, setSelectValue] = useState<string>('role')
    return (
        <div className='w-full h-full flex items-center justify-center absolute left-0 top-0 bg-black bg-opacity-20'>
            <div className='max-w-screen-sm w-full min-h-40 p-2 rounded bg-white justify-center gap-2 flex flex-col relative'>
                <button className='absolute right-4 top-2' onClick={() => setIsOpen(false)}><XMarkIcon className='w-4' /></button>
                <select onChange={e => setSelectValue(e.target.value)} name="role" className='outline-none border border-gray-100 p-1 rounded cursor-pointer' id="role">
                    <option value="role">Select Role</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OWNER">OWNER</option>
                    <option value="MEMBER">MEMBER</option>
                </select>
                <button className='w-full rounded cursor-pointer py-1 bg-gray-400' onClick={() => handleupdateuserfunc(selectValue)}>Update</button>
            </div>
        </div>
    )
}
