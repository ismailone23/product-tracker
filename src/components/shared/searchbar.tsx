import { Dispatch, SetStateAction } from 'react'
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function Searchbar({ searchText, text, setSearchText }: { text: string, searchText: string, setSearchText: Dispatch<SetStateAction<string>> }) {
    return (
        <div className="w-full relative px-4">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-6 text-gray-500 top-2" />
            <input placeholder={`search ${text}`} className="outline-none border text-gray-500 text-sm font-light border-gray-200 rounded px-7 py-1 w-full"
                type="text" value={searchText}
                onChange={e => setSearchText(e.currentTarget.value)} />
        </div>
    )
}
