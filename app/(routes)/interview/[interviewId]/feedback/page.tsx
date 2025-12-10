"use client"
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import FeedbackChart from '@/components/feedback-chart';
import FeedbackCard from '@/components/feedback-card';

function Feedback() {
    const { interviewId } = useParams();
    const convex = useConvex();
    const router = useRouter();
    const [feedbackList, setFeedbackList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GetFeedback();
    }, [interviewId])

    const GetFeedback = async () => {
        const result = await convex.query(api.Interview.getUserInterviewAnswers, {
            // @ts-ignore
            interviewId: interviewId
        });
        console.log(result);
        setFeedbackList(result);
    }

    const onGenerateFeedback = async () => {
        setLoading(true);
        try {
            // 1. Call API to get feedback from n8n
            const result = await axios.post('/api/generate-feedback', {
                interviewId: interviewId,
                userAnswers: feedbackList
            });

            console.log("API Result:", result.data);
            const feedbackData = result.data.data; // Access the 'data' array from n8n response

            // 2. Update DB with feedback
            // Assuming feedbackData is ordered same as feedbackList
            if (feedbackData && feedbackData.length === feedbackList.length) {
                // Using Promise.all to update all records
                await Promise.all(feedbackList.map(async (item, index) => {
                    await updateFeedback({
                        userAnswerId: item._id,
                        feedback: feedbackData[index].feedback,
                        rating: feedbackData[index].rating,
                        correctAnswer: feedbackData[index].correctAnswer
                    })
                }));

                toast.success("Feedback Generated Successfully!");
                GetFeedback(); // Refresh data
            } else {
                toast.error("Error: Feedback count mismatch or invalid response");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate feedback");
        } finally {
            setLoading(false);
        }
    }

    const updateFeedback = useMutation(api.Interview.updateUserAnswerFeedback);

    // Manual trigger for feedback generation (if not auto-generated)
    // Note: The prompt implies using n8n to GET feedback. 
    // If the data isn't in DB, we might want a button to "Generate Feedback"

    return (
        <div className='p-10'>
            <div className='flex justify-between items-center'>
                <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>
                {!feedbackList?.[0]?.feedback &&
                    <Button onClick={onGenerateFeedback} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate New Feedback'}
                    </Button>
                }
            </div>
            <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>

            {/* Overall Rating Calculation (Optional) */}
            {feedbackList?.[0]?.rating &&
                <div className='w-full'>
                    <h2 className='text-primary text-lg my-3'>
                        Your overall interview rating: <strong>
                            {(feedbackList.reduce((acc, item) => acc + (Number(item.rating) || 0), 0) / feedbackList.length).toFixed(1)}
                            /10</strong>
                    </h2>

                    <FeedbackChart feedbackList={feedbackList} />
                </div>
            }

            <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>

            <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {feedbackList?.length === 0 ?
                    <h2 className='font-bold text-xl text-gray-500 col-span-full'>No Feedback record found</h2>
                    :
                    <>
                        {feedbackList.map((item, index) => (
                            <FeedbackCard key={index} item={item} index={index} />
                        ))}
                    </>}
            </div>

            <Button onClick={() => router.replace('/')} className='mt-10'>Go Home</Button>

        </div>
    )
}

export default Feedback
