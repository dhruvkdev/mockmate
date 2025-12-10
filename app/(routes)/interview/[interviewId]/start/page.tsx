// "use client"
// import { useParams, useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import { useConvex, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// // import axios from 'axios'; // Not needed anymore
// import RecordAnswerSection from './_components/RecordAnswerSection';
// import { Button } from '@/components/ui/button';
// import { Lightbulb, Volume2 } from 'lucide-react';
// import { toast } from 'sonner';

// type InterviewData = {
//     jobTitle: string | null,
//     jobDescription: string | null,
//     interviewQuestions: interviewQuestions[],
//     userId: string | null,
//     _id: string
// }
// type interviewQuestions = {
//     answer: string,
//     question: string
// }

// function StartInterview() {
//     const { interviewId } = useParams();
//     const router = useRouter();
//     const convex = useConvex();
//     const saveUserAnswer = useMutation(api.Interview.saveUserAnswer);
//     const [interviewData, setInterviewData] = useState<InterviewData>();
//     const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//     const [userAnswer, setUserAnswer] = useState('');

//     useEffect(() => {
//         getInterviewQuestions();
//     }, [interviewId]);

//     const getInterviewQuestions = async () => {
//         const result = await convex.query(api.Interview.getInterviewQuestions, {
//             //@ts-ignore
//             interviewRecordId: interviewId
//         })
//         console.log(result);
//         if (result) {
//             setInterviewData(result as unknown as InterviewData);
//         }
//     }

//     // Text to Speech
//     const textToSpeech = (text: string) => {
//         if ('speechSynthesis' in window) {
//             const speech = new SpeechSynthesisUtterance(text);
//             window.speechSynthesis.speak(speech);
//         } else {
//             alert('Sorry, your browser does not support text to speech');
//         }
//     }

//     const saveAnswer = async () => {
//         if (!interviewData) return;

//         const currentQuestion = interviewData.interviewQuestions[activeQuestionIndex];

//         try {
//             await saveUserAnswer({
//                 // @ts-ignore
//                 interviewId: interviewId,
//                 question: currentQuestion.question,
//                 userAnswer: userAnswer,
//                 createdAt: new Date().toISOString(),
//             });
//             setUserAnswer(''); // Clear answer for next question
//             toast("Answer Saved Successfully");
//         } catch (error) {
//             console.error(error);
//             toast("Error saving answer");
//         }
//     }

//     return (
//         <div>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
//                 {/* Questions area */}
//                 <div className='my-5'>
//                     <div className='p-5 border rounded-lg my-10 min-h-[50vh] flex flex-col justify-between bg-secondary/20'>
//                         <div className='flex flex-wrap gap-2'>
//                             {/* Question number indicators */}
//                             {interviewData?.interviewQuestions?.map((item, index) => (
//                                 <h2
//                                     key={index}
//                                     className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer 
//                                 ${activeQuestionIndex === index && 'bg-primary text-white'}`}
//                                     onClick={() => setActiveQuestionIndex(index)}
//                                 >
//                                     Question #{index + 1}
//                                 </h2>
//                             ))}
//                         </div>

//                         <div className='mt-5'>
//                             {/* Active Question Display */}
//                             {interviewData && (
//                                 <>
//                                     <h2 className='text-lg my-5'>{interviewData.interviewQuestions[activeQuestionIndex]?.question}</h2>
//                                     <Volume2 className='cursor-pointer' onClick={() => textToSpeech(interviewData.interviewQuestions[activeQuestionIndex]?.question)} />
//                                 </>
//                             )}
//                         </div>

//                         <div className='bg-blue-100 p-5 border rounded-lg mt-10 border-blue-300'>
//                             <h2 className='flex gap-2 items-center text-blue-700'>
//                                 <Lightbulb />
//                                 <strong>Note:</strong>
//                             </h2>
//                             <h2 className='text-sm text-blue-700 mt-2'>Click on Record Answer when you want to answer the question. At the end of the interview we will give you feedback along with the correct answer for each of question and your answer to compare it.</h2>
//                         </div>

//                     </div>
//                 </div>

//                 {/* Video/Audio Recording */}
//                 <div className='flex flex-col items-center justify-center'>
//                     {interviewData && (
//                         <RecordAnswerSection
//                             mockInterviewQuestion={interviewData.interviewQuestions}
//                             activeQuestionIndex={activeQuestionIndex}
//                             interviewData={interviewData}
//                             userAnswer={userAnswer}
//                             setUserAnswer={setUserAnswer}
//                         />
//                     )}
//                 </div>
//             </div>

//             <div className='flex justify-end gap-6'>
//                 {activeQuestionIndex > 0 &&
//                     <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}

//                 {interviewData && activeQuestionIndex != interviewData?.interviewQuestions?.length - 1 &&
//                     <Button onClick={() => {
//                         saveAnswer();
//                         setActiveQuestionIndex(activeQuestionIndex + 1);
//                     }}>Next Question</Button>}

//                 {interviewData && activeQuestionIndex == interviewData?.interviewQuestions?.length - 1 &&
//                     <Button onClick={async () => {
//                         await saveAnswer();
//                         router.replace(`/interview/${interviewId}/feedback`);
//                     }}>End Interview</Button>}
//             </div>
//         </div>
//     )
// }

// export default StartInterview
"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { Lightbulb, Volume2, ChevronLeft, ChevronRight, Trophy, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getInterviewQuestions();
    }, [interviewId]);

    // Automatically read question when index changes
    useEffect(() => {
        if (interviewData && interviewData.interviewQuestions[activeQuestionIndex]) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                textToSpeech(interviewData.interviewQuestions[activeQuestionIndex].question);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [activeQuestionIndex, interviewData]);

    const getInterviewQuestions = async () => {
        setIsLoading(true);
        try {
            const result = await convex.query(api.Interview.getInterviewQuestions, {
                //@ts-ignore
                interviewRecordId: interviewId
            })
            if (result) {
                setInterviewData(result as unknown as InterviewData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    // Text to Speech
    const textToSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speaking to avoid overlap
            window.speechSynthesis.cancel();
            
            const speech = new SpeechSynthesisUtterance(text);
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        } else {
            toast.error('Your browser does not support text to speech');
        }
    }

    // Wrapper to speak current question (passed to child)
    const speakCurrentQuestion = () => {
        if (interviewData && interviewData.interviewQuestions[activeQuestionIndex]) {
            textToSpeech(interviewData.interviewQuestions[activeQuestionIndex].question);
        }
    }

    const saveAnswer = async () => {
        if (!interviewData || !userAnswer.trim()) {
            toast.warning("Please record an answer before proceeding");
            return;
        }

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
            toast.success("Answer Saved Successfully");
        } catch (error) {
            console.error(error);
            toast.error("Error saving answer");
        }
    }

    const progress = interviewData ? ((activeQuestionIndex + 1) / interviewData.interviewQuestions.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5 p-4 md:p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            AI Mock Interview
                        </h1>
                        <p className="text-muted-foreground mt-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {interviewData?.jobTitle ? `Applying for: ${interviewData.jobTitle}` : 'Loading interview...'}
                        </p>
                    </div>
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                        <Trophy className="w-4 h-4 mr-2" />
                        Question {activeQuestionIndex + 1} of {interviewData?.interviewQuestions?.length || 0}
                    </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Questions Panel */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            {/* Question Navigation */}
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">QUESTIONS</h3>
                                <div className="flex flex-wrap gap-2">
                                    {interviewData?.interviewQuestions?.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveQuestionIndex(index)}
                                            className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                                                ${activeQuestionIndex === index
                                                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                                                }`}
                                        >
                                            {index + 1}
                                            {index < activeQuestionIndex && (
                                                <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Question */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary p-5 rounded-r-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Badge className="mb-2" variant="secondary">
                                                Question #{activeQuestionIndex + 1}
                                            </Badge>
                                            <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                                                {interviewData?.interviewQuestions[activeQuestionIndex]?.question}
                                            </h2>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => textToSpeech(interviewData?.interviewQuestions[activeQuestionIndex]?.question || '')}
                                            className="hover:bg-primary/10"
                                        >
                                            <Volume2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Tips Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-blue-100 dark:bg-black-900 p-2 rounded-lg">
                                            <Lightbulb className="h-5 w-5 text-black dark:text-black-400" />
                                        </div>
                                        <h3 className="font-semibold text-black dark:text-black-400">Pro Tip</h3>
                                    </div>
                                    <p className="text-sm text-black dark:text-black-400">
                                        Click "Record Answer" when ready. Speak clearly and concisely. You can say <strong>"Repeat the question"</strong> if you need to hear it again.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recording Panel */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg overflow-hidden">
                            <CardContent className="p-0">
                                {interviewData && (
                                    <RecordAnswerSection
                                        mockInterviewQuestion={interviewData.interviewQuestions}
                                        activeQuestionIndex={activeQuestionIndex}
                                        interviewData={interviewData}
                                        userAnswer={userAnswer}
                                        setUserAnswer={setUserAnswer}
                                        readQuestion={speakCurrentQuestion} // Pass the function here
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    <div>
                        {activeQuestionIndex > 0 && (
                            <Button
                                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                                variant="outline"
                                className="gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {interviewData && activeQuestionIndex !== interviewData?.interviewQuestions?.length - 1 ? (
                            <Button
                                onClick={() => {
                                    saveAnswer();
                                    setActiveQuestionIndex(activeQuestionIndex + 1);
                                }}
                                className="gap-2 px-6"
                            >
                                Save & Continue
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={async () => {
                                    await saveAnswer();
                                    router.replace(`/interview/${interviewId}/feedback`);
                                }}
                                className="gap-2 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                            >
                                Complete Interview
                                <Trophy className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartInterview