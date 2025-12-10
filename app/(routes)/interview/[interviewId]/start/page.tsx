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
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions area */}
                <div className='my-5'>
                    <div className='p-5 border rounded-lg my-10 min-h-[50vh] flex flex-col justify-between bg-secondary/20'>
                        <div className='flex flex-wrap gap-2'>
                            {/* Question number indicators */}
                            {interviewData?.interviewQuestions?.map((item, index) => (
                                <h2
                                    key={index}
                                    className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer 
                                ${activeQuestionIndex === index && 'bg-primary text-white'}`}
                                    onClick={() => setActiveQuestionIndex(index)}
                                >
                                    Question #{index + 1}
                                </h2>
                            ))}
                        </div>

                        <div className='mt-5'>
                            {/* Active Question Display */}
                            {interviewData && (
                                <>
                                    <h2 className='text-lg my-5'>{interviewData.interviewQuestions[activeQuestionIndex]?.question}</h2>
                                    <Volume2 className='cursor-pointer' onClick={() => textToSpeech(interviewData.interviewQuestions[activeQuestionIndex]?.question)} />
                                </>
                            )}
                        </div>

                        <div className='bg-blue-100 p-5 border rounded-lg mt-10 border-blue-300'>
                            <h2 className='flex gap-2 items-center text-blue-700'>
                                <Lightbulb />
                                <strong>Note:</strong>
                            </h2>
                            <h2 className='text-sm text-blue-700 mt-2'>Click on Record Answer when you want to answer the question. At the end of the interview we will give you feedback along with the correct answer for each of question and your answer to compare it.</h2>
                        </div>

                    </div>
                </div>

                {/* Video/Audio Recording */}
                <div className='flex flex-col items-center justify-center'>
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

            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}

                {interviewData && activeQuestionIndex != interviewData?.interviewQuestions?.length - 1 &&
                    <Button onClick={() => {
                        saveAnswer();
                        setActiveQuestionIndex(activeQuestionIndex + 1);
                    }}>Next Question</Button>}

                {interviewData && activeQuestionIndex == interviewData?.interviewQuestions?.length - 1 &&
                    <Button onClick={async () => {
                        await saveAnswer();
                        router.replace(`/interview/${interviewId}/feedback`);
                    }}>End Interview</Button>}
            </div>
        </div>
    )
}

export default StartInterview