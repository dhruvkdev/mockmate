import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function EmptyState() {
    return (
        <div className='flex flex-col items-center gap-4 mt-14 border-dashed p-10 border-3 rounded-xl bg-gray-50'>
            <Image src={'/interview.jpg'} alt="interview" height={130} width={130} />
            <h2 className='mt-2 text-lg text-gray-500'>You do not have any Interview created.</h2>
            <Button>+ Create Interview</Button>
        </div>
    )
}

export default EmptyState