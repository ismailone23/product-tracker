import Image from 'next/image'

export default function Imaged({ src }: { src: string }) {
    return (
        <Image priority
            src={src}
            className='w-full h-full object-contain rounded'
            alt="product image"
            width="0"
            height="0"
            sizes="100vw" />
    )
}
