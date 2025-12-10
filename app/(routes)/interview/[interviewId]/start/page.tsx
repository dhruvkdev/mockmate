"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';

type InterviewData={
    jobTitle:string|null,
    jobDescription:string|null,
    interviewQuestions:interviewQuestions[],
    userId: string|null,
    _id:string
}
type interviewQuestions={
    answer:string,
    question:string
}

function StartInterview() {
    const { interviewId } = useParams();
    const convex = useConvex();
    const [interviewData, setInterviewData] = useState<InterviewData>();
    useEffect(()=>{
        getInterviewQuestions();
    },[interviewId])
    const getInterviewQuestions = async()=>{
        const result = await convex.query(api.Interview.getInterviewQuestions,{
            //@ts-ignore
            interviewRecordId:interviewId
        })
        console.log(result);
        if (result) {
            setInterviewData(result as unknown as InterviewData);
        }
    }
  return (
    <div>
        <h2 className='text-2xl font-semibold text-center mt-2 '>Ready to start your mock interview?</h2>
    </div>
  )
}

export default StartInterview