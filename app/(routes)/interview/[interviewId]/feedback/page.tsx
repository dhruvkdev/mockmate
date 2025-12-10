"use client"
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

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
                <h2 className='text-primary text-lg my-3'>
                    Your overall interview rating: <strong>
                        {(feedbackList.reduce((acc, item) => acc + (Number(item.rating) || 0), 0) / feedbackList.length).toFixed(1)}
                        /10</strong>
                </h2>
            }

            <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>

            <div className='mt-5'>
                {feedbackList?.length === 0 ?
                    <h2 className='font-bold text-xl text-gray-500'>No Feedback record found</h2>
                    :
                    <>
                        {feedbackList.map((item, index) => (
                            <Collapsible key={index} className='mt-7'>
                                <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
                                    {item.question} <ChevronsUpDown className='h-5 w-5' />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className='flex flex-col gap-2'>
                                        <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
                                        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAnswer}</h2>
                                        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAnswer}</h2>
                                        <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </>}
            </div>

            <Button onClick={() => router.replace('/')} className='mt-10'>Go Home</Button>

        </div>
    )
}

export default Feedback
