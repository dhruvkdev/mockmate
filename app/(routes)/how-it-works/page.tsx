"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Upload, MessageSquare, TrendingUp, Download, ArrowRight } from 'lucide-react'

const steps = [
    {
        number: 1,
        title: 'Upload Your Resume or Enter Job Details',
        description: 'Start by uploading your resume (PDF) or manually entering the job title and description you\'re preparing for.',
        icon: Upload
    },
    {
        number: 2,
        title: 'AI Generates Custom Questions',
        description: 'Our AI analyzes your profile and creates personalized interview questions tailored to your experience and target role.',
        icon: MessageSquare
    },
    {
        number: 3,
        title: 'Take the Live Interview',
        description: 'Practice with our AI interviewer using speech-to-text. Answer questions naturally as you would in a real interview.',
        icon: TrendingUp
    },
    {
        number: 4,
        title: 'Get Detailed Feedback',
        description: 'Receive comprehensive feedback with ratings, correct answers, and improvement suggestions for each question. Download your report as PDF.',
        icon: Download
    }
]

function HowItWorks() {
    const router = useRouter()

    return (
        <div className='py-20 px-10 md:px-28 lg:px-44 xl:px-56'>
            <div className='text-center mb-16'>
                <h1 className='text-4xl md:text-5xl font-bold mb-6'>
                    How MockMate Works
                </h1>
                <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                    Four simple steps to ace your next interview. Our AI-powered platform guides you through realistic mock interviews and provides actionable feedback.
                </p>
            </div>

            <div className='max-w-4xl mx-auto space-y-12'>
                {steps.map((step, index) => {
                    const Icon = step.icon
                    return (
                        <div
                            key={index}
                            className='flex gap-8 items-start bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow'
                        >
                            <div className='flex-shrink-0'>
                                <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center'>
                                    <Icon className='w-8 h-8 text-purple-600' />
                                </div>
                            </div>

                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <span className='text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full'>
                                        Step {step.number}
                                    </span>
                                </div>
                                <h3 className='text-2xl font-bold mb-3'>{step.title}</h3>
                                <p className='text-gray-600 leading-relaxed'>{step.description}</p>
                            </div>

                            {index < steps.length - 1 && (
                                <div className='absolute left-8 mt-24 hidden lg:block'>
                                    <ArrowRight className='w-6 h-6 text-gray-300 rotate-90' />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className='text-center mt-16 space-y-4'>
                <Button
                    size="lg"
                    className='bg-purple-600 hover:bg-purple-700'
                    onClick={() => router.push('/dashboard')}
                >
                    Start Your First Mock Interview
                </Button>
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard')}
                    >
                        ← Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks
