import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const MenuOptions = [
    {
        name: 'Dashboard',
        path: '/dashboard'
    },
    {
        name: 'Upgrade',
        path: '/upgrade'
    },
    {
        name: 'How it works?',
        path: '/how-it-works'
    },
]

function AppHeader() {
    return (
        <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
           <Link href={"/dashboard"}>
            <div className="flex items-center gap-2">
                
                <Image src={'/logo.svg'} alt="logo" width={40} height={40} />
                <h1 className="text-base font-bold md:text-2xl">MockMate AI</h1>
                
            </div>
            </Link>
            <div>
                <ul className='text-lg flex justify-around gap-7 '>
                    {MenuOptions.map((option, index) => (
                        <Link key={index} href={option.path}>
                            <li className="transition-transform hover:scale-105 cursor-pointer">{option.name}</li>
                        </Link>
                    ))}
                </ul>
            </div>
            <UserButton />
        </nav>

    )
}

export default AppHeader