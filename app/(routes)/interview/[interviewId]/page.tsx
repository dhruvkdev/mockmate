"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useParams } from 'next/navigation'
import Link from 'next/link'

function Interview() {
    const { interviewId } = useParams();
  return (
   <div>
     <div className='flex flex-col items-center justify-center mt-10'>
        <div className='max-w-3xl w-full'>
            <Image src="/start-interview.png" alt="Interview" width={500} height={380} className='w-full h-[380px] object-cover'/>
            <div className='p-4 flex flex-col items-center justify-center'>
                <h2 className='text-3xl font-bold text-center mt-10'>Ready to start your mock interview?</h2>
                <p className='text-gray-500 text-center mt-3'>The Interview will last for about 30 minutes. Are you ready to start?</p>
                <Link href={`/interview/${interviewId}/start`}>
                    <Button className='mt-5'>Start Interview <ArrowRight /></Button>
                </Link>
                <hr />
                <div className='mt-10 bg-gray-50 p-4 rounded-lg' >
                    <h2 className='text-2xl font-semibold text-center mt-2 '>Want to send the interview link to some friend?</h2>
                    <div className='flex items-center gap-2 mt-5 w-full max-w-xl ' >
                        <Input placeholder='Enter Email address' className='w-full max-w-xl'></Input>                        
                        <Button><Send /></Button>                           
                    </div>
                </div>
            </div>
        </div>
    </div>  
   </div>
    
  )
}

export default Interview