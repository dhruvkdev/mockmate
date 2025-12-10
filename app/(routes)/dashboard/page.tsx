"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import React, { useContext, useEffect, useState } from 'react'
import EmptyState from './EmptyState';
import CreateInterviewDialog from '../_components/CreateInterviewDialog';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailcontext } from '@/context/UserDetailContext';
import InterviewCard from './_components/InterviewCard';

function Dashboard() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState<any[]>([]);
    const convex = useConvex();
    const { userDetail } = useContext(UserDetailcontext);

    useEffect(() => {
        if (userDetail?._id) {
            getInterviews();
        }
    }, [userDetail]);

    const getInterviews = async () => {
        try {
            const result = await convex.query(api.Interview.getUserInterviews, {
                userId: userDetail._id
            });
            setInterviewList(result);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        }
    };

    return (
        <div className='py-20 px-10 md:px-28 lg:px-44 xl:px-56'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-lg text-gray-500'>My Dashboard</h2>
                    <h2 className='text-3xl font-bold'>Welcome, {user?.fullName}</h2>
                </div>
                <CreateInterviewDialog />
            </div>

            {interviewList?.length === 0 ? (
                <EmptyState />
            ) : (
                <div>
                    <h3 className='text-xl font-semibold mb-4'>Previous Interviews</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {interviewList.map((interview) => (
                            <InterviewCard key={interview._id} interview={interview} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard