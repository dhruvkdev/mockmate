"use client"
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'

interface RecordAnswerSectionProps {
    mockInterviewQuestion: {
        question: string;
        answer: string;
    }[];
    activeQuestionIndex: number;
    interviewData: any;
    userAnswer: string;
    setUserAnswer: React.Dispatch<React.SetStateAction<string>>;
    handleAnswerSave?: () => void;
}

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, userAnswer, setUserAnswer }: RecordAnswerSectionProps) {
    const [isRecording, setIsRecording] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        setUserAnswer(prev => prev + " " + finalTranscript);
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    if (event.error === 'not-allowed') {
                        toast.error("Microphone access denied. Please allow microphone access.");
                        setIsRecording(false);
                    }
                };
            } else {
                // Warning only, don't break
                console.warn("Browser does not support partial speech recognition features.");
            }
        }
    }, []);

    const StartStopRecording = async () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            // Check support again
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                toast("Your browser does not support speech recognition. Please use Chrome or Edge.");
                return;
            }

            recognitionRef.current?.start();
            setIsRecording(true);
        }
    }

    // Effect to update parent or debug
    // This useEffect is removed as userAnswer is now a prop and its changes are handled by the parent.
    // useEffect(() => {
    //     console.log("Current Answer:", userAnswer);
    // }, [userAnswer])

    return (
        <div className='w-full'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                {/* Webcam Section */}
                <div className='relative bg-gray-900 aspect-video flex items-center justify-center'>
                    <Image
                        src={'/webcam.png'}
                        width={120}
                        height={120}
                        className='absolute z-0 opacity-20'
                        alt="Webcam Placeholder"
                    />
                    <Webcam
                        mirrored={true}
                        className='relative z-10 w-full h-full object-cover'
                    />
                    {isRecording && (
                        <div className='absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 animate-pulse'>
                            <div className='w-2 h-2 bg-white rounded-full'></div>
                            Recording
                        </div>
                    )}
                </div>

                {/* Controls Section */}
                <div className='p-6 space-y-4'>
                    {/* Record Button */}
                    <Button
                        variant={isRecording ? "destructive" : "default"}
                        className={`w-full h-12 font-semibold ${!isRecording && 'bg-gray-900 hover:bg-black'}`}
                        onClick={StartStopRecording}
                    >
                        {isRecording ? (
                            <>
                                <StopCircle className='w-5 h-5 mr-2' />
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <Mic className='w-5 h-5 mr-2' />
                                Record Answer
                            </>
                        )}
                    </Button>

                    {/* Transcript Display */}
                    <div className='space-y-2'>
                        <label className='text-sm font-semibold text-gray-700'>Your Answer</label>
                        <div className='relative'>
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder='Your answer will appear here as you speak...'
                                className='w-full h-40 p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                            />
                            {userAnswer && (
                                <div className='absolute bottom-3 right-3 text-xs text-gray-400'>
                                    {userAnswer.split(' ').filter(w => w).length} words
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Helper Text */}
                    <p className='text-xs text-gray-500 flex items-center gap-1'>
                        <Mic className='w-3 h-3' />
                        Click record and start speaking. Your answer will be transcribed automatically.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RecordAnswerSection
