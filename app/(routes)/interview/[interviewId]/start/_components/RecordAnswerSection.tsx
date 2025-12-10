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
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt="Webcam Placeholder" />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                />
            </div>
            <div className='my-10 flex flex-col gap-5 items-center'>
                <Button
                    variant={isRecording ? "destructive" : "outline"}
                    className='w-full'
                    onClick={StartStopRecording}
                >
                    {isRecording ?
                        <h2 className='flex gap-2 items-center'>
                            <StopCircle /> Stop Recording
                        </h2>
                        :
                        <h2 className='flex gap-2 items-center'>
                            <Mic /> Record Answer
                        </h2>
                    }
                </Button>

                {/* Displaying the transcript for feedback */}
                <div className='p-5 border rounded-lg w-full bg-slate-100 dark:bg-slate-800 h-32 overflow-y-scroll'>
                    {userAnswer || <span className='text-gray-400'>Your answer will appear here...</span>}
                </div>

                {/* <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button> */}
            </div>
        </div>
    )
}

export default RecordAnswerSection
