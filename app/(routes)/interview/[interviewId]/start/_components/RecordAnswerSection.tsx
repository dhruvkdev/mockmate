// "use client"
// import React, { useEffect, useState, useRef } from 'react'
// import Image from 'next/image'
// import Webcam from 'react-webcam'
// import { Button } from '@/components/ui/button'
// import { Mic, StopCircle } from 'lucide-react'
// import { toast } from 'sonner'

// interface RecordAnswerSectionProps {
//     mockInterviewQuestion: {
//         question: string;
//         answer: string;
//     }[];
//     activeQuestionIndex: number;
//     interviewData: any;
//     userAnswer: string;
//     setUserAnswer: React.Dispatch<React.SetStateAction<string>>;
//     handleAnswerSave?: () => void;
// }

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, userAnswer, setUserAnswer }: RecordAnswerSectionProps) {
//     const [isRecording, setIsRecording] = useState(false);

//     const recognitionRef = useRef<any>(null);

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             // @ts-ignore
//             const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//             if (SpeechRecognition) {
//                 recognitionRef.current = new SpeechRecognition();
//                 recognitionRef.current.continuous = true;
//                 recognitionRef.current.interimResults = true;
//                 recognitionRef.current.lang = 'en-US';

//                 recognitionRef.current.onresult = (event: any) => {
//                     let finalTranscript = '';
//                     let interimTranscript = '';

//                     for (let i = event.resultIndex; i < event.results.length; ++i) {
//                         if (event.results[i].isFinal) {
//                             finalTranscript += event.results[i][0].transcript;
//                         } else {
//                             interimTranscript += event.results[i][0].transcript;
//                         }
//                     }

//                     if (finalTranscript) {
//                         setUserAnswer(prev => prev + " " + finalTranscript);
//                     }
//                 };

//                 recognitionRef.current.onerror = (event: any) => {
//                     console.error("Speech recognition error", event.error);
//                     if (event.error === 'not-allowed') {
//                         toast.error("Microphone access denied. Please allow microphone access.");
//                         setIsRecording(false);
//                     }
//                 };
//             } else {
//                 // Warning only, don't break
//                 console.warn("Browser does not support partial speech recognition features.");
//             }
//         }
//     }, []);

//     const StartStopRecording = async () => {
//         if (isRecording) {
//             recognitionRef.current?.stop();
//             setIsRecording(false);
//         } else {
//             // Check support again
//             // @ts-ignore
//             const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//             if (!SpeechRecognition) {
//                 toast("Your browser does not support speech recognition. Please use Chrome or Edge.");
//                 return;
//             }

//             recognitionRef.current?.start();
//             setIsRecording(true);
//         }
//     }

//     // Effect to update parent or debug
//     // This useEffect is removed as userAnswer is now a prop and its changes are handled by the parent.
//     // useEffect(() => {
//     //     console.log("Current Answer:", userAnswer);
//     // }, [userAnswer])

//     return (
//         <div className='flex items-center justify-center flex-col'>
//             <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
//                 <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt="Webcam Placeholder" />
//                 <Webcam
//                     mirrored={true}
//                     style={{
//                         height: 300,
//                         width: '100%',
//                         zIndex: 10,
//                     }}
//                 />
//             </div>
//             <div className='my-10 flex flex-col gap-5 items-center'>
//                 <Button
//                     variant={isRecording ? "destructive" : "outline"}
//                     className='w-full'
//                     onClick={StartStopRecording}
//                 >
//                     {isRecording ?
//                         <h2 className='flex gap-2 items-center'>
//                             <StopCircle /> Stop Recording
//                         </h2>
//                         :
//                         <h2 className='flex gap-2 items-center'>
//                             <Mic /> Record Answer
//                         </h2>
//                     }
//                 </Button>

//                 {/* Displaying the transcript for feedback */}
//                 <div className='p-5 border rounded-lg w-full bg-slate-100 dark:bg-slate-800 h-32 overflow-y-scroll'>
//                     {userAnswer || <span className='text-gray-400'>Your answer will appear here...</span>}
//                 </div>

//                 {/* <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button> */}
//             </div>
//         </div>
//     )
// }

// export default RecordAnswerSection


"use client"
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Mic, StopCircle, Video, MicOff, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    const [isWebcamActive, setIsWebcamActive] = useState(true);
    const [wordCount, setWordCount] = useState(0);

    const recognitionRef = useRef<any>(null);
    useEffect(() => {
    setWordCount(userAnswer.trim().split(/\s+/).filter(Boolean).length);
}, [userAnswer]);

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
                       setUserAnswer(prev => {
                        const newAnswer = prev + " " + finalTranscript;
                        return newAnswer;
                    });

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
                console.warn("Browser does not support speech recognition features.");
            }
        }
    }, []);

    useEffect(() => {
        setWordCount(userAnswer.trim().split(/\s+/).length);
    }, [userAnswer]);

    const StartStopRecording = async () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            toast.info("Recording stopped");
        } else {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                toast.error("Your browser does not support speech recognition. Please use Chrome or Edge.");
                return;
            }

            try {
                recognitionRef.current?.start();
                setIsRecording(true);
                toast.success("Recording started... Speak now!");
            } catch (error) {
                toast.error("Failed to start recording");
            }
        }
    }

    const toggleWebcam = () => {
        setIsWebcamActive(!isWebcamActive);
    }

    return (
        <div className="w-full space-y-6">
            {/* Video Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10" />
                
                {isWebcamActive ? (
                    <Webcam
                        mirrored={true}
                        style={{
                            height: 320,
                            width: '100%',
                            objectFit: 'cover',
                        }}
                        className="w-full"
                    />
                ) : (
                    <div className="h-80 flex items-center justify-center">
                        <div className="text-center">
                            <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-400">Camera is off</p>
                        </div>
                    </div>
                )}
                
                <div className="absolute bottom-4 left-4 z-20">
                    <Badge variant={isWebcamActive ? "default" : "secondary"} className="gap-2">
                        <Video className="h-3 w-3" />
                        {isWebcamActive ? 'LIVE' : 'OFF'}
                    </Badge>
                </div>
                
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleWebcam}
                    className="absolute bottom-4 right-4 z-20 bg-background/50 backdrop-blur-sm border-white/20"
                >
                    <Video className="h-4 w-4" />
                </Button>
            </div>

            {/* Recording Controls */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Voice Recording</h3>
                            <div className="flex items-center gap-3">
                                <Badge variant={isRecording ? "destructive" : "outline"} className="gap-2">
                                    <div className={`h-2 w-2 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-gray-400'}`} />
                                    {isRecording ? 'RECORDING' : 'READY'}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                    {wordCount} words
                                </Badge>
                            </div>
                        </div>

                        <Button
                            variant={isRecording ? "destructive" : "default"}
                            size="lg"
                            onClick={StartStopRecording}
                            className="w-full h-14 text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                        >
                            {isRecording ? (
                                <>
                                    <StopCircle className="h-5 w-5 mr-2" />
                                    Stop Recording
                                </>
                            ) : (
                                <>
                                    <Mic className="h-5 w-5 mr-2" />
                                    Start Recording Answer
                                </>
                            )}
                        </Button>

                        {!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window) && (
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        Your browser has limited speech recognition support. For best results, use Chrome or Edge.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Transcript Display */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Your Answer</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setUserAnswer('')}
                                className="h-8 text-xs"
                                disabled={!userAnswer}
                            >
                                Clear
                            </Button>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border rounded-xl p-5 min-h-[160px] max-h-[200px] overflow-y-auto shadow-inner">
                                {userAnswer ? (
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {userAnswer}
                                    </p>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <MicOff className="h-8 w-8 mb-3 opacity-50" />
                                        <p className="text-center">Your transcribed answer will appear here as you speak...</p>
                                        <p className="text-sm text-gray-500 mt-2">Click "Start Recording Answer" above</p>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                                Real-time transcription
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RecordAnswerSection



