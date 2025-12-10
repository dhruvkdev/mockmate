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

// export default "use client"
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
    readQuestion?: () => void;
}

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, userAnswer, setUserAnswer, readQuestion }: RecordAnswerSectionProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isWebcamActive, setIsWebcamActive] = useState(true);
    const [wordCount, setWordCount] = useState(0);

    const recognitionRef = useRef<any>(null);
    
    // 1. FIX: Use a ref to store the latest readQuestion function
    // This prevents the main useEffect from needing it as a dependency, stopping re-renders/crashes
    const readQuestionRef = useRef(readQuestion);

    // Update the ref whenever the prop changes
    useEffect(() => {
        readQuestionRef.current = readQuestion;
    }, [readQuestion]);

    const COMMAND_PHRASES = ["repeat", "can you repeat", "say again", "pardon", "what was the question"];

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
                        const lowerTranscript = finalTranscript.toLowerCase().trim();
                        
                        // Check for commands
                        const isCommand = COMMAND_PHRASES.some(phrase => lowerTranscript.includes(phrase));

                        if (isCommand && readQuestionRef.current) {
                            toast.info("Repeating question...");
                            readQuestionRef.current(); // Call the function from ref
                            return; 
                        }

                        setUserAnswer(prev => prev + " " + finalTranscript);
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                };
            }
        }
    }, []); // 2. FIX: Dependency array is now empty and stable!

    useEffect(() => {
        setWordCount(userAnswer.trim().split(/\s+/).filter(Boolean).length);
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
                toast.error("Browser not supported. Use Chrome.");
                return;
            }

            try {
                recognitionRef.current?.start();
                setIsRecording(true);
                toast.success("Listening...");
            } catch (error) {
                // If it's already started, ignore error
                setIsRecording(true);
            }
        }
    }

    const toggleWebcam = () => {
        setIsWebcamActive(!isWebcamActive);
    }

    return (
        <div className="w-full space-y-6">
            {/* Video Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10" />
                
                {isWebcamActive ? (
                    <Webcam
                        mirrored={true}
                        style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center">
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
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Voice Recording</h3>
                        <Badge variant={isRecording ? "destructive" : "outline"} className="gap-2">
                             <div className={`h-2 w-2 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-gray-400'}`} />
                             {isRecording ? 'LISTENING' : 'PAUSED'}
                        </Badge>
                    </div>

                    <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        onClick={StartStopRecording}
                        className="w-full h-14"
                    >
                        {isRecording ? <><StopCircle className="mr-2"/> Stop Recording</> : <><Mic className="mr-2"/> Start Recording</>}
                    </Button>

                    <div className="bg-slate-50 p-4 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto border">
                        {userAnswer || <span className="text-muted-foreground">Answer will appear here...</span>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RecordAnswerSection