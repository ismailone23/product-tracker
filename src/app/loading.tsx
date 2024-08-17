import React from 'react'

export default function loading() {
    return (
        <div className='text-gray-300 w-10 h-10 rounded-full flex items-center justify-center'>
            <div className='text-indigo-500 w-9 h-9 rounded-full flex items-center justify-center'>
                <div className='text-emerald-500 w-8 h-8 rounded-full'>
                    <div className='text-purple-500 w-7 h-7'>
                        <div className='text-teal-500 w-6 h-6'>
                            loading...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
