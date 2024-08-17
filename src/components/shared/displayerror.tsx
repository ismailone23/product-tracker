import React, { Dispatch, SetStateAction } from 'react'

export default function Displayerror({ message, setMessage }: {
    message: {
        error: boolean;
        message: string;
    } | null;
    setMessage: Dispatch<SetStateAction<{
        error: boolean;
        message: string;
    } | null>>
}) {
    return (
        message &&
        <div className="absolute right-10 top-5">
            {(message.error === true ? <p onClick={() => setMessage(null)}
                className='text-center text-sm px-2 py-1 rounded text-white bg-red-400'>{message.message}</p> :
                <p onClick={() => setMessage(null)}
                    className='text-center text-sm px-2 py-1 rounded bg-green-500 text-black'>{message.message}</p>
            )}
        </div>
    )
}
