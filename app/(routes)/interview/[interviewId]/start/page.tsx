"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
// import axios from 'axios'; // Not needed anymore
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { Lightbulb, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

type InterviewData = {
    jobTitle: string | null,
    jobDescription: string | null,
    interviewQuestions: interviewQuestions[],
    userId: string | null,
    _id: string
}
type interviewQuestions = {
    answer: string,
    question: string
}

function StartInterview() {
    const { interviewId } = useParams();
    const router = useRouter();
    const convex = useConvex();
    const saveUserAnswer = useMutation(api.Interview.saveUserAnswer);
    const [interviewData, setInterviewData] = useState<InterviewData>();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {
        getInterviewQuestions();
    }, [interviewId]);

    const getInterviewQuestions = async () => {
        const result = await convex.query(api.Interview.getInterviewQuestions, {
            //@ts-ignore
            interviewRecordId: interviewId
        })
        console.log(result);
        if (result) {
            setInterviewData(result as unknown as InterviewData);
        }
    }

    // Text to Speech
    const textToSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Sorry, your browser does not support text to speech');
        }
    }

    const saveAnswer = async () => {
        if (!interviewData) return;

        const currentQuestion = interviewData.interviewQuestions[activeQuestionIndex];

        try {
            await saveUserAnswer({
                // @ts-ignore
                interviewId: interviewId,
                question: currentQuestion.question,
                userAnswer: userAnswer,
                createdAt: new Date().toISOString(),
            });
            setUserAnswer(''); // Clear answer for next question
            toast("Answer Saved Successfully");
        } catch (error) {
            console.error(error);
            toast("Error saving answer");
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 py-10 px-4 md:px-10'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        {interviewData?.jobTitle || 'Mock Interview'}
                    </h1>
                    <p className='text-gray-600'>
                        Question {activeQuestionIndex + 1} of {interviewData?.interviewQuestions?.length || 0}
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left Side - Question Panel */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Question Navigation */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                            <h3 className='text-sm font-semibold text-gray-700 mb-4'>Questions</h3>
                            <div className='flex flex-wrap gap-2'>
                                {interviewData?.interviewQuestions?.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeQuestionIndex === index
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        onClick={() => setActiveQuestionIndex(index)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Current Question */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
                            {interviewData && (
                                <div className='space-y-4'>
                                    <div className='flex items-start justify-between gap-4'>
                                        <h2 className='text-2xl font-semibold text-gray-900 flex-1'>
                                            {interviewData.interviewQuestions[activeQuestionIndex]?.question}
                                        </h2>
                                        <button
                                            onClick={() => textToSpeech(interviewData.interviewQuestions[activeQuestionIndex]?.question)}
                                            className='flex-shrink-0 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
                                            title="Read question aloud"
                                        >
                                            <Volume2 className='w-5 h-5' />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Note */}
                        <div className='bg-blue-50 border border-blue-200 rounded-xl p-5'>
                            <div className='flex gap-3'>
                                <Lightbulb className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                                <div>
                                    <h3 className='font-semibold text-blue-900 mb-1'>Tip</h3>
                                    <p className='text-sm text-blue-800'>
                                        Click "Record Answer" to start answering. At the end, you'll receive detailed feedback with correct answers for comparison.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className='flex justify-between items-center pt-4'>
                            <Button
                                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                                disabled={activeQuestionIndex === 0}
                                variant="outline"
                                className='disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                ← Previous
                            </Button>

                            <div className='flex gap-3'>
                                {interviewData && activeQuestionIndex !== interviewData?.interviewQuestions?.length - 1 && (
                                    <Button onClick={() => {
                                        saveAnswer();
                                        setActiveQuestionIndex(activeQuestionIndex + 1);
                                    }}>
                                        Next Question →
                                    </Button>
                                )}

                                {interviewData && activeQuestionIndex === interviewData?.interviewQuestions?.length - 1 && (
                                    <Button
                                        onClick={async () => {
                                            await saveAnswer();
                                            router.replace(`/interview/${interviewId}/feedback`);
                                        }}
                                        className='bg-green-600 hover:bg-green-700'
                                    >
                                        End Interview
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Recording Panel */}
                    <div className='lg:col-span-1'>
                        <div className='sticky top-6'>
                            {interviewData && (
                                <RecordAnswerSection
                                    mockInterviewQuestion={interviewData.interviewQuestions}
                                    activeQuestionIndex={activeQuestionIndex}
                                    interviewData={interviewData}
                                    userAnswer={userAnswer}
                                    setUserAnswer={setUserAnswer}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartInterview